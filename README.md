[![CI Manual Tests](https://github.com/pclinux-48/ci_testes_inteligentes/actions/workflows/ci.yml/badge.svg)](https://github.com/pclinux-48/ci_testes_inteligentes/actions/workflows/ci.yml)
[![CI AI-Assisted Tests](https://github.com/pclinux-48/ci_testes_inteligentes/actions/workflows/ci-ai.yml/badge.svg)](https://github.com/pclinux-48/ci_testes_inteligentes/actions/workflows/ci-ai.yml)

# ci_testes_inteligentes

Projeto da atividade de CI e automacao de testes com duas pipelines em `GitHub Actions`:

- `CI Manual Tests`: executa 2 testes escritos manualmente em `Playwright`.
- `CI AI-Assisted Tests`: executa 2 testes com apoio de IA generativa e localizadores resilientes inspirados em auto-healing.

## Ferramenta escolhida

- `Playwright`
- Justificativa: suporte nativo a `Chromium`, execucao headless no CI, boa estabilidade, relatorios HTML e produtividade alta para testes E2E.

## Aplicacao-alvo

- `https://automationexercise.com`
- Justificativa: aplicacao publica, acessivel, com `cadastro`, `login` e `menus de navegacao`, o que atende integralmente os requisitos da atividade.

## Estrutura do projeto

```text
.github/workflows/
tests/
  ai.spec.ts
  manual.spec.ts
  helpers/
  pages/
  utils/
playwright.config.ts
.env.example
```

## Instalacao

```bash
npm install
npx playwright install --with-deps chromium
```

## Configuracao local

1. Copie `.env.example` para `.env`.
2. Ajuste as variaveis se necessario.

Variaveis usadas:

- `BASE_URL`: URL base da aplicacao.
- `DEFAULT_PASSWORD`: senha usada nos cadastros dinamicos.

## Execucao dos testes

Executar todos:

```bash
npm test
```

Executar somente os testes manuais:

```bash
npm run test:manual
```

Executar os testes manuais vendo o navegador:

```bash
npm run test:manual:headed
```

Executar os testes manuais em modo debug passo a passo:

```bash
npm run test:manual:debug
```

Executar somente os testes com apoio de IA:

```bash
npm run test:ai
```

Executar os testes com IA vendo o navegador:

```bash
npm run test:ai:headed
```

Executar os testes com IA em modo debug passo a passo:

```bash
npm run test:ai:debug
```

Abrir o relatorio HTML:

```bash
npm run report
```

## O que cada pipeline faz

### Pipeline manual

- instala dependencias com cache de `npm`
- instala o browser `Chromium`
- executa `npm run test:manual`
- publica `logs`, `test-results` e `playwright-report` por 7 dias

### Pipeline com apoio de IA

- instala dependencias com cache de `npm`
- instala o browser `Chromium`
- executa `npm run test:ai`
- publica `logs`, `test-results` e `playwright-report` por 7 dias

## Metricas Coletadas

As duas pipelines geram automaticamente um resumo de metricas com base no relatorio JSON do Playwright.

As metricas registradas incluem:

- quantidade de testes executados
- quantidade de testes aprovados, falhos, ignorados e flaky
- tempo total de execucao
- tempo medio por teste
- taxa de sucesso da execucao
- quantidade de evidencias geradas, como screenshots, videos e traces
- cobertura funcional dos cenarios automatizados

Os resumos sao gerados na pasta `metrics/`, publicados como artefatos do GitHub Actions e tambem exibidos no resumo da execucao de cada workflow.

## Testes implementados

### Testes manuais

1. Cadastro de novo usuario com validacao de login e exclusao da conta.
2. Navegacao para a area de produtos com pesquisa de item e abertura de detalhes.

### Testes com apoio de IA

1. Cadastro com localizadores resilientes e fallbacks sugeridos a partir de IA generativa.
2. Login e navegacao com estrategia semantica de seletores e fluxo refinado com IA generativa.

## Como a IA foi usada

- geracao inicial de cenarios de teste
- refinamento de seletores
- proposta de validacoes adicionais
- apoio na criacao de localizadores resilientes inspirados em auto-healing

## Observacoes

- Os testes usam dados dinamicos para evitar conflito de emails ja cadastrados.
- Em caso de falha, o Playwright gera capturas e artefatos em `test-results/`.
