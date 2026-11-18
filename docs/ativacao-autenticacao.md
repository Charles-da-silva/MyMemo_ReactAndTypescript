# Mapa: ativação da autenticação

## Situação atual

### Escopo e ordem do deploy

- [x] Escopo confirmado: login Google e separação segura dos dados por usuário.
- [x] Configuração dos quatro secrets do frontend concluída.
- [!] Verificação pública em 4 de novembro de 2026 encontrou a API respondendo `401` sem token e os dois frontends públicos sem sinais do login Firebase no bundle. Ver [relatório de verificação](./verificacao-producao-autenticacao.md).
- [x] Confirmado no painel Render: serviço ligado à branch `feature-backend-node`, Root Directory `Backend`, Build Command `npm install` e Start Command `npm start`.
- [x] Confirmado inicialmente no Render: commit `88bd3ba` publicou a autenticação no backend sem merge para `main`.
- [x] Criada e cadastrada a variável secreta `FIREBASE_SERVICE_ACCOUNT` no Render. O arquivo JSON foi removido de Downloads após o cadastro e não foi salvo no repositório.
- [x] Render concluiu o deploy após cadastrar a variável; o commit `762010f` aparece como `Live`. A raiz responde `200`; sem token, `/decks` retorna `401`.
- [x] Confirmado: o usuário testou `mymemo.nanuvem.net`, servido pelo Vercel; GitHub Pages é uma publicação diferente.
- [x] Promovido ao Production do Vercel o build autenticado `762010f` após o usuário confirmar que os 8 decks aparecem no Preview; deploy `25wDW6yUaViwrp2mPj2t9RqeGsKK` ficou `Ready` e recebeu os domínios de produção.
- [x] Cadastradas no Vercel as quatro variáveis públicas `VITE_FIREBASE_*` também no ambiente Production como Config.
- [x] Criado Preview do commit `762010f` na branch `feature-backend-node`; deployment `8you234wd` ficou `Ready` e exibe a tela “Continuar com Google”.
- [x] Adicionado o domínio exato do Preview atual à lista de domínios autorizados do Firebase Authentication.
- [x] Conta escolhida pelo usuário para os 3 decks: `emaildocharles@gmail.com`.
- [x] O usuário concluiu o login Google no Preview e clicou em “Carregar Decks”; a busca falhou com “Erro ao buscar decks”.
- [x] Diagnóstico dos logs do Render: o middleware falhava ao iniciar Firebase Admin (`admin.credential.cert` não existe na versão `firebase-admin` 14.5.0), impedindo requisições autenticadas.
- [x] Corrigida localmente a inicialização para a API modular (`firebase-admin/app` e `firebase-admin/auth`).
- [x] Corrigido localmente o frontend para mostrar o status HTTP e a mensagem da API, com opção de tentar novamente.
- [x] Publicada a correção no commit `762010f`; Render está `Live`. Um token falso retorna `401 Token de autenticação inválido`, confirmando que a inicialização modular alcança a validação do token.
- [x] Autorizado no Firebase o domínio do Preview `my-memo-react-and-typescript-8you234wd-charles-devfullstack.vercel.app`.
- O `main` atual não tem a pasta `Frontend/`; não enviar a branch feature para `main`. Após validar os decks no Preview, promover o deployment correto pelo Vercel sem merge amplo.
- O bundle publicado no Vercel não aparenta conter login Firebase; a API que ele chama recusa requisições sem token.
- O `main` publica o frontend da raiz por um workflow antigo; a branch feature tem o novo workflow em `Frontend/`, mas o gatilho é push em `main`.
- [x] Confirmado no dashboard Vercel: pushes para `main` atualizam produção, mas `main` não possui `Frontend/`. A promoção direta do Preview validado evitou merge amplo.
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
- [x] Publicar a correção do backend na branch `feature-backend-node` e confirmar que o Render concluiu o deploy.
- [ ] Repetir “Carregar Decks” no Preview atualizado e confirmar que os três decks aparecem na conta `emaildocharles@gmail.com`.
- [x] Cadastrar os quatro secrets do frontend no GitHub.
- [x] Cadastrar as quatro variáveis `VITE_FIREBASE_*` no Preview do Vercel. Não foram cadastradas em Production.
- [x] O usuário confirmou que o Preview corrigido exibiu os 8 decks.
- [x] O usuário entrou novamente em `mymemo.nanuvem.net`; os 8 decks apareceram.
- [x] Testada outra conta Google: ela não mostrou decks de terceiros; após importar um deck, ele apareceu nessa conta.
- [ ] Após confirmar os decks no Preview, promover o deployment `762010f` ao Vercel Production.
- [x] Confirmar a conta proprietária dos 3 decks antigos: `emaildocharles@gmail.com`.

> **Ativação concluída e validada.** O build `762010f` está no Vercel Production, os 8 decks aparecem na conta proprietária e outra conta vê somente o deck que importou.

## Próximos passos, guiados um de cada vez

### Resultado final

O backend Render está `Live` com a correção do Firebase Admin v14; o Vercel Production serve o frontend autenticado. O usuário confirmou os 8 decks na conta principal e confirmou que outra conta não vê os decks da primeira. A importação de um deck nessa segunda conta funcionou. Para próximos deploys, o branch de produção do Vercel continua apontando para `main`, que não possui `Frontend/`; promova os Previews validados ou alinhe a estratégia antes de publicar mudanças futuras. Consulte o [relatório](./verificacao-producao-autenticacao.md).

## Como pedir ajuda na próxima etapa

Ativação concluída. Para qualquer alteração futura, valide o Preview antes de promovê-lo ao Vercel Production; não faça merge dos 59 commits divergentes sem revisar a estratégia de branches e o Root Directory.
