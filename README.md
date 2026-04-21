# 🗂️ MyMemo Flashcards - Projeto sendo desenvolvido em React com Typescript

Este é um projeto para o desenvolvimento de um web-app responsivo de repetição espaçada para microaprendizagem baseado em flashcards, desenvolvido com **React** e **TypeScript**, inicialmente utilizando o `localStorage` do navegador para persistência de dados.
<br>

## 🚀 Funcionalidades

- **Gerenciamento de Decks:** Criação, edição e exclusão de baralhos (decks);
- **Integração com IA:** Importação de arquivos Word e PDF para a criação automática de decks de estudo;
- **Criação de Cards:** Adição de perguntas com suporte a múltiplas alternativas.
- **Suporte a Imagens:** Opção de anexar imagens às perguntas (armazenadas em Base64 no LocalStorage).
- **Sistema de Revisão:** Algoritmo simples de repetição espaçada com três níveis de dificuldade:
  - **Difícil:** Revisa em 10 minutos.
  - **Médio:** Revisa em 1 dia.
  - **Fácil:** Revisa em 3 dias.
- **Exclusão em Tempo Real:** Opção de excluir uma pergunta diretamente durante a sessão de estudos.
- **Persistência de Dados:** Dados salvos no `localStorage` do navegador, permitindo que o progresso não seja perdido ao fechar a aba ou reiniciar o dispositivo.
- **Exportação e Importação de Decks:** A ferramenta possibilita exportar e importar decks em formato JSON
<br>

## 🛠️ Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [LocalStorage API](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)
<br>

## Fase atual

- Desenvolvendo módulo de criação de Decks, manual e automaticamente com IA.
<br>

## Quer testar os módulos disponíveis em produção?

  - Primeiro baixe o deck (JSON) de exemplo no segundo link: 
    https://mymemoflashcards.short.gy/Deck_exemplo

  - Depois entre acesse o App e importe o Deck na primeira página:
    https://mymemoflashcards.short.gy/
<br>

## Link e telas do protótipo no Figma

  - https://mymemoflashcards.short.gy/Figma

<div align="center">
  <br>
  <img src="./src/assets/FigmaPrint_final.png" alt="Telas da prototipagem no Figma" width="600">
</div>