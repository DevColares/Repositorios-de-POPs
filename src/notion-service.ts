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
    const raw = mdString.parent || '';
    return renumberLists(raw);
  } catch (error) {
    console.error('Erro ao buscar conteúdo da página:', error);
    return '';
  }
}

/**
 * Corrige a numeração de listas ordenadas no markdown gerado pelo notion-to-md.
 *
 * O notion-to-md frequentemente converte todos os "numbered_list_item" do Notion
 * como "1." independente da posição — o número correto é dinâmico no Notion e
 * não está armazenado no bloco. Esta função reescreve os números em sequência
 * por nível de indentação, resetando o contador apenas quando um título (heading)
 * ou divisor (---) aparecer, que são os únicos elementos que genuinamente separam
 * listas distintas no Notion.
 */
function renumberLists(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  // Mapeia indentação (nº de espaços) → contador atual
  const counters = new Map<number, number>();

  for (const line of lines) {
    // Linha de item numerado: captura indentação, número antigo e texto
    const m = line.match(/^( *)(\d+)\. ([\s\S]*)/);
    if (m) {
      const indent = m[1].length;
      const text  = m[3];

      // Remove contadores de níveis mais profundos (saiu de sub-lista)
      counters.forEach((_, k) => { if (k > indent) counters.delete(k); });

      const count = (counters.get(indent) ?? 0) + 1;
      counters.set(indent, count);
      out.push(`${m[1]}${count}. ${text}`);

    } else if (/^#{1,6} /.test(line) || /^-{3,}$/.test(line)) {
      // Título ou divisor → inicia nova seção → reseta todos os contadores
      counters.clear();
      out.push(line);

    } else {
      // Parágrafo, callout, tabela etc. não resetam a lista — podem ser
      // conteúdo "dentro" de um item (notion-to-md os coloca no mesmo nível)
      out.push(line);
    }
  }

  return out.join('\n');
}
