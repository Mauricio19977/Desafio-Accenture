# language: pt
@frontend
Funcionalidade: Sortable
  Como um usuário do demoqa
  Quero reorganizar os itens da lista arrastando-os
  Para deixá-los na ordem que preciso

  # A lista já carrega em ordem crescente; ela é embaralhada via drag and drop
  # (na mesma ordem do exemplo do desafio) para que a ordenação seja de fato exercitada.
  Cenário: Colocar os elementos da lista em ordem crescente com drag and drop
    Dado que acesso o site demoqa
    Quando escolho a opção "Interactions" na página inicial
    E clico no submenu "Sortable"
    E a lista está na ordem "Six, Two, One, Four, Five, Three"
    Quando ordeno os elementos em ordem crescente usando drag and drop
    Então os elementos devem estar na ordem "One, Two, Three, Four, Five, Six"
