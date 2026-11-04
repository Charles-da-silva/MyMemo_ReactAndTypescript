# Mapa: ativação da autenticação

## Situação atual

### Escopo e ordem do deploy

- [x] Escopo confirmado: login Google e separação segura dos dados por usuário.
- [x] Configuração dos quatro secrets do frontend concluída.
- Próximo: publicar o frontend; depois salvar as variáveis do Render e publicar o backend.
- No Render, os campos `FIREBASE_SERVICE_ACCOUNT` estão preenchidos, mas **não foram salvos**. Não salve nem faça deploy até o frontend estar publicado.
- [x] Commit `88bd3ba` enviado para a branch `feature-backend-node`; ainda falta integrar as alterações em `main`.
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
- [x] Adicionada a configuração pública Firebase em `Frontend/.env.local` (arquivo local, ignorado pelo Git).
- [x] Corrigido o workflow de deploy do frontend para instalar e compilar a pasta `Frontend`.
- [x] Iniciado o PostgreSQL local no Docker, container `ContainerMyMemo`, porta `5433`.
- [x] Aplicada a migração no banco local `MyMemoDB`. Os 3 decks existentes foram preservados.
- [x] Testada a API local: health check responde e `/decks` e `/cards` exigem autenticação (`401` sem token).
- [x] Build e lint dos arquivos alterados passaram.

### Ainda falta

- [ ] Terminar a configuração de produção do backend no Render.
  - [x] Confirmado: `DATABASE_URL` já existe e aponta para o Neon (valor não foi lido nem compartilhado).
  - [x] Confirmado: **Root Directory** = `Backend`.
  - [x] Confirmado: **Start Command** = `npm start`.
  - [ ] Revisar **Build Command**: está como `npm install`; recomenda-se `npm ci` para usar o lockfile. Ainda não alterado.
  - [ ] Salvar/cadastrar `FIREBASE_SERVICE_ACCOUNT` no Render depois do deploy do frontend.
- [x] Gerada e baixada a chave privada da conta de serviço Firebase. Ela não foi compartilhada nem adicionada ao repositório.
- [~] `FIREBASE_SERVICE_ACCOUNT`: Key e Value preenchidos no Render, ainda sem salvar/deploy.
- [ ] Publicar o backend com a autenticação e a migração.
- [x] Cadastrar os quatro secrets do frontend no GitHub.
- [ ] Publicar o frontend autenticado.
- [ ] Testar o login Google e a separação de dados no site publicado.
- [ ] Confirmar qual conta deve receber os 3 decks antigos. A primeira conta que acessar a API nova os reivindicará.

> **Não está ativo em produção ainda.** Até o backend atualizado ser publicado, o servidor público pode continuar aceitando requisições sem autenticação. Não crie dados privados nessa versão durante a transição.

## Próximos passos, guiados um de cada vez

### 1. Publicar o frontend

Os secrets já estão cadastrados. Falta publicar o código para que o GitHub Actions compile o frontend:

1. A branch `feature-backend-node` foi enviada ao GitHub com o commit `88bd3ba`.
2. Integre as alterações em `main` por um pull request (ou outro fluxo que termine com as mudanças em `main`). O workflow `.github/workflows/deploy.yml` publica o frontend quando há mudanças em `main`.
3. Aguarde o workflow terminar com sucesso e confirme que o site publicado atualizou. Se o workflow terminar mas o site não atualizar, confira **Settings → Pages** e confirme que a publicação usa a branch `gh-pages`.

### 2. Configurar e publicar o backend no Render

Depois que o frontend estiver publicado, abra o serviço existente do backend no Render:

1. Já confirmado: **Root Directory** = `Backend`, **Start Command** = `npm start` e `DATABASE_URL` aponta para o Neon. Não altere nem compartilhe o valor da URL.
2. Em **Settings → Build & Deploy**, troque **Build Command** de `npm install` para `npm ci`.
3. Em **Environment**, salve `FIREBASE_SERVICE_ACCOUNT` com o conteúdo completo do JSON. **Não envie a chave pelo chat, não a coloque no repositório e não a use no frontend.**
4. Faça **Manual Deploy → Deploy latest commit** (ou aguarde o deploy automático da branch configurada) e verifique que o serviço iniciou sem erro. O servidor aplica a migração ao iniciar.

As variáveis do banco local (`DATABASE_HOST`, `DATABASE_PORT` etc.) são alternativas para desenvolvimento. Em produção, prefira `DATABASE_URL`.

### 3. Testar

1. Abra o site e entre com Google.
2. Confirme que seus decks aparecem. A primeira conta autenticada atribui a si os decks sem proprietário; depois disso, cada conta vê apenas os seus.
3. Teste com uma segunda conta Google e confirme que ela não vê nem altera decks da primeira.

## Como pedir ajuda na próxima etapa

O próximo passo é integrar a branch `feature-backend-node` em `main`. Não compartilhe valores secretos. Para conferir um secret, diga apenas se ele foi cadastrado — não copie seu conteúdo para o chat.
