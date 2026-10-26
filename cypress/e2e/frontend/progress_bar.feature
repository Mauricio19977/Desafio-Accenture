# language: pt
@frontend
Funcionalidade: Progress Bar
  Como um usuário do demoqa
  Quero controlar a barra de progresso
  Para iniciar, pausar e reiniciar o carregamento

  Cenário: Parar a barra antes de 25% e resetar ao chegar em 100%
    Dado que acesso o site demoqa
    Quando escolho a opção "Widgets" na página inicial
    E clico no submenu "Progress Bar"
    E clico no botão "Start"
    E paro a barra de progresso antes dos 25%
    Então o valor da barra de progresso deve ser menor ou igual a 25%
    Quando clico no botão "Start" novamente e a barra chega aos 100%
    E reseto a barra de progresso
    Então a barra de progresso deve voltar para 0%
