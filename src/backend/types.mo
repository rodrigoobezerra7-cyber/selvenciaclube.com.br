module {
  public type Timestamp = Int;
  public type MemberId = Principal;
  public type ProductId = Nat;
  public type KnowledgeId = Nat;
  public type OrderId = Nat;

  public type Member = {
    id : MemberId;
    code : Text;
    email : ?Text;
    registeredAt : Timestamp;
  };

  public type MemberError = {
    #notRegistered;
    #codeTaken;
    #invalidCode;
  };

  // Recuperação de acesso: código de verificação enviado por e-mail.
  public type RecoveryRequest = {
    code : Text;
    expiresAt : Timestamp;
    attempts : Nat;
  };

  public type RecoveryError = {
    #notRegistered;
    #noEmail;
    #invalidEmail;
    #invalidCode;
    #codeExpired;
    #tooManyAttempts;
    #emailFailed : Text;
  };

  public type ProductCategory = {
    #lanternas;
    #facas;
    #binoculos;
    #camisetas;
  };

  public type Product = {
    id : ProductId;
    name : Text;
    category : ProductCategory;
    priceCents : Nat;
    description : Text;
    imageUrl : Text;
    available : Bool;
  };

  public type CategoryInfo = {
    category : ProductCategory;
    caption : Text;
    count : Nat;
  };

  public type KnowledgeCategory = {
    #checklists;
    #validade;
    #manutencao;
    #tecnicas;
  };

  public type KnowledgeCard = {
    id : KnowledgeId;
    title : Text;
    category : KnowledgeCategory;
    summary : Text;
    content : Text;
  };

  public type Order = {
    id : OrderId;
    member : MemberId;
    productId : ProductId;
    quantity : Nat;
    unitPriceCents : Nat;
    createdAt : Timestamp;
  };

  public type OrderError = {
    #notRegistered;
    #unknownProduct : ProductId;
    #unavailable : ProductId;
    #invalidQuantity;
  };

  // ===== Clã Selvência: assinatura de membro =====

  public type PlanId = Nat;
  public type SubscriptionId = Nat;
  public type ClanContentId = Nat;
  public type PostId = Nat;
  public type CourseId = Nat;
  public type TrainingId = Nat;
  public type EmergencyPlanId = Nat;
  public type KitId = Nat;

  // Planos do clube: Visitante (grátis), Recruta, Guardião e Sentinela.
  public type Plan = {
    id : PlanId;
    name : Text;
    priceCents : Nat;
    rank : Nat;
    description : Text;
  };

  public type SubscriptionStatus = {
    #active;
    #pending;
    #cancelled;
  };

  // Assinatura de um membro. `pendingPlan` é o plano para o qual o membro está
  // migrando enquanto o pagamento não é confirmado.
  public type Subscription = {
    member : MemberId;
    planId : PlanId;
    status : SubscriptionStatus;
    startedAt : Timestamp;
    renewsAt : Timestamp;
    pendingPlan : ?PlanId;
  };

  public type MembershipError = {
    #planNotFound : PlanId;
    #subscriptionAlreadyActive;
    #paymentNotConfirmed;
    #notEntitled : PlanId;
    #invalidInput;
  };

  // ===== Clã Selvência: níveis de membro =====

  public type MemberLevel = {
    ordinal : Nat;
    name : Text;
    description : Text;
    pointsRequired : Nat;
  };

  public type MemberProgress = {
    level : MemberLevel;
    points : Nat;
    nextLevel : ?MemberLevel;
    pointsToNext : Nat;
  };

  // ===== Clã Selvência: conteúdos exclusivos =====

  public type SurvivalCard = {
    id : ClanContentId;
    title : Text;
    summary : Text;
    content : Text;
    minPlanRank : Nat;
  };

  public type Lesson = {
    title : Text;
    summary : Text;
    durationMinutes : Nat;
  };

  public type Course = {
    id : CourseId;
    title : Text;
    summary : Text;
    lessons : [Lesson];
    materials : [Text];
    minPlanRank : Nat;
  };

  public type Training = {
    id : TrainingId;
    title : Text;
    summary : Text;
    content : Text;
    minPlanRank : Nat;
  };

  public type CommunityPost = {
    id : PostId;
    author : MemberId;
    authorCode : Text;
    title : Text;
    body : Text;
    createdAt : Timestamp;
    minPlanRank : Nat;
  };

  public type EmergencyStep = {
    order : Nat;
    instruction : Text;
  };

  public type EmergencyPlan = {
    id : EmergencyPlanId;
    member : MemberId;
    title : Text;
    steps : [EmergencyStep];
    createdAt : Timestamp;
    minPlanRank : Nat;
  };

  public type KitItem = {
    name : Text;
    quantity : Nat;
    ready : Bool;
  };

  public type KitReadiness = {
    #pronto;
    #incompleto;
    #critico;
  };

  public type MemberKit = {
    id : KitId;
    member : MemberId;
    name : Text;
    items : [KitItem];
    readiness : KitReadiness;
    minPlanRank : Nat;
  };

  public type ClanError = {
    #notRegistered;
    #notEntitled : PlanId;
    #unknownContent : ClanContentId;
    #invalidInput;
  };
};
