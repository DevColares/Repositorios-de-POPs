import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import { NotionToMarkdown } from 'notion-to-md';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// Helper para aplicar annotations básicas do Notion a rich_text
function richTextToMarkdown(richText: any[]): string {
  return (richText || [])
    .map((t: any) => {
      let text = t.plain_text || '';
      const annotations = t.annotations || {};
      if (annotations.code && text.trim()) text = `\`${text}\``;
      if (annotations.bold && text.trim()) text = `**${text}**`;
      if (annotations.italic && text.trim()) text = `_${text}_`;
      if (annotations.strikethrough && text.trim()) text = `~~${text}~~`;
      if (annotations.underline && text.trim()) text = `<u>${text}</u>`;
      if (t.href) text = `[${text}](${t.href})`;
      return text;
    })
    .join('');
}

// Custom transformer para callouts do Notion: preserva icone, titulo e cor
n2m.setCustomTransformer('callout', async (block: any) => {
  const { callout } = block;
  if (!callout) return '';

  const text = richTextToMarkdown(callout.rich_text);
  const icon = callout.icon?.emoji || '💡';

  // Converte para um blockquote estilizado que o marked renderiza bem
  return `> ${icon} **Aviso:** ${text}`;
});

// notion-to-md v3.1.9 só converte heading_1/2/3. Adicionamos suporte a
// heading_4, heading_5 e heading_6 para que eles não apareçam como texto simples.
(['heading_4', 'heading_5', 'heading_6'] as const).forEach((type, idx) => {
  const level = 4 + idx; // 4, 5, 6
  n2m.setCustomTransformer(type, async (block: any) => {
    const heading = block[type];
    if (!heading) return '';
    const text = richTextToMarkdown(heading.rich_text);
    return `${'#'.repeat(level)} ${text}`;
  });
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

/**
 * Extrai a lista de responsáveis/executantes de forma tolerante,
 * suportando vários nomes de propriedade e tipos do Notion.
 */
function getResponsaveis(props: Record<string, any>): string[] {
  const possibleNames = ['Responsável', 'Responsaveis', 'Responsáveis', 'Executante', 'Executantes', 'Owner', 'Owners'];

  for (const name of possibleNames) {
    const prop = props[name];
    if (!prop) continue;

    if (prop.multi_select?.length) {
      return prop.multi_select.map((item: any) => item.name).filter(Boolean);
    }
    if (prop.people?.length) {
      return prop.people
        .map((p: any) => p.name || p.person?.name || p.person?.email)
        .filter(Boolean);
    }
    if (prop.select?.name) return [prop.select.name];
    if (prop.status?.name) return [prop.status.name];
    if (prop.rich_text?.length) {
      const text = prop.rich_text.map((t: any) => t.plain_text).filter(Boolean).join(', ');
      if (text) return [text];
    }
    if (prop.title?.length) {
      const text = prop.title.map((t: any) => t.plain_text).filter(Boolean).join(', ');
      if (text) return [text];
    }
  }

  return [];
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

    // Debug: descomente para conferir os nomes/tipos das propriedades no console
    // if (response.results.length > 0) {
    //   console.log('[getProcessosFromNotion] propriedades:', Object.keys(response.results[0].properties));
    //   console.log('[getProcessosFromNotion] exemplo:', response.results[0].properties);
    // }

    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        codigo: getTextProp(props['Código']) || 'S/N',
        titulo: getTextProp(props['Processos']) || getTextProp(props['Processo']) || 'Sem título',
        areaMacro: getTextProp(props['Área Macro']) || 'Geral',
        subcategoria: getTextProp(props['Subcategoria']) || 'Geral',
        categoriaEspecifica: getMultiSelectProp(props['Categoria Específica']),
        responsavel: getResponsaveis(props),
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
    const corrected = renumberLists(raw);
    // Debug: ajuda a conferir se headings e numeração estão corretos no servidor
    // console.log('[getProcessContent] pageId:', pageId, '\n', corrected);
    return corrected;
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
 * por nível de indentação, resetando o contador quando:
 * - Aparece um título (heading) ou divisor (---), ou
 * - Uma nova lista reinicia em "1." após uma linha em branco.
 */
function renumberLists(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  // Mapeia indentação (nº de espaços) → contador atual
  const counters = new Map<number, number>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Linha de item numerado: captura indentação, número antigo e texto
    const m = line.match(/^( *)(\d+)\. ([\s\S]*)/);

    if (m) {
      const indent = m[1].length;
      const text = m[3];

      // Remove contadores de níveis mais profundos (saiu de sub-lista)
      for (const k of Array.from(counters.keys())) {
        if (k > indent) counters.delete(k);
      }

      const count = (counters.get(indent) ?? 0) + 1;
      counters.set(indent, count);
      out.push(`${m[1]}${count}. ${text}`);

    } else if (/^[ \t]*#{1,6}[ \t]+/.test(line) || /^[ \t]*-{3,}\s*$/.test(line)) {
      // Título (h1–h6) ou divisor → inicia nova seção → reseta todos os contadores
      counters.clear();
      out.push(line);

    } else if (line.trim() === '') {
      // Linha em branco: verifica se a próxima lista reinicia em "1."
      let nextIdx = i + 1;
      while (nextIdx < lines.length && lines[nextIdx].trim() === '') nextIdx++;
      const nextLine = lines[nextIdx] || '';
      const nextM = nextLine.match(/^( *)(\d+)\. /);
      if (nextM && nextM[2] === '1') {
        counters.clear();
      }
      out.push(line);

    } else {
      // Parágrafo, callout, tabela etc. não resetam a lista — podem ser
      // conteúdo "dentro" de um item (notion-to-md os coloca no mesmo nível)
      out.push(line);
    }
  }

  return out.join('\n');
}
