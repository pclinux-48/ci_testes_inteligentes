# Relatório Técnico Simplificado

- Título da atividade: Elaboração e execução de duas pipelines de CI e automação de testes
- Disciplina: Engenharia de Software
- Estudante: Paulo César Pereira

## Introdução

O objetivo desta atividade foi implementar duas pipelines de Integração Contínua com GitHub Actions e automatizar testes de interface em uma aplicação web pública. A ferramenta escolhida foi o Playwright, por oferecer boa integração com Node.js, execução headless em CI, relatórios HTML e suporte nativo ao navegador Chromium. A aplicação-alvo selecionada foi o site Automation Exercise, pois possui funcionalidades de cadastro, login e navegação por menus, atendendo aos requisitos da proposta.

## Configuração das pipelines

Foram criadas duas pipelines independentes no GitHub Actions. A primeira pipeline executa os testes manuais e a segunda executa os testes com apoio de IA. Ambas são disparadas em pushes para branches secundárias e em pull requests destinados à `main` ou `master`. Em cada execução, o workflow instala dependências com cache, instala o Chromium, executa os testes e publica artefatos como logs, relatório HTML e evidências de falha por 7 dias.

## Implementação dos testes

Na versão manual, foram implementados dois testes principais. O primeiro realiza o cadastro de um novo usuário, valida o login e, em seguida, exclui a conta criada. O segundo acessa a página de produtos, realiza uma busca por item e abre a página de detalhes do produto encontrado. Esses testes foram escritos com seletores diretos e validações objetivas.

Na versão com apoio de IA, os dois testes foram construídos com suporte de IA generativa para sugerir cenários, validações e alternativas de seletores. Além disso, foi criada uma camada de localizadores resilientes com fallbacks, inspirada em técnicas de auto-healing. O primeiro teste automatiza o cadastro completo com seletores semânticos e alternativos. O segundo cobre login e navegação, priorizando localização robusta dos elementos.

## Coleta automática de métricas

Como complemento à execução dos testes, foi implementada nas duas pipelines uma etapa automática de coleta e consolidação de métricas. A partir do relatório JSON gerado pelo Playwright, cada workflow passa a produzir um resumo estruturado contendo a quantidade de testes executados, aprovados, falhos, ignorados e flaky, bem como o tempo total de execução, o tempo médio por teste e a taxa de sucesso da execução. Também são contabilizadas as evidências geradas durante os testes, como screenshots, vídeos e traces, quando existentes.

Outra informação registrada automaticamente foi a cobertura funcional dos cenários executados. Nesse contexto, a cobertura não representa cobertura de código-fonte, mas sim a verificação objetiva dos fluxos funcionais contemplados pelos testes automatizados. Assim, a pipeline manual registra a cobertura dos cenários de cadastro, login, exclusão de conta, navegação e busca de produtos, enquanto a pipeline com apoio de IA registra esses mesmos fluxos sob uma estratégia de localização mais resiliente. Esses resumos são publicados como artefatos do workflow e também aparecem no resumo da execução do GitHub Actions, o que facilita a comparação entre as duas abordagens.

## Análise comparativa

A abordagem manual apresentou implementação mais direta e fácil de entender, porém com maior dependência de seletores específicos, o que pode aumentar o custo de manutenção quando a interface muda. A abordagem com apoio de IA trouxe ganho de produtividade na escrita dos testes e maior resiliência por meio de fallbacks de localização. Em contrapartida, exigiu validação humana cuidadosa para evitar sugestões incorretas ou excessivamente genéricas.

Durante a execução, ambas as pipelines conseguiram automatizar a validação dos fluxos essenciais da aplicação. Além da aprovação ou falha dos testes, foi possível observar de forma objetiva métricas como tempo total, duração média por teste, taxa de sucesso e cobertura funcional dos cenários executados. Em termos de tempo, a diferença entre as duas abordagens ficou pequena, pois ambas executam sobre o mesmo framework. A principal vantagem da IA ficou na aceleração da autoria, no reforço da manutenção e na maior robustez dos seletores, e não necessariamente na redução do tempo bruto de execução.

## Conclusão

Conclui-se que o uso de IA na automação de testes pode aumentar a produtividade, sugerir cenários relevantes e ajudar na criação de seletores mais robustos. Entretanto, a IA não substitui o conhecimento técnico do QA, pois ainda é necessário revisar cenários, validar seletores e interpretar corretamente os resultados. Como melhoria futura, seria interessante integrar uma ferramenta externa de auto-healing ou análise visual com IA, como Healenium ou Applitools Eyes, para ampliar a comparação entre abordagens.
