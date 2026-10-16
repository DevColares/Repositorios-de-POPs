import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import { NotionToMarkdown } from 'notion-to-md';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// Custom transformer para callouts do Notion: preserva icone, titulo e cor
n2m.setCustomTransformer('callout', async (block: any) => {
  const { callout } = block;
  if (!callout) return '';

  const text = (callout.rich_text || [])
    .map((t: any) => t.plain_text)
    .join('')
    .trim();
  const icon = callout.icon?.emoji || '💡';

  // Converte para um blockquote estilizado que o marked renderiza bem
  return `> ${icon} **Aviso:** ${text}`;
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

export interface ProcessSOP {
  id: string;
  codigo: string;
  titulo: string;
  areaMacro: string;
  subcategoria: string;
  categoriaEspecifica: string[];
  responsavel: string[];
  status: string;
  lastEdited: string;
  objetivo: string;
}

/**
 * Extrai o primeiro texto plano de uma propriedade do Notion,
 * suportando os tipos mais comuns: title, rich_text, select e status.
 */
function getTextProp(prop: any): string {
  if (!prop) return '';
  if (prop.title?.length) return prop.title[0].plain_text || '';
  if (prop.rich_text?.length) return prop.rich_text[0].plain_text || '';
  if (prop.select?.name) return prop.select.name;
  if (prop.status?.name) return prop.status.name;
  return '';
}

/**
 * Extrai um array de valores de propriedades do tipo multi_select.
 */
function getMultiSelectProp(prop: any): string[] {
  if (!prop?.multi_select?.length) return [];
  return prop.multi_select.map((item: any) => item.name).filter(Boolean);
}

export async function getProcessosFromNotion(): Promise<ProcessSOP[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Status',
        rich_text: {
          does_not_contain: 'Obsoleto',
        },
      },
      sorts: [{ property: 'Código', direction: 'ascending' }],
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        codigo: getTextProp(props['Código']) || 'S/N',
        titulo: getTextProp(props['Processos']) || getTextProp(props['Processo']) || 'Sem título',
        areaMacro: getTextProp(props['Área Macro']) || 'Geral',
        subcategoria: getTextProp(props['Subcategoria']) || 'Geral',
        categoriaEspecifica: getMultiSelectProp(props['Categoria Específica']),
        responsavel: getMultiSelectProp(props['Responsável']),
        status: getTextProp(props['Status']) || 'Ativo',
        lastEdited: page.last_edited_time,
        objetivo: '',
      };
    });
  } catch (error) {
    console.error('Erro ao conectar na API do Notion:', error);
    throw error;
  }
}

export async function getProcessContent(pageId: string): Promise<string> {
  try {
    const mdblocks = await n2m.pageToMarkdown(pageId, 2);
    const mdString = n2m.toMarkdownString(mdblocks);
    return mdString.parent || '';
  } catch (error) {
    console.error('Erro ao buscar conteúdo da página:', error);
    return '';
  }
}
