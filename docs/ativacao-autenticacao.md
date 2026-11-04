# Mapa: ativação da autenticação

## Situação atual

### Escopo e ordem do deploy

- [x] Escopo confirmado: login Google e separação segura dos dados por usuário.
- [x] Configuração dos quatro secrets do frontend concluída.
- [!] Verificação pública em 4 de novembro de 2026 encontrou a API respondendo `401` sem token e os dois frontends públicos sem sinais do login Firebase no bundle. Ver [relatório de verificação](./verificacao-producao-autenticacao.md).
- [x] Confirmado no painel Render: serviço ligado à branch `feature-backend-node`, Root Directory `Backend`, Build Command `npm install` e Start Command `npm start`.
- [x] Confirmado inicialmente no Render: commit `88bd3ba` publicou a autenticação no backend sem merge para `main`.
- [x] Criada e cadastrada a variável secreta `FIREBASE_SERVICE_ACCOUNT` no Render. O arquivo JSON foi removido de Downloads após o cadastro e não foi salvo no repositório.
- [x] Render concluiu o deploy após cadastrar a variável; o commit `c6ccd5b` aparece como último deploy bem-sucedido e `Live`. A API responde `200` na raiz e `401` em `/decks` sem token.
- [x] Confirmado: o usuário testou `mymemo.nanuvem.net`, servido pelo Vercel; GitHub Pages é uma publicação diferente.
- [!] O Production Deployment do Vercel é `be3af49` da branch `feature-backend-node`, de 4 de julho, anterior à autenticação. O build está em Root Directory `Frontend`, mas o painel avisa que pushes para `main` atualizam produção.
- [!] Deploys mais recentes da branch feature aparecem como Preview; não substituíram o Production Deployment `be3af49`.
- [x] Cadastradas no Vercel as quatro variáveis `VITE_FIREBASE_*` no ambiente Preview; Production não foi selecionado.
- [x] Criado Preview do commit `c6ccd5b` na branch `feature-backend-node`; deployment `ly5h1sm8t` ficou `Ready` e exibiu a tela “Continuar com Google”.
- [x] Adicionado o domínio exato do Preview atual à lista de domínios autorizados do Firebase Authentication.
- [x] Conta escolhida pelo usuário para os 3 decks: `emaildocharles@gmail.com`.
- [x] O usuário concluiu o login Google no Preview e clicou em “Carregar Decks”; a busca falhou com “Erro ao buscar decks”.
- [x] Diagnóstico dos logs do Render: o middleware falhava ao iniciar Firebase Admin (`admin.credential.cert` não existe na versão `firebase-admin` 14.5.0), impedindo requisições autenticadas.
- [x] Corrigida localmente a inicialização para a API modular (`firebase-admin/app` e `firebase-admin/auth`).
- [x] Corrigido localmente o frontend para mostrar o status HTTP e a mensagem da API, com opção de tentar novamente.
- O `main` atual não tem a pasta `Frontend/`; alinhar branch de produção e Root Directory antes de qualquer push/deploy para não quebrar o site.
- O bundle publicado no Vercel não aparenta conter login Firebase; a API que ele chama recusa requisições sem token.
- O `main` publica o frontend da raiz por um workflow antigo; a branch feature tem o novo workflow em `Frontend/`, mas o gatilho é push em `main`.
- [x] Confirmado no dashboard Vercel: para atualizar a produção, enviar para `main`. O deployment ativo ainda tem origem em `feature-backend-node`, então branch e raiz precisam ser alinhadas.
- [x] Confirmado antes da configuração: não havia variáveis no Project nem no Shared do Vercel. Agora as quatro estão cadastradas em Preview.
- Não fazer merge amplo automaticamente: a branch contém 59 commits que não estão em `main`, incluindo mudança de estrutura do projeto.
- [x] Adicionado o secret `VITE_FIREBASE_API_KEY` no GitHub Actions.
- [x] Adicionado o secret `VITE_FIREBASE_AUTH_DOMAIN` no GitHub Actions.
- [x] Adicionado o secret `VITE_FIREBASE_PROJECT_ID` no GitHub Actions.
- [x] Adicionado o secret `VITE_FIREBASE_APP_ID` no GitHub Actions.

### Já feito

- [x] Implementado login Google com Firebase no frontend.
- [x] Implementada validação do token e separação de decks/cards por usuário no backend.
- [x] Criado o projeto Firebase `mymemo-flashcards` e o app Web.
- [x] Habilitado o provedor Google no Firebase Authentication.
- [x] Autorizados os domínios `charles-da-silva.github.io` e `mymemo.nanuvem.net`.
- [x] Autorizado também o domínio do Preview atual no Firebase Authentication.
- [x] Adicionada a configuração pública Firebase em `Frontend/.env.local` (arquivo local, ignorado pelo Git).
- [x] Corrigido o workflow de deploy do frontend para instalar e compilar a pasta `Frontend`.
- [x] Iniciado o PostgreSQL local no Docker, container `ContainerMyMemo`, porta `5433`.
- [x] Aplicada a migração no banco local `MyMemoDB`. Os 3 decks existentes foram preservados.
- [x] Testada a API local: health check responde e `/decks` e `/cards` exigem autenticação (`401` sem token).
- [x] Build e lint dos arquivos alterados passaram.

### Ainda falta

- [x] Definida a estratégia para evitar merge amplo: manter o Render na branch feature e, após validar o backend, promover ao Vercel Production o Preview correto da branch que contém `Frontend/`.
- [x] Cadastrar `FIREBASE_SERVICE_ACCOUNT` no Render e aguardar o deploy de produção concluir.
- [ ] Publicar a correção do backend na branch `feature-backend-node` e confirmar que o Render concluiu o deploy.
- [ ] Repetir “Carregar Decks” no Preview e confirmar o retorno autenticado da API e a propriedade dos três decks.
- [x] Cadastrar os quatro secrets do frontend no GitHub.
- [x] Cadastrar as quatro variáveis `VITE_FIREBASE_*` no Preview do Vercel. Não foram cadastradas em Production.
- [x] O usuário entrou no Preview e clicou em “Carregar Decks”; o backend falhou antes de validar o token.
- [ ] Publicar o frontend autenticado por um caminho que não substitua o backend live nem faça merge amplo sem revisão.
- [x] Confirmar a conta proprietária dos 3 decks antigos: `emaildocharles@gmail.com`.

> **Causa identificada; correção local ainda não publicada.** O usuário entrou no Preview, mas o middleware do Render falha por incompatibilidade com Firebase Admin v14. A produção do frontend segue no deployment antigo. Corrigir e validar o backend primeiro; só então publicar o frontend autenticado.

## Próximos passos, guiados um de cada vez

### Próximo passo seguro: corrigir e validar o backend

O backend Render está `Live` em `feature-backend-node`/`c6ccd5b`, com `FIREBASE_SERVICE_ACCOUNT` configurada, mas seus logs mostram erro de inicialização do Firebase Admin v14 nas rotas autenticadas. A correção local já usa a API modular; falta publicar e testar. O usuário confirmou o login no Preview, mas o carregamento de decks falhou. O domínio próprio continua no deployment antigo (`be3af49`). A conta escolhida para os três decks é `emaildocharles@gmail.com`. Consulte o [relatório](./verificacao-producao-autenticacao.md).

## Como pedir ajuda na próxima etapa

Primeiro, publicar a correção do Firebase Admin e confirmar o deploy do Render. Depois, abrir o [Preview autenticado](https://my-memo-reactandtypescript-ly5h1sm8t-charles-devfullstack.vercel.app/), clicar em “Carregar Decks” e verificar os três decks. Só depois promover o frontend ao Vercel Production; não é necessário integrar os 59 commits exclusivos da branch inteira.
