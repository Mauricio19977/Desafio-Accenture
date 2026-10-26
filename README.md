# Desafio QA Automation — Accenture

[![Testes E2E](https://github.com/Mauricio19977/Desafio-Accenture/actions/workflows/testes.yml/badge.svg)](https://github.com/Mauricio19977/Desafio-Accenture/actions/workflows/testes.yml)

Automação de testes de **API** e **Frontend** do [demoqa.com](https://demoqa.com) com **Cypress** e **Cucumber (BDD)** em JavaScript.

Os cenários estão escritos em **Gherkin em português**. O frontend segue o padrão **Page Object** e a API usa **Service Objects**. A massa de dados é gerada com **Faker**. Toda a suíte roda com um único comando e gera relatório HTML do Cucumber.

---

## Sumário

- [Stack](#stack)
- [Cobertura do desafio](#cobertura-do-desafio)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Arquitetura e padrões](#arquitetura-e-padrões)
- [Como executar](#como-executar)
- [Relatórios](#relatórios)
- [Decisões técnicas](#decisões-técnicas)
- [Bugs encontrados no demoqa](#bugs-encontrados-no-demoqa)
- [Solução de problemas](#solução-de-problemas)

---

## Stack

| Ferramenta | Versão | Uso |
|---|---|---|
| [Node.js](https://nodejs.org) | 22 LTS | Runtime |
| [Cypress](https://www.cypress.io) | 16.2 | Testes E2E de API (`cy.request`) e de UI |
| [@badeball/cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor) | 28 | Execução dos `.feature` (BDD) e relatórios HTML/JSON |
| [esbuild](https://esbuild.github.io) + [@bahmutov/cypress-esbuild-preprocessor](https://github.com/bahmutov/cypress-esbuild-preprocessor) | — | Bundler dos specs |
| [@faker-js/faker](https://fakerjs.dev) | 10 | Massa de dados aleatória (locale pt_BR) |
| [cypress-plugin-api](https://github.com/filiphric/cypress-plugin-api) | 2.12 | `cy.api()`: exibe request e response de cada chamada no runner do Cypress |
| GitHub Actions | — | Integração contínua com publicação do relatório |

---

## Cobertura do desafio

### Parte 1 — API (Book Store)

Arquivo: [`cypress/e2e/api/bookstore.feature`](cypress/e2e/api/bookstore.feature)

| Passo do desafio | Endpoint | Validações |
|---|---|---|
| Criar um usuário | `POST /Account/v1/User` | status 201, `userID` gerado, `username` e lista de livros vazia |
| Gerar token de acesso | `POST /Account/v1/GenerateToken` | status 200, `Success`, token preenchido e data de expiração no futuro |
| Confirmar que o usuário está autorizado | `POST /Account/v1/Authorized` | status 200 e corpo `true` |
| Listar os livros disponíveis | `GET /BookStore/v1/Books` | status 200, lista não vazia e contrato mínimo de cada livro |
| Alugar dois livros de livre escolha | `POST /BookStore/v1/Books` | status 201 e ISBNs retornados iguais aos enviados |
| Listar os detalhes do usuário com os livros | `GET /Account/v1/User/{userID}` | status 200, `userId`, `username`, exatamente 2 livros com títulos e ISBNs corretos |

O fluxo completo roda de forma contínua, em uma única execução. Também foram incluídos **cenários negativos**:

- senha fraca → `400` / código `1300`
- usuário duplicado → `406` / `User exists!`
- aluguel sem token → `401` / `User not authorized!`

Um hook `After` **exclui o usuário criado** em cada cenário (`DELETE /Account/v1/User/{userID}`), para não deixar lixo na base do demoqa.

### Parte 2 — Frontend

| Funcionalidade | Feature | O que é validado |
|---|---|---|
| Practice Form | [`practice_form.feature`](cypress/e2e/frontend/practice_form.feature) | Navegação pela home (Forms → Practice Form). O formulário é preenchido inteiro com dados aleatórios: nome, e-mail, gênero, celular, data pelo calendário, matérias, hobbies, endereço, estado e cidade. Upload do `.txt` versionado em [`cypress/fixtures/upload/`](cypress/fixtures/upload/arquivo-upload.txt), submit, conferência de **todas as linhas do popup** contra os dados enviados e fechamento do popup |
| Browser Windows | [`browser_windows.feature`](cypress/e2e/frontend/browser_windows.feature) | Clique em *New Window*. Valida que uma janela (não uma aba) foi aberta para `/sample`, valida a mensagem *"This is a sample page"* e fecha a janela, voltando à página de origem ([ver decisão](#browser-windows-múltiplas-janelas)) |
| Web Tables | [`web_tables.feature`](cypress/e2e/frontend/web_tables.feature) | Cria, edita e deleta um registro, validando cada coluna |
| Web Tables — **bônus** | [`web_tables.feature`](cypress/e2e/frontend/web_tables.feature) (`@bonus`) | Cria **12 registros dinâmicos** (quantidade parametrizada no Gherkin), valida todos, exclui todos e confirma que só restaram os 3 registros originais |
| Progress Bar | [`progress_bar.feature`](cypress/e2e/frontend/progress_bar.feature) | Start, parada **antes dos 25%**, validação de que a barra realmente parou com valor `≤ 25%`, novo Start até 100% e Reset (volta a 0%, fica parada e o botão volta a ser *Start*) |
| Sortable | [`sortable.feature`](cypress/e2e/frontend/sortable.feature) | Usa **somente drag and drop**: embaralha a lista e depois a ordena em **ordem crescente** (One → Six) |

---

## Estrutura do projeto

```
.
├── .github/workflows/testes.yml        # Pipeline de CI (GitHub Actions)
├── cypress/
│   ├── e2e/                            # Cenários BDD (Gherkin pt-BR)
│   │   ├── api/
│   │   │   └── bookstore.feature
│   │   └── frontend/
│   │       ├── browser_windows.feature
│   │       ├── practice_form.feature
│   │       ├── progress_bar.feature
│   │       ├── sortable.feature
│   │       └── web_tables.feature
│   ├── fixtures/
│   │   └── upload/arquivo-upload.txt   # Arquivo usado no upload do Practice Form
│   └── support/
│       ├── e2e.js                      # Setup global
│       ├── commands.js                 # Custom command cy.dragTo() (drag and drop HTML5)
│       ├── pages/                      # Page Objects (seletores + ações de cada tela)
│       ├── services/                   # Service Objects da API (Account e BookStore)
│       ├── step_definitions/           # Steps do Cucumber (api/ e frontend/)
│       └── utils/dataFactory.js        # Geração de massa de dados com Faker
├── cypress.config.js
└── package.json                        # Scripts e configuração do Cucumber
```

---

## Arquitetura e padrões

```
 .feature (Gherkin)  →  step_definitions  →  pages/ (UI)  ou  services/ (API)  →  demoqa.com
                                ↑
                      utils/dataFactory (Faker)
```

- **BDD com Cucumber:** os `.feature` descrevem o comportamento em linguagem de negócio. Os passos de navegação (`Dado que acesso o site demoqa`, `escolho a opção ... na página inicial`, `clico no submenu ...`) são reaproveitados por todas as features.
- **Page Object:** cada tela tem uma classe com um mapa `elements` (seletores isolados) e métodos de ação/validação. Os steps não conhecem seletores.
- **Service Object (API):** `AccountService` e `BookStoreService` só executam as requisições, com `failOnStatusCode: false`. As validações ficam nos steps, o que permite testar também respostas de erro.
- **Visualização da API com `cy.api()`:** as requisições usam o [cypress-plugin-api](https://github.com/filiphric/cypress-plugin-api) em vez de `cy.request()`. No `npm run cy:open`, cada chamada aparece na tela com método, URL, status, duração, body enviado, response formatado, headers e o comando cURL equivalente. Senha e token ficam visíveis de propósito: são dados descartáveis, gerados a cada execução, e o usuário é excluído no fim do cenário.
- **Data Factory:** cada execução usa dados novos (nomes pt_BR, e-mails únicos, datas, matérias, hobbies, estado/cidade coerentes). Assim não há colisão entre execuções.
- **Independência entre cenários:** a API limpa o usuário criado e a UI parte sempre da home.
- **Estabilidade:**
  - os domínios de anúncios são bloqueados (`blockHosts`), porque eles sobrepõem elementos e deixam as páginas lentas;
  - não há `cy.wait` fixo para sincronizar. A única espera fixa (500 ms) é proposital e aparece só na Progress Bar: ela prova que a barra *parou*;
  - as asserções aguardam o estado esperado;
  - há 1 retry em `cypress run`, como rede de segurança.

---

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org) 22 ou superior (exigência do Cypress 16)
- Google Chrome (opcional: o Cypress também roda no Electron embutido)

### Instalação

```bash
git clone https://github.com/Mauricio19977/Desafio-Accenture.git
cd Desafio-Accenture
npm install
```

### Comandos

| Comando | O que faz |
|---|---|
| `npm test` | Roda **toda a suíte** (API + Frontend) em modo headless |
| `npm run test:chrome` | Roda toda a suíte no Chrome headless |
| `npm run test:api` | Roda só a Parte 1 (tag `@api`) |
| `npm run test:front` | Roda só a Parte 2 (tag `@frontend`) |
| `npm run test:bonus` | Roda só o bônus dos 12 registros (tag `@bonus`) |
| `npm run test:bugs` | Roda os cenários que reproduzem os [bugs encontrados](#bugs-encontrados-no-demoqa). **Eles falham de propósito** |
| `npm run cy:open` | Abre o Cypress em modo interativo |

Por padrão, cenários com a tag `@bug` ficam fora da execução (`expose.tags = "not @bug"` em `cypress.config.js`).

Resultado esperado de `npm test`: **10 cenários, 10 passando** (≈ 1min40s).

---

## Relatórios

Cada execução gera em `reports/`:

- `cucumber-report.html`: relatório navegável com features, cenários, steps e screenshots das falhas
- `cucumber-report.json`: formato padrão do Cucumber, para integrar com outras ferramentas

No GitHub Actions, o relatório fica disponível como *artifact* (`relatorio-cucumber`) em cada execução.

---

## Decisões técnicas

### Browser Windows: múltiplas janelas

O Cypress executa a aplicação em uma única aba e [não controla janelas ou abas extras](https://docs.cypress.io/app/references/trade-offs#Multiple-tabs). Por isso a abordagem recomendada foi usada:

1. `window.open` é interceptado com `cy.stub`.
2. O teste valida que ele foi chamado **uma vez** com a URL `/sample`, o alvo `_blank` e as dimensões de janela (`width`/`height`). Isso diferencia a nova *janela* de uma nova *aba*.
3. O conteúdo da nova janela é aberto na aba de teste e a mensagem *"This is a sample page"* é validada.
4. "Fechar a janela" volta à página de origem, e o teste confirma que ela segue funcional.

### Progress Bar: parar antes dos 25%

A barra avança cerca de 1% a cada 100 ms. O teste espera a barra passar de 15% (com folga de 10 pontos em relação ao limite) e clica em *Stop*. Depois valida duas coisas:

- o valor ficou **> 0 e ≤ 25**;
- a barra **realmente parou**: o valor não muda após 500 ms.

A mesma verificação é feita ao chegar em 100%, **antes** de clicar em Reset, e depois do Reset, em 0%. Isso contorna o [bug 3](#bug-3--reset-da-progress-bar-logo-ao-chegar-em-100-faz-a-barra-recomeçar).

### Sortable: ordem crescente

Na versão atual do demoqa a lista já carrega em ordem crescente. Para que a ordenação seja de fato exercitada, o cenário primeiro **embaralha a lista via drag and drop**, na mesma ordem do print do desafio (`Six, Two, One, Four, Five, Three`). Depois ordena de forma crescente.

- A ordenação é genérica (*selection sort*): a cada posição, o item correto é arrastado até ela. Os valores são comparados numericamente (One = 1 … Six = 6).
- O componente usa **react-dnd com backend HTML5**. Por isso o custom command `cy.dragTo()` dispara a sequência real de eventos: `dragstart → dragenter → dragover → drop → dragend`, com um `DataTransfer` compartilhado.

### Practice Form: detalhes

- **Matérias, estado e cidade** são selecionados clicando na opção do autocomplete. Um `{enter}` sem opção destacada **submete o formulário** antes da hora.
- O popup é validado por inteiro: todas as 10 linhas são comparadas com os dados enviados, incluindo o formato da data (`05 March,1990`).
- O popup é fechado com a tecla **ESC**, porque o botão *Close* está quebrado no demoqa ([bug 1](#bug-1--botão-close-do-popup-do-practice-form-não-fecha)).

---

## Bugs encontrados no demoqa

Durante a automação foram encontrados três defeitos na versão atual do site. Os bugs 1 e 2 têm um cenário `@bug` que os reproduz (`npm run test:bugs`). Esses cenários ficam fora da execução padrão, para que a suíte principal continue verde. Quando o defeito for corrigido, o cenário passa a passar sem nenhuma alteração.

### Bug 1 — botão *Close* do popup do Practice Form não fecha

| | |
|---|---|
| **Passos** | Preencher o Practice Form → *Submit* → clicar em *Close* no popup |
| **Esperado** | O popup fecha |
| **Obtido** | O popup continua aberto e o console mostra `TypeError: findDOMNode is not a function` |
| **Causa provável** | `ReactDOM.findDOMNode` foi removido no React 19, mas a transição do modal ainda o usa |
| **Contorno** | Fechar com ESC ou clicando fora do modal (ambos funcionam) |

### Bug 2 — excluir um registro na Web Table apaga todos os registros adicionados

| | |
|---|---|
| **Passos** | Web Tables → adicionar 2 ou mais registros → excluir qualquer um deles (ou até um dos 3 originais) |
| **Esperado** | Apenas o registro escolhido é removido |
| **Obtido** | **Todos** os registros adicionados na sessão somem; só restam os originais (menos o excluído) |
| **Impacto no bônus** | O passo "deletar todos os novos registros" exclui pelo botão de delete cada registro que ainda está na tabela. Hoje um único clique já remove todos; com o bug corrigido serão 12 cliques. O resultado validado é o mesmo: nenhum registro criado na tabela e os 3 originais intactos |

### Bug 3 — Reset da Progress Bar logo ao chegar em 100% faz a barra recomeçar

| | |
|---|---|
| **Passos** | Progress Bar → *Start* → clicar em *Reset* assim que a barra mostrar 100% |
| **Esperado** | A barra volta a 0% e fica parada |
| **Obtido** | A barra volta a 0% e **recomeça sozinha** até 100% |
| **Causa** | No código do componente, o timer só é cancelado quando o contador passa de 100 (`runningTime > 100`), um tick (100 ms) depois de a tela já mostrar 100% e o botão Reset. O `handleReset` não cancela o timer |
| **Como foi encontrado** | O teste passava localmente e falhou no GitHub Actions, onde o clique caiu nessa janela de 100 ms. Não há cenário `@bug` porque a reprodução depende de clicar dentro dessa janela, o que não é determinístico |

---

## Solução de problemas

**`Cypress.exe: bad option: --smoke-test` ao rodar pelo terminal do VS Code.** O terminal integrado de alguns editores baseados em Electron exporta `ELECTRON_RUN_AS_NODE=1`, e essa variável quebra o binário do Cypress. Remova a variável antes de rodar:

```bash
# Git Bash / Linux / macOS
unset ELECTRON_RUN_AS_NODE && npm test
```

```powershell
# PowerShell
Remove-Item Env:ELECTRON_RUN_AS_NODE; npm test
```

**Aviso "The Electron browser is deprecated".** O Cypress 16 marca o Electron como deprecado, mas ele ainda funciona. Para evitar o aviso, use `npm run test:chrome`.

**Instabilidade do demoqa.** O site é público e às vezes fica lento ou fora do ar. Se várias falhas acontecerem de uma vez em pontos diferentes, verifique se https://demoqa.com está respondendo.
