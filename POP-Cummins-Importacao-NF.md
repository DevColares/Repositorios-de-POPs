# Importação, Conferência e Arquivamento de NF – Cummins

## Objetivo

Padronizar o processo de importação, conferência, lançamento, digitalização, anexo e arquivamento das Notas Fiscais (NF) e documentos correlatos referentes às operações do cliente/fornecedor Cummins no sistema.

---

## Parâmetros e Dados Cadastrais

Ao realizar a configuração e os ajustes no sistema, utilizar os seguintes parâmetros:

- **TOP de Lançamento:** `1570`
- **Código da Cidade (Cabeçalho):** `113`
- **Configuração Financeiro/Imposto:** Usar dados do arquivo
- **Diretório de Arquivamento:** `Suprimentos > 2026 > NF de Entrada > [Mês Vigente] > Cummins`

---

## Passo a Passo do Processo

### 1. Importação do XML

1. Acessar o **Portal de Importações XML**.
2. Clicar em **Aplicar** e informar o número da Nota Fiscal (**Nº NF**).
3. Executar a ação **Processar Documento**.

### 2. Configuração do Lançamento e Validação

1. Definir a **TOP 1570**.
2. Para evitar possíveis erros de validação nas abas *Financeiro* e *Imposto*:
   1. Clicar na grade.
   2. Localizar as abas **Financeiro** e **Imposto**.
   3. Alterar a configuração de ambas para **Usar dados do arquivo**.
3. Executar a opção **Validar Importação**.

### 3. Registro Físico e Ajustes no Cabeçalho

1. Anotar o **Número Único (NU)** gerado diretamente no documento físico da NF.
2. Abrir o documento no sistema.
3. No cabeçalho, alterar o **Código da Cidade** para **113**.

### 4. Digitalização, Arquivamento e Anexo

1. Digitalizar (scanner) os documentos físicos: **NF**, **CT-e** e **PIN** (se houver).
2. Salvar o arquivo digitalizado no diretório da rede: `Suprimentos > 2026 > NF de Entrada > [Mês Vigente] > Cummins`.
3. Renomear o arquivo conforme o padrão utilizado na pasta.
4. Anexar os documentos digitalizados ao lançamento correspondente dentro do sistema.
5. Enviar e-mail de confirmação do lançamento contendo os anexos correspondentes.

---

## Regras de Exceção e Observações

> ⚠️ **Divergências/Erros no Financeiro ou Imposto:** Garantir que as opções nas abas *Financeiro* e *Imposto* estejam configuradas para "Usar dados do arquivo" antes de tentar revalidar a importação.

> ⚠️ **Ausência de PIN ou CT-e:** Verificar a obrigatoriedade desses anexos junto à equipe de logística/suprimentos antes de concluir a etapa e enviar o e-mail de confirmação.

> ⚠️ **Identificação do NU:** É indispensável registrar manualmente o número da NU na folha física da NF para rastreabilidade auditável.
