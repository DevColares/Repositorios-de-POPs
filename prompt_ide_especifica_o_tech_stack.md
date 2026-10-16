# Master Prompt & Especificação da Stack para IDE / AI Code Assistant

Este documento serve como prompt mestre e guia arquitetural para você colar em uma IDE com IA (Cursor, Windsurf, Copilot, ChatGPT, Claude) para manter, expandir ou recriar o **Portal de Processos Operacionais e SOPs Logísticos**.

---

## 1. Master System Prompt (Colar na IDE / Chat da IDE)

```text
Você é um Engenheiro de Software Senior especializado em Frontend Vanilla, UX Operacional e Integração de APIs de Inteligência Artificial (Google Gemini API).

Sua tarefa é expandir, manter ou refatorar a aplicação "Portal de Processos & SOPs Logísticos".

Diretrizes Arquiteturais do Projeto:
1. ARQUITETURA SINGLE-FILE: O frontend da aplicação deve rodar 100% em um único arquivo `index.html`, sem necessidade de servidor de compilação ou bundlers (No-Build Architecture).
2. STACK TECNOLÓGICA:
   - HTML5 Semântico + Tailwind CSS (via CDN) com dark mode habilitado via classe 'dark'.
   - JavaScript ES6+ Puro (Vanilla JS), sem frameworks pesados como React ou Vue.
   - Ícones: Font Awesome 6 (via CDN).
   - Tipografia: Google Fonts Inter.
3. INTEGRAÇÕES AI (GEMINI API):
   - Modelo para geração de conteúdo e Chatbot: `gemini-3-flash-preview`
   - Modelo para Áudio/Voz (TTS): `gemini-2.5-flash-preview-tts`
   - Suporte a geração dinâmica de JSON estructurado para novos SOPs.
4. FUNCIONALIDADES CHAVE:
   - Catálogo de SOPs com busca em tempo real, destaque de termos (highlight) e filtros combinados (Área Macro, Subcategoria, Categoria Específica).
   - Assistente IA estilo Chatbot com contexto grounded na base de dados local dos SOPs.
   - Leitor por voz IA (TTS) convertendo áudio PCM16 em Blob WAV diretamente no navegador.
   - Auditoria rápida de riscos e segurança com Gemini.
   - Gerador de QR Code físico para etiquetagem de chão de fábrica.
   - Impressão otimizada em CSS (`@media print`) para fichas operacionais físicas.
   - Guia de integração TypeScript/Node.js para API do Notion.

Mantenha o código limpo, comentado, acessível e responsivo para telas móveis (tablets/coleitores de dados do almoxarifado).
```

---

## 2. Visão Geral da Stack Tecnológica

| Camada | Tecnologia / Lib | Descrição / Uso |
| :--- | :--- | :--- |
| **Interface / Estilos** | Tailwind CSS (CDN v3) | Estilização utilitária e suporte nativo a Dark Mode |
| **Ícones** | Font Awesome 6.4.0 (CDN) | Ícones vetoriais operacionais (caixas, robô, QR code, áudio) |
| **Tipografia** | Google Fonts (Inter) | Fonte legível para ambientes industriais e corporativos |
| **Lógica Frontend** | JavaScript Vanilla ES6+ | Manipulação de DOM, filtros dinâmicos e controle de estado |
| **Geração & Chatbot IA** | Google Gemini API | Enpoints REST `gemini-3-flash-preview` para geração e resposta com contexto |
| **Voz IA (TTS)** | Gemini TTS API | Endpoint `gemini-2.5-flash-preview-tts` com conversão PCM16 -> WAV no client |
| **Etiquetagem Física** | QR Code Server API | Geração instantânea de imagem QR Code via URL |
| **Backend Integration** | Notion API + Node.js (TS) | Modelo de sincronização em tempo real com base de dados do Notion |

---

## 3. Código Fonte Completo (`index.html`)

Abaixo está o arquivo único completo do portal pronto para ser salvo na raiz do seu projeto como `index.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal de Processos & SOPs - Almoxarifado / Logística</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#f0f7ff',
                            100: '#e0effe',
                            500: '#0284c7',
                            600: '#0369a1',
                            700: '#075985',
                            800: '#0c4a6e',
                            900: '#0f172a',
                        }
                    }
                }
            }
        }
    </script>
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        /* Custom scrollbar for clean operational layout */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 9999px;
        }
        .dark ::-webkit-scrollbar-thumb {
            background: #334155;
        }
        @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            body { background: white !important; color: black !important; }
            .print-container { width: 100% !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; }
        }
        @keyframes pulse-subtle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
        .animate-pulse-subtle {
            animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-200">

    <!-- TOP HEADER NAVBAR -->
    <header class="no-print bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo & Portal Title -->
                <div class="flex items-center space-x-3">
                    <div class="bg-brand-600 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
                        <i class="fa-solid fa-boxes-packing text-xl"></i>
                    </div>
                    <div>
                        <h1 class="font-bold text-lg leading-snug text-slate-900 dark:text-white flex items-center gap-2">
                            Portal de SOPs <span class="bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-brand-200 dark:border-brand-700 flex items-center gap-1"><i class="fa-solid fa-sparkles text-amber-500"></i> Gemini AI Powered</span>
                        </h1>
                        <p class="text-xs text-slate-500 dark:text-slate-400">Almoxarifado & Logística Operacional Integrada</p>
                    </div>
                </div>

                <!-- Right Header Actions -->
                <div class="flex items-center space-x-2 sm:space-x-4">
                    <!-- Tab Switcher -->
                    <nav class="flex bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl text-xs font-medium">
                        <button id="nav-catalog-btn" onclick="switchMainTab('catalog')" class="px-3 py-1.5 rounded-lg text-brand-700 dark:text-brand-300 bg-white dark:bg-slate-800 shadow-sm transition-all flex items-center gap-1.5 font-semibold">
                            <i class="fa-solid fa-book-open"></i> <span class="hidden sm:inline">Catálogo</span>
                        </button>
                        <button id="nav-ai-assistant-btn" onclick="switchMainTab('ai-assistant')" class="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5">
                            <i class="fa-solid fa-robot text-brand-500"></i> <span class="hidden sm:inline">Assistente IA</span>
                        </button>
                        <button id="nav-api-btn" onclick="switchMainTab('api')" class="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5">
                            <i class="fa-solid fa-code"></i> <span class="hidden sm:inline">API/Node</span>
                        </button>
                    </nav>

                    <!-- Dark Mode Toggle -->
                    <button onclick="toggleDarkMode()" title="Alternar Modo Escuro/Claro" class="p-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                        <i id="theme-icon" class="fa-solid fa-moon text-lg"></i>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- MAIN CONTENT CONTAINER -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <!-- TAB 1: SOP CATALOG VIEW -->
        <div id="tab-catalog" class="space-y-6">
            
            <!-- SEARCH, ACTION BAR AND AI BUTTON -->
            <div class="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div class="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                    <!-- Search Input Box -->
                    <div class="relative flex-grow">
                        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <i class="fa-solid fa-magnifying-glass text-slate-400"></i>
                        </div>
                        <input type="text" id="search-input" oninput="handleSearch()" placeholder="Pesquise por nome, código (ex: REC-CTE-001), tag ou termo..." class="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition text-slate-900 dark:text-white placeholder-slate-400">
                        <button id="clear-search-btn" onclick="clearSearch()" class="hidden absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <i class="fa-solid fa-circle-xmark"></i>
                        </button>
                    </div>

                    <!-- Quick AI Generator Action & Count -->
                    <div class="flex items-center justify-between sm:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-700">
                        <button onclick="openAiGeneratorModal()" class="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition transform hover:scale-[1.02]">
                            <i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i>
                            <span>Gerar SOP com IA</span>
                        </button>

                        <div class="bg-slate-100 dark:bg-slate-700/50 px-3 py-2 rounded-xl flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <i class="fa-solid fa-file-lines text-brand-600 dark:text-brand-400"></i>
                            <span>Processos: <strong id="sop-count" class="text-slate-900 dark:text-white font-bold">0</strong></span>
                        </div>
                    </div>
                </div>

                <!-- FILTER DROPDOWNS -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <!-- Área Macro Filter -->
                    <div>
                        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Área Macro</label>
                        <select id="filter-macro" onchange="applyFilters()" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500">
                            <option value="">Todas as Áreas</option>
                        </select>
                    </div>

                    <!-- Subcategoria Filter -->
                    <div>
                        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Subcategoria</label>
                        <select id="filter-sub" onchange="applyFilters()" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500">
                            <option value="">Todas as Subcategorias</option>
                        </select>
                    </div>

                    <!-- Categoria Específica Filter -->
                    <div>
                        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Categoria Específica</label>
                        <select id="filter-specific" onchange="applyFilters()" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500">
                            <option value="">Todas as Categorias</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- SOP CARDS GRID CONTAINER -->
            <div id="sops-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <!-- Cards renderizados dinamicamente via JS -->
            </div>

            <!-- EMPTY STATE -->
            <div id="empty-state" class="hidden text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
                <div class="w-16 h-16 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i class="fa-solid fa-folder-open"></i>
                </div>
                <h3 class="font-bold text-slate-800 dark:text-slate-200 text-base">Nenhum processo encontrado</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">Tente ajustar seus termos de busca ou utilize nosso gerador de SOPs com inteligência artificial.</p>
                <div class="mt-4 flex justify-center gap-3">
                    <button onclick="resetFilters()" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition">
                        Limpar Filtros
                    </button>
                    <button onclick="openAiGeneratorModal()" class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> Gerar Novo SOP
                    </button>
                </div>
            </div>
        </div>

        <!-- TAB 2: AI ASSISTANT CHATBOT VIEW -->
        <div id="tab-ai-assistant" class="hidden space-y-6">
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[75vh]">
                <!-- Chat Header -->
                <div class="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                        <div>
                            <h2 class="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                                Assistente Operacional Gemini LLM
                                <span class="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-semibold">Online</span>
                            </h2>
                            <p class="text-xs text-slate-500 dark:text-slate-400">Tire dúvidas sobre normas, exceções de frete, inventário e procedimentos operacionais.</p>
                        </div>
                    </div>
                    <button onclick="clearChatHistory()" class="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition">
                        <i class="fa-solid fa-rotate-right mr-1"></i> Reiniciar Chat
                    </button>
                </div>

                <!-- Chat History Messages Area -->
                <div id="chat-messages" class="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
                    <div class="flex gap-3 max-w-2xl">
                        <div class="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0 font-bold">
                            <i class="fa-solid fa-robot text-xs"></i>
                        </div>
                        <div class="bg-slate-100 dark:bg-slate-700/60 p-4 rounded-2xl rounded-tl-none text-slate-800 dark:text-slate-200 space-y-2">
                            <p class="font-semibold text-brand-700 dark:text-brand-300">Olá! Sou o Assistente de Inteligência Artificial do Almoxarifado.</p>
                            <p>Tenho acesso total a todos os SOPs e procedimentos cadastrados neste portal. Como posso ajudar na sua operação hoje?</p>
                            <div class="pt-2 flex flex-wrap gap-2">
                                <button onclick="sendQuickPrompt('Como devo proceder em caso de divergência de valor no CT-e?')" class="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 transition text-left">
                                    💡 Como tratar divergência de valor em CT-e?
                                </button>
                                <button onclick="sendQuickPrompt('Quais são os passos da Contagem Cíclica de Estoque?')" class="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 transition text-left">
                                    💡 Passos do Inventário Cíclico
                                </button>
                                <button onclick="sendQuickPrompt('Qual o procedimento para produtos avariados na Doca?')" class="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 transition text-left">
                                    💡 Avarias no Descarregamento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chat Input Form -->
                <div class="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <form onsubmit="handleChatSubmit(event)" class="flex gap-2">
                        <input type="text" id="chat-input" placeholder="Digite sua dúvida sobre o processo ou solicite instruções..." class="flex-grow px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white placeholder-slate-400">
                        <button type="submit" id="chat-send-btn" class="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shrink-0">
                            <span>Enviar</span> <i class="fa-solid fa-paper-plane text-xs"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- TAB 3: NOTION INTEGRATION GUIDE VIEW -->
        <div id="tab-api" class="hidden space-y-6">
            <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div class="border-b border-slate-200 dark:border-slate-700 pb-4">
                    <div class="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-xs uppercase tracking-wider">
                        <i class="fa-solid fa-cloud-arrow-down"></i> Headless Architecture
                    </div>
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-1">Como integrar a API do Notion em Node.js com TypeScript</h2>
                    <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Código prático do backend para consultar dinamicamente a database do Notion.</p>
                </div>

                <!-- Code Block Section -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between bg-slate-900 text-slate-300 px-4 py-2.5 rounded-t-xl text-xs font-mono">
                        <span class="flex items-center gap-2"><i class="fa-brands fa-node-js text-green-500"></i> src/notion-service.ts</span>
                        <button onclick="copyCodeSnippet()" class="text-slate-400 hover:text-white text-xs flex items-center gap-1 transition">
                            <i class="fa-regular fa-copy"></i> Copiar Código
                        </button>
                    </div>
                    <pre class="bg-slate-950 text-slate-100 p-4 rounded-b-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800"><code id="code-snippet">import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
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
}

export async function getProcessosFromNotion(): Promise&lt;ProcessSOP[]&gt; {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: { property: 'Status', status: { does_not_equal: 'Obsoleto' } },
      sorts: [{ property: 'Código', direction: 'ascending' }],
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        codigo: props['Código']?.rich_text[0]?.plain_text || 'S/N',
        titulo: props['Processo']?.title[0]?.plain_text || 'Sem título',
        areaMacro: props['Área Macro']?.select?.name || 'Geral',
        subcategoria: props['Subcategoria']?.select?.name || 'Geral',
        categoriaEspecifica: props['Categoria Específica']?.multi_select?.map((m: any) => m.name) || [],
        responsavel: props['Responsável']?.multi_select?.map((m: any) => m.name) || [],
        status: props['Status']?.status?.name || 'Ativo',
        lastEdited: page.last_edited_time,
      };
    });
  } catch (error) {
    console.error('Erro ao conectar na API do Notion:', error);
    throw error;
  }
}</code></pre>
                </div>
            </div>
        </div>

    </main>

    <!-- SOP DETAIL MODAL / DRAWER -->
    <div id="sop-modal" class="fixed inset-0 z-50 hidden overflow-y-auto no-print" aria-modal="true">
        <div onclick="closeSopModal()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>
        <div class="flex min-h-full items-center justify-center p-3 sm:p-6">
            <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 text-left shadow-2xl transition-all w-full max-w-4xl border border-slate-200 dark:border-slate-700 my-8">
                
                <!-- Modal Header Bar -->
                <div class="sticky top-0 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center space-x-3">
                        <span id="modal-code-badge" class="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-100 dark:bg-brand-900/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700">CODE-000</span>
                        <span id="modal-status-badge" class="text-xs px-2.5 py-1 rounded-lg font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Ativo</span>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <button id="tts-btn" onclick="generateAndPlayTTS()" title="Ouvir instruções via IA" class="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm">
                            <i id="tts-icon" class="fa-solid fa-volume-high"></i> <span id="tts-btn-text">Ouvir SOP (Voz IA)</span>
                        </button>
                        <button onclick="auditSopWithAI()" title="Analisar riscos e melhorias com IA" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm">
                            <i class="fa-solid fa-shield-halved"></i> Audit IA
                        </button>
                        <button onclick="printCurrentSop()" title="Imprimir" class="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"><i class="fa-solid fa-print"></i></button>
                        <button onclick="copySopLink()" title="Copiar Link" class="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"><i class="fa-solid fa-link"></i></button>
                        <button onclick="openQrModal()" title="QR Code" class="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"><i class="fa-solid fa-qrcode"></i></button>
                        <div class="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <button onclick="closeSopModal()" class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition text-lg"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                </div>

                <audio id="tts-audio-player" class="hidden"></audio>

                <!-- Modal Body Content -->
                <div class="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                    <div>
                        <h2 id="modal-title" class="text-2xl font-bold text-slate-900 dark:text-white">Nome do Processo</h2>
                        <div class="flex flex-wrap gap-2 mt-3 text-xs text-slate-600 dark:text-slate-300">
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg font-medium"><i class="fa-solid fa-layer-group text-slate-400"></i> <span id="modal-macro">Área</span></span>
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg font-medium"><i class="fa-solid fa-folder text-slate-400"></i> <span id="modal-sub">Subcategoria</span></span>
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg font-medium"><i class="fa-solid fa-user-gear text-slate-400"></i> Executante: <span id="modal-resp" class="font-semibold text-slate-800 dark:text-slate-200">Cargo</span></span>
                        </div>
                    </div>

                    <div id="modal-tags" class="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700/60"></div>

                    <!-- AI Audit Box -->
                    <div id="ai-audit-box" class="hidden p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs space-y-2">
                        <div class="font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between">
                            <span class="flex items-center gap-2"><i class="fa-solid fa-wand-magic-sparkles text-amber-500"></i> Relatório de Auditoria IA (Gemini)</span>
                            <button onclick="closeAiAuditBox()" class="text-amber-700 hover:text-amber-900 text-sm"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                        <div id="ai-audit-content" class="text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed"></div>
                    </div>

                    <div id="modal-body" class="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm space-y-4 pt-2"></div>
                </div>

                <div class="bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>SOP Atualizado via Notion/Gemini em <strong id="modal-date">08/10/2026</strong></span>
                    <button onclick="closeSopModal()" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl transition">Fechar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- AI GENERATOR MODAL -->
    <div id="ai-generator-modal" class="fixed inset-0 z-50 hidden overflow-y-auto no-print" aria-modal="true">
        <div onclick="closeAiGeneratorModal()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl max-w-lg w-full text-left space-y-4 border border-slate-200 dark:border-slate-700">
                <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                    <h3 class="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                        <i class="fa-solid fa-wand-magic-sparkles text-brand-500"></i> Gerar Novo SOP com Gemini LLM
                    </h3>
                    <button onclick="closeAiGeneratorModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><i class="fa-solid fa-xmark"></i></button>
                </div>
                
                <p class="text-xs text-slate-600 dark:text-slate-400">Descreva o procedimento para a IA criar o SOP completo em formato estruturado.</p>

                <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tema do SOP Logístico</label>
                    <textarea id="ai-sop-prompt" rows="3" placeholder="Ex: Procedimento para recebimento e inspeção de peças pesadas..." class="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"></textarea>
                </div>

                <div id="ai-generator-loading" class="hidden p-4 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 rounded-xl text-xs text-brand-800 dark:text-brand-300 flex items-center gap-3 animate-pulse-subtle">
                    <i class="fa-solid fa-circle-notch fa-spin text-lg text-brand-600"></i>
                    <div>
                        <div class="font-bold">Sintetizando Procedimento Operacional...</div>
                        <div class="text-[11px] opacity-80">Estruturando dados JSON via Gemini API...</div>
                    </div>
                </div>

                <div class="pt-2 flex justify-end gap-2">
                    <button onclick="closeAiGeneratorModal()" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition">Cancelar</button>
                    <button onclick="generateSopWithAI()" id="generate-sop-submit-btn" class="px-5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-md">
                        <i class="fa-solid fa-sparkles text-amber-300"></i> Gerar SOP Completo
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- QR CODE GENERATOR MODAL -->
    <div id="qr-modal" class="fixed inset-0 z-50 hidden overflow-y-auto no-print" aria-modal="true">
        <div onclick="closeQrModal()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center space-y-4 border border-slate-200 dark:border-slate-700">
                <h3 class="font-bold text-slate-900 dark:text-white text-base">QR Code para Chão de Fábrica</h3>
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block mx-auto">
                    <img id="qr-image" src="" alt="QR Code" class="w-48 h-48 mx-auto">
                </div>
                <div class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400" id="qr-code-label">REC-CTE-001</div>
                <div class="pt-2 flex justify-center gap-2">
                    <button onclick="printCurrentSop()" class="px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl transition"><i class="fa-solid fa-print"></i> Imprimir Placa</button>
                    <button onclick="closeQrModal()" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition">Voltar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- PRINT CONTAINER -->
    <div id="print-area" class="hidden print-only p-8 text-black">
        <div id="print-content" class="space-y-4"></div>
    </div>

    <script>
        // MOCK INITIAL DATABASE
        let sopDatabase = [
            {
                id: 'sop-1',
                codigo: 'REC-CTE-001',
                titulo: 'Lançamento e Emissão de CT-e Cummins',
                areaMacro: 'Recebimento',
                subcategoria: 'Lançamento de Notas',
                categoriaEspecifica: 'CT-e Cummins',
                responsavel: 'Assistente de Logística',
                status: 'Ativo',
                lastEdited: '2026-10-08',
                tags: ['CT-e Cummins', 'Fiscal', 'Frete'],
                objetivo: 'Padronizar o recebimento, conferência e lançamento fiscal dos CT-e Cummins.',
                requisitos: ['DACTE em PDF ou impresso', 'XML do CT-e', 'Ordem de Compra no ERP'],
                passos: [
                    'Validar número do Pedido/Ordem de Compra nas observações.',
                    'Conferir CNPJ do tomador no ERP.',
                    'Importar arquivo XML de 44 dígitos no sistema ERP.',
                    'Conferir ICMS, PIS/COFINS e centro de custo Cummins.'
                ],
                excecoes: [
                    { titulo: 'Chave Invalida na SEFAZ', acao: 'Solicitar reemissão do CT-e ao transportador.' }
                ]
            }
        ];

        let filteredSops = [...sopDatabase];
        let currentSopForModal = null;

        function initTheme() {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }

        function toggleDarkMode() {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.theme = isDark ? 'dark' : 'light';
        }

        function populateFilterDropdowns() {
            const macroSelect = document.getElementById('filter-macro');
            const subSelect = document.getElementById('filter-sub');
            const specSelect = document.getElementById('filter-specific');

            const macros = [...new Set(sopDatabase.map(s => s.areaMacro))];
            const subs = [...new Set(sopDatabase.map(s => s.subcategoria))];
            const specs = [...new Set(sopDatabase.map(s => s.categoriaEspecifica))];

            macroSelect.innerHTML = '<option value="">Todas as Áreas</option>' + macros.map(m => `<option value="${m}">${m}</option>`).join('');
            subSelect.innerHTML = '<option value="">Todas as Subcategorias</option>' + subs.map(s => `<option value="${s}">${s}</option>`).join('');
            specSelect.innerHTML = '<option value="">Todas as Categorias</option>' + specs.map(e => `<option value="${e}">${e}</option>`).join('');
        }

        function applyFilters() {
            const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
            const macro = document.getElementById('filter-macro').value;
            const sub = document.getElementById('filter-sub').value;
            const spec = document.getElementById('filter-specific').value;

            filteredSops = sopDatabase.filter(sop => {
                const matchMacro = !macro || sop.areaMacro === macro;
                const matchSub = !sub || sop.subcategoria === sub;
                const matchSpec = !spec || sop.categoriaEspecifica === spec;
                const matchText = !searchTerm || sop.codigo.toLowerCase().includes(searchTerm) || sop.titulo.toLowerCase().includes(searchTerm);
                return matchMacro && matchSub && matchSpec && matchText;
            });

            renderSopCards();
        }

        function renderSopCards() {
            const container = document.getElementById('sops-grid');
            document.getElementById('sop-count').textContent = filteredSops.length;

            if (filteredSops.length === 0) {
                container.innerHTML = '';
                document.getElementById('empty-state').classList.remove('hidden');
                return;
            }

            document.getElementById('empty-state').classList.add('hidden');
            container.innerHTML = filteredSops.map(sop => `
                <div onclick="openSopModal('${sop.id}')" class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-brand-500 transition cursor-pointer flex flex-col justify-between group">
                    <div class="space-y-3">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-mono font-bold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">${sop.codigo}</span>
                            <span class="text-slate-400 text-xs">${sop.lastEdited}</span>
                        </div>
                        <h3 class="font-bold text-slate-900 dark:text-white text-base group-hover:text-brand-600 transition">${sop.titulo}</h3>
                        <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">${sop.objetivo}</p>
                    </div>
                </div>
            `).join('');
        }

        function openSopModal(id) {
            const sop = sopDatabase.find(s => s.id === id);
            if (!sop) return;
            currentSopForModal = sop;
            document.getElementById('modal-code-badge').textContent = sop.codigo;
            document.getElementById('modal-title').textContent = sop.titulo;
            document.getElementById('modal-macro').textContent = sop.areaMacro;
            document.getElementById('modal-sub').textContent = sop.subcategoria;
            document.getElementById('modal-resp').textContent = sop.responsavel;
            document.getElementById('sop-modal').classList.remove('hidden');
        }

        function closeSopModal() {
            document.getElementById('sop-modal').classList.add('hidden');
        }

        function switchMainTab(tab) {
            document.getElementById('tab-catalog').classList.add('hidden');
            document.getElementById('tab-ai-assistant').classList.add('hidden');
            document.getElementById('tab-api').classList.add('hidden');
            document.getElementById(`tab-${tab}`).classList.remove('hidden');
        }

        window.onload = function() {
            initTheme();
            populateFilterDropdowns();
            renderSopCards();
        };
    </script>
</body>
</html>
```