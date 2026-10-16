
# Objetivo


Padronizar o processo de importação, conferência, lançamento, digitalização, anexo e arquivamento das Notas Fiscais (NF) e documentos correlatos referentes às operações do cliente/fornecedor Cummins no sistema.


---


# Parâmetros e Dados Cadastrais


Ao realizar a configuração e os ajustes no sistema, utilizar os seguintes parâmetros:

- **TOP de Lançamento:** 1570
- **Código da Cidade (Cabeçalho):** 113
- **Configuração Financeiro/Imposto:** Usar dados do arquivo
- **Diretório de Arquivamento:** Suprimentos > 2026 > NF de Entrada > [Mês Vigente] > Cummins

---


# Passo a Passo do Processo


## 1. Importação do XML

- Acessar o **Portal de Importações XML**.
- Clicar em **Aplicar** e informar o número da Nota Fiscal (**Nº NF**).
- Executar a ação **Processar Documento**.

## 2. Configuração do Lançamento e Validação

- Definir a **TOP 1570**.
- Para evitar possíveis erros de validação nas abas _Financeiro_ e _Imposto_:
- Clicar na grade.
- Localizar as abas **Financeiro** e **Imposto**.
- Alterar a configuração de ambas para **Usar dados do arquivo**.
- Executar a opção **Validar Importação**.

## 3. Registro Físico e Ajustes no Cabeçalho

- Anotar o **Número Único (NU)** gerado diretamente no documento físico da NF.
- Abrir o documento no sistema.
- No cabeçalho, alterar o **Código da Cidade** para **113**.

## 4. Digitalização, Arquivamento e Anexo

- Digitalizar (scanner) os documentos físicos: **NF**, **CT-e** e **PIN** (se houver).
- Salvar o arquivo digitalizado no diretório da rede: **Suprimentos > 2026 > NF de Entrada > [Mês Vigente] > Cummins**.
- Renomear o arquivo conforme o padrão utilizado na pasta.
- Anexar os documentos digitalizados ao lançamento correspondente dentro do sistema.
- Enviar e-mail de confirmação do lançamento contendo os anexos correspondentes.

---


# Regras de Exceção e Observações


> ⚠️ **Aviso:** Divergências/Erros no Financeiro ou Imposto: Garantir que as opções nas abas Financeiro e Imposto estejam configuradas para "Usar dados do arquivo" antes de tentar revalidar a importação.


> ⚠️ **Aviso:** Ausência de PIN ou CT-e: Verificar a obrigatoriedade desses anexos junto à equipe de logística/suprimentos antes de concluir a etapa e enviar o e-mail de confirmação.


> ⚠️ **Aviso:** Identificação do NU: É indispensável registrar manualmente o número da NU na folha física da NF para rastreabilidade auditável.

