# language: pt
@frontend
Funcionalidade: Web Tables
  Como um usuário do demoqa
  Quero gerenciar registros na tabela
  Para manter a lista de funcionários atualizada

  Contexto:
    Dado que acesso o site demoqa
    Quando escolho a opção "Elements" na página inicial
    E clico no submenu "Web Tables"

  Cenário: Criar, editar e deletar um registro
    Quando crio um novo registro
    Então o novo registro deve ser exibido na tabela
    Quando edito o novo registro criado
    Então o registro deve ser exibido com os dados atualizados
    Quando deleto o novo registro criado
    Então o registro não deve mais ser exibido na tabela

  @bonus
  Cenário: Criar e deletar 12 registros de forma dinâmica
    Quando crio 12 novos registros com dados dinâmicos
    Então os 12 registros devem ser exibidos na tabela
    Quando deleto todos os registros criados
    Então nenhum dos registros criados deve ser exibido na tabela
    E a tabela deve manter apenas os registros originais

  # BUG conhecido do demoqa: qualquer exclusão descarta TODOS os registros adicionados na sessão
  # (inclusive ao excluir um dos registros originais). Fora da execução padrão; rode com: npm run test:bugs
  @bug
  Cenário: Excluir um registro não deve remover os demais registros criados
    Quando crio 2 novos registros com dados dinâmicos
    E deleto o primeiro registro criado
    Então os demais registros criados devem continuar na tabela
