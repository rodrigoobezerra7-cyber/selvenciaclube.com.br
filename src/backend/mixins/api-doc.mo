mixin () {
  public query func getApiDoc() : async Text {
    "# SELVÊNCIA — Central de Operações (backend)\n" #
    "\n" #
    "Backend do SELVÊNCIA, plataforma de preparação para emergências e comércio de equipamentos táticos. O usuário é um **membro** da comunidade, não um cliente. Três pilares: preparação, equipamentos e conhecimento. A loja é o **Arsenal SELVÊNCIA**.\n" #
    "\n" #
    "## Identidade e autenticação\n" #
    "\n" #
    "O acesso usa a identidade da plataforma (Internet Identity). Não existe senha própria gerenciada pelo app, nem verificação de código no cadastro.\n" #
    "\n" #
    "- O frontend fixa uma *derivation origin* de Internet Identity, publicada em `/.well-known/ii-derivation-origin` quando disponível. Um agente que já possui a autorização de Internet Identity do usuário deriva o principal correto contra essa origem (por exemplo `icp identity link web <nome> --app <host>`).\n" #
    "- Essa delegação age com a autoridade total do usuário neste app até expirar.\n" #
    "- Um principal derivado contra outra origem é um principal **diferente** do que o frontend registrou.\n" #
    "\n" #
    "### Registro de membro\n" #
    "\n" #
    "O cadastro é feito pelo frontend, mas um chamador direto da API precisa registrar-se antes de comprar:\n" #
    "\n" #
    "1. Chame `_initialize_access_control()` uma vez como chamador autenticado (não anônimo). O primeiro chamador recebe o papel `admin`; os seguintes recebem `user`. Chamadas anônimas são ignoradas.\n" #
    "2. Chame `registerMember(code, email)` para criar o perfil de membro.\n" #
    "\n" #
    "Um principal que nunca passou pelo frontend do app está **não registrado**, mesmo que pertença ao dono do app.\n" #
    "\n" #
    "### E-mail verificado\n" #
    "\n" #
    "Quando a identidade fornece um e-mail verificado, ele é gravado no perfil do membro no momento do login (`_internet_identity_sign_in_finish`). O e-mail só é capturado para um membro já registrado; um login anterior ao registro não o grava — ele chega no próximo login.\n" #
    "\n" #
    "## Métodos públicos\n" #
    "\n" #
    "### Perfil\n" #
    "\n" #
    "- `getMyProfile() : ?Member` — query. Perfil do chamador, ou `null` se não registrado. `Member = { id : principal; code : text; email : ?text; registeredAt : int }`.\n" #
    "- `registerMember(code : text, email : ?text) : Result<Member, MemberError>` — update. Cria o perfil do chamador.\n" #
    "  - `code`: 3 a 32 caracteres, letras, dígitos, espaços, `-` ou `_`, com ao menos uma letra ou dígito. Espaços nas pontas são removidos.\n" #
    "  - Erros: `#invalidCode` (código fora do formato), `#codeTaken` (código já usado por outro membro, comparação sem diferenciar maiúsculas/minúsculas).\n" #
    "  - Chamar de novo com um código válido e livre **substitui** o perfil existente (novo `registeredAt`, e-mail informado).\n" #
    "\n" #
    "### Recuperação de acesso\n" #
    "\n" #
    "O acesso usa a identidade da plataforma, então a recuperação confirma o e-mail do membro com um código enviado por e-mail antes de liberar o acesso.\n" #
    "\n" #
    "- `requestRecoveryCode(email : text) : Result<(), RecoveryError>` — update. Envia um código de 6 dígitos para `email`.\n" #
    "  - Exige membro registrado (`#notRegistered`) com e-mail verificado (`#noEmail`).\n" #
    "  - O e-mail precisa ser válido (`#invalidEmail`) e igual ao e-mail verificado do membro.\n" #
    "  - Falha de envio: `#emailFailed(texto)`. O código vale 15 minutos.\n" #
    "- `verifyRecoveryCode(code : text) : Result<(), RecoveryError>` — update. Valida o código sem consumi-lo.\n" #
    "  - Erros: `#invalidCode` (código errado ou inexistente), `#codeExpired`, `#tooManyAttempts` (após 5 erros o código é descartado).\n" #
    "- `completeRecovery(code : text) : Result<Member, RecoveryError>` — update. Valida e **consome** o código, devolvendo o perfil do membro.\n" #
    "  - Mesmos erros de `verifyRecoveryCode`, mais `#notRegistered`.\n" #
    "  - **Não é idempotente**: o código é consumido no sucesso; repetir exige um novo `requestRecoveryCode`.\n" #
    "\n" #
    "`RecoveryError = { #notRegistered; #noEmail; #invalidEmail; #invalidCode; #codeExpired; #tooManyAttempts; #emailFailed : text }`.\n" #
    "\n" #
    "### Arsenal SELVÊNCIA\n" #
    "\n" #
    "- `listProducts() : [Product]` — query. Catálogo completo.\n" #
    "- `listCategories() : [CategoryInfo]` — query. As quatro categorias (`lanternas`, `facas`, `binoculos`, `camisetas`) com o rótulo em português (`caption`) e a contagem de itens.\n" #
    "- `getProduct(id : nat) : ?Product` — query. Um item, ou `null`.\n" #
    "\n" #
    "`Product = { id : nat; name : text; category : ProductCategory; priceCents : nat; description : text; imageUrl : text; available : bool }`. `priceCents` é o preço em **centavos** de real (ex.: `18990` = R$ 189,90). `imageUrl` é uma URL absoluta de imagem.\n" #
    "\n" #
    "### Conhecimento\n" #
    "\n" #
    "- `listKnowledge() : [KnowledgeCard]` — query. Todas as fichas.\n" #
    "- `getKnowledge(id : nat) : ?KnowledgeCard` — query. Uma ficha, ou `null`.\n" #
    "\n" #
    "`KnowledgeCard = { id : nat; title : text; category : KnowledgeCategory; summary : text; content : text }`. Categorias: `checklists`, `validade`, `manutencao`, `tecnicas`. `content` é texto longo em Markdown simples, com parágrafos separados por linha em branco.\n" #
    "\n" #
    "### Pedidos\n" #
    "\n" #
    "- `placeOrder(productId : nat, quantity : nat) : Result<Order, OrderError>` — update. Registra um pedido do chamador.\n" #
    "  - Exige membro registrado: `#notRegistered` caso contrário.\n" #
    "  - `quantity` deve ser maior que zero: `#invalidQuantity`.\n" #
    "  - Produto inexistente: `#unknownProduct(productId)`. Produto indisponível: `#unavailable(productId)`.\n" #
    "  - `unitPriceCents` é o preço do produto no momento do pedido; `createdAt` é o instante em nanossegundos.\n" #
    "  - **Não é idempotente**: cada chamada bem-sucedida cria um pedido novo com um `id` novo. Repetir após um erro de rede duplica o pedido.\n" #
    "\n" #
    "`Order = { id : nat; member : principal; productId : nat; quantity : nat; unitPriceCents : nat; createdAt : int }`.\n" #
    "\n" #
    "### Clã Selvência — assinatura\n" #
    "\n" #
    "O Clã Selvência é o clube de membros com assinatura mensal. O acesso ao conteúdo exclusivo é decidido pelo **rank** do plano ativo do chamador, não pela simples presença de identidade.\n" #
    "\n" #
    "- `listPlans() : [Plan]` — query. Os quatro planos, ordenados por `rank`.\n" #
    "- `getMySubscription() : ?Subscription` — query. Assinatura do chamador, ou `null`.\n" #
    "- `subscribe(planId : nat) : Result<Subscription, MembershipError>` — update. Inicia ou troca de plano.\n" #
    "  - Exige membro registrado: `#invalidInput` caso contrário.\n" #
    "  - Plano inexistente: `#planNotFound(planId)`.\n" #
    "  - Plano gratuito (`priceCents == 0`, Visitante): ativa imediatamente com `status = #active`.\n" #
    "  - Plano pago sem assinatura ativa: cria assinatura `#pending`; o plano só vale após `confirmSubscriptionPayment`.\n" #
    "  - Assinatura `#active`: troca o plano na hora e reinicia o ciclo mensal a partir de agora.\n" #
    "  - Assinatura `#pending`: registra o plano desejado em `pendingPlan`.\n" #
    "- `confirmSubscriptionPayment() : Result<Subscription, MembershipError>` — update. Confirma o pagamento de uma assinatura `#pending` e a ativa.\n" #
    "  - Erros: `#subscriptionAlreadyActive` (já ativa), `#paymentNotConfirmed` (sem assinatura ou cancelada).\n" #
    "  - **Não é idempotente**: repetir após sucesso devolve `#subscriptionAlreadyActive`.\n" #
    "- `cancelSubscription() : Result<Subscription, MembershipError>` — update. Volta o membro ao plano Visitante (id 0) com `status = #cancelled`.\n" #
    "  - Erro: `#paymentNotConfirmed` quando não há assinatura.\n" #
    "- `listLevels() : [MemberLevel]` — query. Os quatro níveis, ordenados por `ordinal`.\n" #
    "- `getMyProgress() : MemberProgress` — query. Nível atual do chamador, pontos e quanto falta para o próximo.\n" #
    "\n" #
    "`Plan = { id : nat; name : text; priceCents : nat; rank : nat; description : text }`. `priceCents` em centavos de real. `rank` cresce de Visitante (0) a Sentinela (3).\n" #
    "\n" #
    "`Subscription = { member : principal; planId : nat; status : SubscriptionStatus; startedAt : int; renewsAt : int; pendingPlan : ?nat }`. `SubscriptionStatus = { #active; #pending; #cancelled }`. `startedAt` e `renewsAt` em nanossegundos; o ciclo mensal é de 30 dias.\n" #
    "\n" #
    "`MemberLevel = { ordinal : nat; name : text; description : text; pointsRequired : nat }`. `MemberProgress = { level : MemberLevel; points : nat; nextLevel : ?MemberLevel; pointsToNext : nat }`.\n" #
    "\n" #
    "`MembershipError = { #planNotFound : nat; #subscriptionAlreadyActive; #paymentNotConfirmed; #notEntitled : nat; #invalidInput }`.\n" #
    "\n" #
    "### Clã Selvência — conteúdos exclusivos\n" #
    "\n" #
    "Cada conteúdo declara um `minPlanRank`; o chamador só o vê se o rank do plano ativo for maior ou igual. Sem assinatura ativa o rank é 0 (Visitante).\n" #
    "\n" #
    "- `listSurvivalCards() : [SurvivalCard]` — query. Biblioteca de sobrevivência visível ao chamador, ordenada por título.\n" #
    "- `getSurvivalCard(id : nat) : Result<SurvivalCard, ClanError>` — query. Erros: `#unknownContent(id)`, `#notEntitled(minPlanRank)`.\n" #
    "- `listCourses() : [Course]` — query. Cursos visíveis, ordenados por título.\n" #
    "- `getCourse(id : nat) : Result<Course, ClanError>` — query. Mesmos erros de `getSurvivalCard`.\n" #
    "- `listTrainings() : [Training]` — query. Treinamentos visíveis, ordenados por título.\n" #
    "- `listCommunityPosts() : [CommunityPost]` — query. Posts da comunidade privada, do mais recente ao mais antigo. Exige rank ≥ 1 (Recruta); abaixo disso retorna lista vazia.\n" #
    "- `createCommunityPost(title : text, body : text) : Result<CommunityPost, ClanError>` — update. Publica um post.\n" #
    "  - Exige rank ≥ 1: `#notEntitled(1)` caso contrário. Exige membro registrado: `#notRegistered`.\n" #
    "  - Título e corpo são aparados; vazios devolvem `#invalidInput`.\n" #
    "  - **Não é idempotente**: cada chamada cria um post novo.\n" #
    "- `listMyEmergencyPlans() : [EmergencyPlan]` — query. Planos de emergência do chamador, do mais recente ao mais antigo.\n" #
    "- `createEmergencyPlan(title : text, steps : [EmergencyStep]) : Result<EmergencyPlan, ClanError>` — update. Cria um plano.\n" #
    "  - Exige membro registrado: `#notRegistered`. Título vazio ou sem passos: `#invalidInput`.\n" #
    "- `listMyKits() : [MemberKit]` — query. Kits do chamador, ordenados por nome.\n" #
    "- `createKit(name : text, items : [KitItem]) : Result<MemberKit, ClanError>` — update. Cria um kit e calcula a prontidão.\n" #
    "  - Exige membro registrado: `#notRegistered`. Nome vazio: `#invalidInput`.\n" #
    "  - `readiness`: `#pronto` (todos os itens prontos), `#critico` (nenhum item ou lista vazia), `#incompleto` (caso intermediário).\n" #
    "\n" #
    "`SurvivalCard = { id : nat; title : text; summary : text; content : text; minPlanRank : nat }`.\n" #
    "\n" #
    "`Course = { id : nat; title : text; summary : text; lessons : [Lesson]; materials : [text]; minPlanRank : nat }`. `Lesson = { title : text; summary : text; durationMinutes : nat }`.\n" #
    "\n" #
    "`Training = { id : nat; title : text; summary : text; content : text; minPlanRank : nat }`.\n" #
    "\n" #
    "`CommunityPost = { id : nat; author : principal; authorCode : text; title : text; body : text; createdAt : int; minPlanRank : nat }`.\n" #
    "\n" #
    "`EmergencyPlan = { id : nat; member : principal; title : text; steps : [EmergencyStep]; createdAt : int; minPlanRank : nat }`. `EmergencyStep = { order : nat; instruction : text }`.\n" #
    "\n" #
    "`MemberKit = { id : nat; member : principal; name : text; items : [KitItem]; readiness : KitReadiness; minPlanRank : nat }`. `KitItem = { name : text; quantity : nat; ready : bool }`. `KitReadiness = { #pronto; #incompleto; #critico }`.\n" #
    "\n" #
    "`ClanError = { #notRegistered; #notEntitled : nat; #unknownContent : nat; #invalidInput }`.\n" #
    "\n" #
    "## Unidades e codificação\n" #
    "\n" #
    "- Todos os timestamps (`registeredAt`, `createdAt`, `startedAt`, `renewsAt`) são `int` em **nanossegundos** desde a época Unix (UTC).\n" #
    "- Preços são `nat` em centavos.\n" #
    "- Identificadores de membro são `principal`.\n" #
    "- Campos opcionais usam `null` para ausência.\n" #
    "\n" #
    "## Autorização\n" #
    "\n" #
    "- Catálogo e biblioteca são públicos: qualquer chamador, inclusive anônimo, lê.\n" #
    "- Perfil e pedidos são por membro: cada chamador só vê o próprio perfil e os próprios pedidos.\n" #
    "- Planos e níveis do clã são públicos. Conteúdos exclusivos (biblioteca de sobrevivência, cursos, treinamentos, comunidade) exigem o rank do plano ativo; sem assinatura ativa o rank é 0 e o conteúdo com `minPlanRank` maior não aparece.\n" #
    "- Assinaturas, planos de emergência e kits são por membro: cada chamador só vê os próprios.\n" #
    "- Endpoints que exigem membro registrado (`placeOrder`, `createCommunityPost`, `createEmergencyPlan`, `createKit`) devolvem `#err(#notRegistered)` para um chamador sem perfil de membro, inclusive anônimo; não há trap. `getMyProfile` devolve `null` no mesmo caso.\n" #
    "- `getCallerUserRole()`, `isCallerAdmin()` e `assignCallerUserRole(user, role)` vêm do controle de acesso. `getCallerUserRole` **traps** com `User is not registered` para um principal autenticado que nunca chamou `_initialize_access_control`; para anônimo retorna `guest`. `assignCallerUserRole` só funciona para um admin.\n" #
    "\n" #
    "## Consultas OQL\n" #
    "\n" #
    "`schema()` e `execute(qJson)` expõem as tabelas `product`, `knowledgeCard`, `plan` e `memberLevel` (públicas); `order`, `subscription`, `emergencyPlan` e `kit` (escopo por membro: o chamador lê apenas as próprias linhas; o controlador lê todas); e `survivalCard`, `course`, `training` e `communityPost` (somente controlador).\n" #
    "\n" #
    "## Erros e limites\n" #
    "\n" #
    "- Erros de regra de negócio voltam como variantes `Result`, não como traps.\n" #
    "- Um trap (por exemplo `User is not registered`) chega ao chamador como rejeição opaca e desfaz as mudanças não confirmadas da mensagem.\n" #
    "- Não há paginação: as listas retornam todos os itens.\n" #
    "- O rank do plano é lido da assinatura `#active`; uma assinatura `#pending` ou `#cancelled` conta como Visitante (rank 0) até a confirmação do pagamento."
  };
};
