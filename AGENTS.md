# Project Guidance

## User Preferences

- Identidade visual de centro de operações, estilo tático
- Usuário tratado como membro da comunidade SELVÊNCIA, não apenas cliente
- Conteúdo em português

## Accepted Requirements

- Tela de boas-vindas com criar conta ou login
- Login por e-mail com opção de código/nome
- Esqueci minha senha com recuperação por e-mail e verificação de código
- Home tática 'Central de Operações' com as áreas Preparação, Equipamentos e Conhecimento
- Loja Arsenal SELVÊNCIA com categorias lanternas, facas, binóculos e camisetas
- Ficha de produto com foto, preço, descrição e botão comprar
- Fichas de conhecimento: checklists de kits, validade, manutenção e técnicas de sobrevivência
- Área exclusiva 'Clã Selvência' como clube de membros com assinatura mensal
- Planos Visitante (grátis), Recruta (R$ 19,90), Guardião (R$ 39,90) e Sentinela (R$ 59,90)
- Níveis de membro Novo integrante, Explorador, Guardião e Sentinela
- Biblioteca de sobrevivência, cursos e treinamentos, planejamento de emergência, organização de kits, comunidade privada e conteúdos exclusivos

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- The app uses TanStack Router with routes / (BemVindoPage), /acesso (AcessoPage), /recuperar (RecuperarSenhaPage), /central (CentralPage), /arsenal (ArsenalPage), /arsenal/$productId (ProdutoPage), /biblioteca (ConhecimentoPage) and /biblioteca/$cardId (FichaConhecimentoPage); member-gated routes use RequireMember.
- Backend exposes getMyProfile, registerMember, requestRecoveryCode, verifyRecoveryCode, completeRecovery, listProducts, listCategories, getProduct, listKnowledge, getKnowledge and placeOrder.
- Recovery emails a real 6-digit code from src/backend/lib/members.mo and consumes it in completeRecovery; access itself uses the platform identity.
- A global prefers-reduced-motion media rule in src/frontend/src/index.css covers all Tailwind animate-* utilities.
- Biome useSemanticElements rejects role=group/status on a div; use fieldset and output elements instead.
- Biome noCommentText flags a literal '//' in JSX text; render it as a string expression.
- 'label' is a reserved Motoko keyword; use 'caption' for category label fields.
- OQL auto-derivation needs a <Type>Value.mo with _toRow for every variant field, imported top-level in main.mo.
- Catalog and knowledge seeding belongs in the pending migration body; actor-body seed calls re-add rows on every upgrade.
- The Clã Selvência area lives under /cla with member-gated sub-routes; plan gating uses a plan rank comparison, not identity presence alone.
- The Clã Selvência area lives under /cla with member-gated sub-routes; RequireMember accepts requiredPlanRank and plan gating compares plan ranks (0 = Visitante).
- Clan content lists filter by the caller's plan rank in the backend, and member-owned writes (emergency plans, kits) enforce the Guardião gate server-side with notEntitled.
- MemberStatusPanel receives progress data from useMyProgress so the Central de Operações profile shows the member level and progress.
- OQL auto-derivation needs a _toRow for every variant field; array fields need toEntityManual plus .payload for the owner column.
- A module-level Int literal must be a single constant; arithmetic such as 30*24*60*60*1e9 is non-static (M0014).
- Text.compare and Nat.compare are module functions; call Text.compare(a, b).
