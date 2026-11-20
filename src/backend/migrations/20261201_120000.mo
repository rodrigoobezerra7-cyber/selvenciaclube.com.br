import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";

// Clã Selvência: adiciona assinaturas, níveis de membro e conteúdos exclusivos
// ao estado SELVÊNCIA existente, semeando os quatro planos, os quatro níveis e
// o conteúdo inicial do clã. Os campos anteriores são preservados.
module {
  type ProductCategory = { #lanternas; #facas; #binoculos; #camisetas };
  type KnowledgeCategory = { #checklists; #validade; #manutencao; #tecnicas };

  type Member = { id : Principal; code : Text; email : ?Text; registeredAt : Int };
  type Product = {
    id : Nat;
    name : Text;
    category : ProductCategory;
    priceCents : Nat;
    description : Text;
    imageUrl : Text;
    available : Bool;
  };
  type KnowledgeCard = {
    id : Nat;
    title : Text;
    category : KnowledgeCategory;
    summary : Text;
    content : Text;
  };
  type Order = {
    id : Nat;
    member : Principal;
    productId : Nat;
    quantity : Nat;
    unitPriceCents : Nat;
    createdAt : Int;
  };
  type RecoveryRequest = { code : Text; expiresAt : Int; attempts : Nat };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    members : Map.Map<Principal, Member>;
    recoveries : Map.Map<Principal, RecoveryRequest>;
    products : Map.Map<Nat, Product>;
    knowledge : Map.Map<Nat, KnowledgeCard>;
    orders : Map.Map<Nat, Order>;
    orderCounter : { var value : Nat };
  };

  type Plan = { id : Nat; name : Text; priceCents : Nat; rank : Nat; description : Text };
  type SubscriptionStatus = { #active; #pending; #cancelled };
  type Subscription = {
    member : Principal;
    planId : Nat;
    status : SubscriptionStatus;
    startedAt : Int;
    renewsAt : Int;
    pendingPlan : ?Nat;
  };
  type MemberLevel = { ordinal : Nat; name : Text; description : Text; pointsRequired : Nat };
  type SurvivalCard = {
    id : Nat;
    title : Text;
    summary : Text;
    content : Text;
    minPlanRank : Nat;
  };
  type Lesson = { title : Text; summary : Text; durationMinutes : Nat };
  type Course = {
    id : Nat;
    title : Text;
    summary : Text;
    lessons : [Lesson];
    materials : [Text];
    minPlanRank : Nat;
  };
  type Training = {
    id : Nat;
    title : Text;
    summary : Text;
    content : Text;
    minPlanRank : Nat;
  };
  type CommunityPost = {
    id : Nat;
    author : Principal;
    authorCode : Text;
    title : Text;
    body : Text;
    createdAt : Int;
    minPlanRank : Nat;
  };
  type EmergencyStep = { order : Nat; instruction : Text };
  type EmergencyPlan = {
    id : Nat;
    member : Principal;
    title : Text;
    steps : [EmergencyStep];
    createdAt : Int;
    minPlanRank : Nat;
  };
  type KitItem = { name : Text; quantity : Nat; ready : Bool };
  type KitReadiness = { #pronto; #incompleto; #critico };
  type MemberKit = {
    id : Nat;
    member : Principal;
    name : Text;
    items : [KitItem];
    readiness : KitReadiness;
    minPlanRank : Nat;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    members : Map.Map<Principal, Member>;
    recoveries : Map.Map<Principal, RecoveryRequest>;
    products : Map.Map<Nat, Product>;
    knowledge : Map.Map<Nat, KnowledgeCard>;
    orders : Map.Map<Nat, Order>;
    orderCounter : { var value : Nat };
    subscriptions : Map.Map<Principal, Subscription>;
    plans : Map.Map<Nat, Plan>;
    levels : Map.Map<Nat, MemberLevel>;
    points : Map.Map<Principal, Nat>;
    survivalCards : Map.Map<Nat, SurvivalCard>;
    courses : Map.Map<Nat, Course>;
    trainings : Map.Map<Nat, Training>;
    posts : Map.Map<Nat, CommunityPost>;
    postCounter : { var value : Nat };
    emergencyPlans : Map.Map<Nat, EmergencyPlan>;
    planCounter : { var value : Nat };
    kits : Map.Map<Nat, MemberKit>;
    kitCounter : { var value : Nat };
  };

  func seedPlans() : [Plan] {
    [
      {
        id = 0;
        name = "Visitante";
        priceCents = 0;
        rank = 0;
        description = "Acesso gratuito à Central de Operações, ao Arsenal e à biblioteca pública de conhecimento.";
      },
      {
        id = 1;
        name = "Recruta";
        priceCents = 1990;
        rank = 1;
        description = "Entrada no clã: biblioteca de sobrevivência do clã, comunidade privada e organização de kits.";
      },
      {
        id = 2;
        name = "Guardião";
        priceCents = 3990;
        rank = 2;
        description = "Cursos completos, treinamentos avançados e planejamento de emergência com acompanhamento.";
      },
      {
        id = 3;
        name = "Sentinela";
        priceCents = 5990;
        rank = 3;
        description = "Acesso total: todos os conteúdos, treinamentos avançados e prioridade nos encontros do clã.";
      },
    ];
  };

  func seedLevels() : [MemberLevel] {
    [
      {
        ordinal = 0;
        name = "Novo integrante";
        description = "Acabou de entrar no clã e está conhecendo a Central de Operações.";
        pointsRequired = 0;
      },
      {
        ordinal = 1;
        name = "Explorador";
        description = "Já participa da comunidade e concluiu os primeiros passos de preparação.";
        pointsRequired = 100;
      },
      {
        ordinal = 2;
        name = "Guardião";
        description = "Membro ativo que contribui com o clã e mantém a preparação em dia.";
        pointsRequired = 500;
      },
      {
        ordinal = 3;
        name = "Sentinela";
        description = "Referência dentro do clã, com participação constante e preparação completa.";
        pointsRequired = 1500;
      },
    ];
  };

  func seedSurvivalCards() : [SurvivalCard] {
    [
      {
        id = 0;
        title = "Protocolo de evacuação em 10 minutos";
        summary = "A sequência que o clã segue quando é preciso sair de casa às pressas.";
        content = "Revise a rota principal e a rota alternativa até o ponto de encontro. Cada membro tem uma mochila pronta junto à saída.\n\n1. Confirme a ameaça e avise o grupo.\n2. Pegue a mochila de evacuação e os documentos.\n3. Desligue água e gás.\n4. Tranque a casa e siga para o ponto de encontro.\n5. Confirme a chegada de todos pelo canal do clã.";
        minPlanRank = 1;
      },
      {
        id = 1;
        title = "Comunicação quando a rede cai";
        summary = "Como o clã se mantém em contato sem internet ou telefonia.";
        content = "Defina um ponto de encontro físico e um horário de checagem. Use rádios de curto alcance para o grupo próximo e combine sinais sonoros para distâncias maiores.\n\nMantenha uma lista impressa de contatos e um rádio a manivela no kit. Teste o plano de comunicação uma vez por mês.";
        minPlanRank = 1;
      },
      {
        id = 2;
        title = "Reserva de água da família";
        summary = "Quanto armazenar e como manter a água potável por semanas.";
        content = "Calcule três litros por pessoa por dia para beber e higiene básica. Para uma família de quatro pessoas, isso significa 84 litros para uma semana.\n\nArmazene em recipientes escuros e limpos, longe da luz. Rotacione a reserva a cada seis meses e mantenha pastilhas de cloro ou filtro para tratar água de fontes externas.";
        minPlanRank = 2;
      },
    ];
  };

  func seedCourses() : [Course] {
    [
      {
        id = 0;
        title = "Fundamentos de sobrevivência urbana";
        summary = "Curso de entrada do clã sobre preparação para interrupções prolongadas.";
        lessons = [
          { title = "Avaliação de riscos locais"; summary = "Mapeie as ameaças mais prováveis da sua região."; durationMinutes = 25 },
          { title = "Reserva de água e alimentos"; summary = "Monte uma reserva de sete dias."; durationMinutes = 30 },
          { title = "Energia e iluminação"; summary = "Planeje energia sem a rede elétrica."; durationMinutes = 20 },
        ];
        materials = ["Checklist de reserva de 7 dias", "Mapa de riscos da região"];
        minPlanRank = 1;
      },
      {
        id = 1;
        title = "Primeiros socorros em campo";
        summary = "Atendimento imediato e estabilização até o resgate.";
        lessons = [
          { title = "Avaliação da cena"; summary = "Segurança do socorrista e da vítima."; durationMinutes = 20 },
          { title = "Controle de hemorragias"; summary = "Pressão direta e torniquete."; durationMinutes = 35 },
          { title = "Imobilização e transporte"; summary = "Como mover uma vítima com segurança."; durationMinutes = 30 },
        ];
        materials = ["Ficha de triagem", "Lista do kit de primeiros socorros"];
        minPlanRank = 2;
      },
    ];
  };

  func seedTrainings() : [Training] {
    [
      {
        id = 0;
        title = "Treinamento de orientação noturna";
        summary = "Navegação com bússola e estrelas em condições de baixa visibilidade.";
        content = "Pratique a leitura de bússola com o mapa da sua região. Ajuste a declinação magnética e confira o rumo a cada 15 minutos de caminhada.\n\nNo hemisfério sul, localize o Cruzeiro do Sul para encontrar o sul. Faça o exercício em duplas e registre o percurso.";
        minPlanRank = 2;
      },
      {
        id = 1;
        title = "Treinamento avançado de abrigo e fogo";
        summary = "Construção de abrigo e acendimento de fogo em condições adversas.";
        content = "Monte um abrigo com lona e cordas em menos de 20 minutos. Isole o chão e mantenha ventilação.\n\nAcenda fogo com pedra de fogo e isqueiro de emergência. Nunca acenda fogo dentro de abrigos fechados.";
        minPlanRank = 3;
      },
    ];
  };

  func seedPosts() : [CommunityPost] {
    [
      {
        id = 0;
        author = Principal.fromText("aaaaa-aa");
        authorCode = "SELVÊNCIA";
        title = "Bem-vindos ao Clã Selvência";
        body = "Este é o espaço privado do clã. Compartilhe revisões de kits, rotas de evacuação e aprendizados de campo. Respeite os demais membros e mantenha o foco em preparação.";
        createdAt = 0;
        minPlanRank = 1;
      },
    ];
  };

  public func migration(old : OldActor) : NewActor {
    let plans = Map.empty<Nat, Plan>();
    for (plan in seedPlans().values()) {
      plans.add(plan.id, plan);
    };

    let levels = Map.empty<Nat, MemberLevel>();
    for (level in seedLevels().values()) {
      levels.add(level.ordinal, level);
    };

    let survivalCards = Map.empty<Nat, SurvivalCard>();
    for (card in seedSurvivalCards().values()) {
      survivalCards.add(card.id, card);
    };

    let courses = Map.empty<Nat, Course>();
    for (course in seedCourses().values()) {
      courses.add(course.id, course);
    };

    let trainings = Map.empty<Nat, Training>();
    for (training in seedTrainings().values()) {
      trainings.add(training.id, training);
    };

    let posts = Map.empty<Nat, CommunityPost>();
    for (post in seedPosts().values()) {
      posts.add(post.id, post);
    };

    {
      accessControlState = old.accessControlState;
      members = old.members;
      recoveries = old.recoveries;
      products = old.products;
      knowledge = old.knowledge;
      orders = old.orders;
      orderCounter = old.orderCounter;
      subscriptions = Map.empty();
      plans;
      levels;
      points = Map.empty();
      survivalCards;
      courses;
      trainings;
      posts;
      postCounter = { var value = 1 };
      emergencyPlans = Map.empty();
      planCounter = { var value = 0 };
      kits = Map.empty();
      kitCounter = { var value = 0 };
    };
  };
};
