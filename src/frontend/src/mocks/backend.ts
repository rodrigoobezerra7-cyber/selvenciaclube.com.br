import {
  KitReadiness,
  KnowledgeCategory,
  ProductCategory,
  SubscriptionStatus,
  UserRole,
} from "../backend";
import type { backendInterface } from "../backend";

const products = [
  {
    id: BigInt(1),
    name: "Lanterna Tática Selvência",
    description:
      "Lanterna de alumínio com 1200 lúmens, três modos de iluminação e bateria recarregável. Resistente a água IPX6.",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
    category: ProductCategory.lanternas,
    priceCents: BigInt(18990),
  },
  {
    id: BigInt(2),
    name: "Faca de Campo Aço Carbono",
    description:
      "Lâmina de aço carbono 1095 com cabo em micarta. Ideal para corte de madeira e preparo de alimentos em campo.",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800",
    category: ProductCategory.facas,
    priceCents: BigInt(24900),
  },
  {
    id: BigInt(3),
    name: "Binóculo 10x42",
    description:
      "Binóculo com prismas BaK-4, revestimento antirreflexo e campo de visão amplo para observação de longa distância.",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
    category: ProductCategory.binoculos,
    priceCents: BigInt(45900),
  },
  {
    id: BigInt(4),
    name: "Camiseta Selvência Operações",
    description:
      "Camiseta de algodão pesado com estampa tática discreta. Peça de uniforme da comunidade.",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    category: ProductCategory.camisetas,
    priceCents: BigInt(8900),
  },
];

const knowledge = [
  {
    id: BigInt(1),
    title: "Checklist do Kit de 72 horas",
    summary: "Itens essenciais para três dias de autonomia em campo.",
    content:
      "Água: 3 litros por pessoa. Alimentação: barras, rações e comida liofilizada. Abrigo: lona, cordas e saco de dormir. Fogo: isqueiro, fósforos impermeáveis e pederneira. Sinalização: apito, espelho e rádio.",
    category: KnowledgeCategory.checklists,
  },
  {
    id: BigInt(2),
    title: "Validade dos insumos de emergência",
    summary: "Como revisar e rotacionar o estoque a cada seis meses.",
    content:
      "Revise a validade de água engarrafada, rações e medicamentos a cada seis meses. Rotacione o estoque consumindo primeiro o mais antigo. Anote as datas na embalagem com marcador permanente.",
    category: KnowledgeCategory.validade,
  },
  {
    id: BigInt(3),
    title: "Manutenção de equipamentos",
    summary: "Rotina de limpeza e lubrificação de facas e lanternas.",
    content:
      "Após cada uso, limpe a lâmina com pano seco e aplique óleo fino. Verifique os contatos da lanterna e recarregue a bateria a cada três meses. Guarde tudo seco e longe de umidade.",
    category: KnowledgeCategory.manutencao,
  },
  {
    id: BigInt(4),
    title: "Técnicas de sobrevivência: abrigo",
    summary: "Construção de abrigo improvisado com lona e vegetação.",
    content:
      "Escolha terreno elevado e protegido do vento. Estique a lona em ângulo para escoar a chuva. Isole o solo com folhas secas e galhos. Sinalize a entrada para facilitar o retorno.",
    category: KnowledgeCategory.tecnicas,
  },
];

const categories = [
  { count: BigInt(1), caption: "Iluminação portátil", category: ProductCategory.lanternas },
  { count: BigInt(1), caption: "Corte e campo", category: ProductCategory.facas },
  { count: BigInt(1), caption: "Observação", category: ProductCategory.binoculos },
  { count: BigInt(1), caption: "Uniforme", category: ProductCategory.camisetas },
];

const member = {
  id: { toText: () => "aaaaa-aa" } as never,
  code: "SELV-0421",
  email: "membro@selvencia.app",
  registeredAt: BigInt(Date.now()) * BigInt(1000000),
};

const nowNs = () => BigInt(Date.now()) * BigInt(1000000);

const plans = [
  {
    id: BigInt(1),
    name: "Visitante",
    rank: BigInt(0),
    description: "Acesso à Central de Operações e ao Arsenal Selvência.",
    priceCents: BigInt(0),
  },
  {
    id: BigInt(2),
    name: "Recruta",
    rank: BigInt(1),
    description: "Biblioteca de sobrevivência e comunidade privada.",
    priceCents: BigInt(1990),
  },
  {
    id: BigInt(3),
    name: "Guardião",
    rank: BigInt(2),
    description: "Cursos, treinamentos e planejamento de emergência.",
    priceCents: BigInt(3990),
  },
  {
    id: BigInt(4),
    name: "Sentinela",
    rank: BigInt(3),
    description: "Todos os conteúdos exclusivos e prioridade em operações.",
    priceCents: BigInt(5990),
  },
];

let subscription = {
  member: member.id,
  status: SubscriptionStatus.active,
  startedAt: nowNs(),
  planId: BigInt(3),
  renewsAt: nowNs() + BigInt(30) * BigInt(86400) * BigInt(1000000000),
  pendingPlan: undefined as bigint | undefined,
};

const levels = [
  {
    ordinal: BigInt(0),
    name: "Novo integrante",
    description: "Primeiros passos na comunidade Selvência.",
    pointsRequired: BigInt(0),
  },
  {
    ordinal: BigInt(1),
    name: "Explorador",
    description: "Participa das operações e conclui treinamentos básicos.",
    pointsRequired: BigInt(100),
  },
  {
    ordinal: BigInt(2),
    name: "Guardião",
    description: "Referência em preparação e apoio aos demais membros.",
    pointsRequired: BigInt(300),
  },
  {
    ordinal: BigInt(3),
    name: "Sentinela",
    description: "Elite da comunidade, lidera operações de campo.",
    pointsRequired: BigInt(600),
  },
];

const survivalCards = [
  {
    id: BigInt(1),
    title: "Purificação de água em campo",
    summary: "Métodos de fervura, filtragem e pastilhas.",
    content:
      "Ferva por no mínimo um minuto. Na falta de fogo, use filtro de carvão ativado ou pastilhas de cloro. Deixe agir por 30 minutos antes de consumir.",
    minPlanRank: BigInt(1),
  },
  {
    id: BigInt(2),
    title: "Orientação sem bússola",
    summary: "Uso do sol, sombras e estrelas para navegar.",
    content:
      "Aponte o ponteiro das horas para o sol e divida o ângulo até o 12 em duas partes: a bissetriz indica o norte. À noite, localize o Cruzeiro do Sul.",
    minPlanRank: BigInt(1),
  },
  {
    id: BigInt(3),
    title: "Primeiros socorros táticos",
    summary: "Controle de hemorragias e imobilização.",
    content:
      "Aplique pressão direta na ferida. Use torniquete apenas em hemorragias graves e anote o horário. Imobilize fraturas antes de mover a vítima.",
    minPlanRank: BigInt(2),
  },
];

const courses = [
  {
    id: BigInt(1),
    title: "Fundamentos de Sobrevivência",
    summary: "Base para qualquer operação em campo.",
    minPlanRank: BigInt(1),
    lessons: [
      { title: "Prioridades de sobrevivência", summary: "Água, abrigo, fogo e sinalização.", durationMinutes: BigInt(25) },
      { title: "Montagem de abrigo", summary: "Lonas, vegetação e terreno.", durationMinutes: BigInt(40) },
    ],
    materials: ["Manual de campo", "Checklist de 72 horas"],
  },
  {
    id: BigInt(2),
    title: "Navegação e Orientação",
    summary: "Mapas, bússola e leitura de terreno.",
    minPlanRank: BigInt(2),
    lessons: [
      { title: "Leitura de mapa", summary: "Curvas de nível e escala.", durationMinutes: BigInt(35) },
      { title: "Bússola na prática", summary: "Azimute e rumo.", durationMinutes: BigInt(30) },
    ],
    materials: ["Carta topográfica", "Bússola de lente"],
  },
];

const trainings = [
  {
    id: BigInt(1),
    title: "Treinamento de evacuação",
    summary: "Simulado de saída rápida e ponto de encontro.",
    content:
      "Defina rotas primária e alternativa. Cronometre a evacuação. Confira o ponto de encontro e a lista de presença.",
    minPlanRank: BigInt(1),
  },
  {
    id: BigInt(2),
    title: "Operação noturna",
    summary: "Deslocamento e comunicação com pouca luz.",
    content:
      "Use lanternas com filtro vermelho. Mantenha silêncio de rádio. Estabeleça sinais de mão para comunicação.",
    minPlanRank: BigInt(2),
  },
];

const communityPosts = [
  {
    id: BigInt(1),
    title: "Relato: kit de 72h revisado",
    body: "Revisei meu kit e troquei as rações vencidas. Recomendo a todos fazerem o mesmo neste mês.",
    author: member.id,
    authorCode: "SELV-0421",
    createdAt: nowNs(),
    minPlanRank: BigInt(1),
  },
  {
    id: BigInt(2),
    title: "Dúvida sobre purificação de água",
    body: "Alguém já testou pastilhas de cloro em água de rio? Qual a dosagem recomendada?",
    author: member.id,
    authorCode: "SELV-0421",
    createdAt: nowNs(),
    minPlanRank: BigInt(1),
  },
];

const emergencyPlans = [
  {
    id: BigInt(1),
    member: member.id,
    title: "Plano de evacuação residencial",
    minPlanRank: BigInt(2),
    createdAt: nowNs(),
    steps: [
      { order: BigInt(1), instruction: "Reunir documentos e kit de emergência." },
      { order: BigInt(2), instruction: "Desligar gás e energia elétrica." },
      { order: BigInt(3), instruction: "Seguir para o ponto de encontro." },
    ],
  },
];

const kits = [
  {
    id: BigInt(1),
    member: member.id,
    name: "Kit de campo 72h",
    minPlanRank: BigInt(1),
    readiness: KitReadiness.pronto,
    items: [
      { name: "Água", quantity: BigInt(6), ready: true },
      { name: "Rações", quantity: BigInt(9), ready: true },
      { name: "Lanterna", quantity: BigInt(2), ready: true },
    ],
  },
  {
    id: BigInt(2),
    member: member.id,
    name: "Kit médico",
    minPlanRank: BigInt(1),
    readiness: KitReadiness.critico,
    items: [
      { name: "Torniquete", quantity: BigInt(1), ready: true },
      { name: "Gaze estéril", quantity: BigInt(5), ready: false },
    ],
  },
];

export const mockBackend = {
  assignCallerUserRole: async () => undefined,
  cancelSubscription: async () => {
    subscription = { ...subscription, status: SubscriptionStatus.cancelled };
    return { __kind__: "ok" as const, ok: subscription };
  },
  confirmSubscriptionPayment: async () => {
    subscription = {
      ...subscription,
      status: SubscriptionStatus.active,
      planId: subscription.pendingPlan ?? subscription.planId,
      pendingPlan: undefined,
    };
    return { __kind__: "ok" as const, ok: subscription };
  },
  createCommunityPost: async (title: string, body: string) => ({
    __kind__: "ok" as const,
    ok: {
      id: BigInt(communityPosts.length + 1),
      title,
      body,
      author: member.id,
      authorCode: member.code,
      createdAt: nowNs(),
      minPlanRank: BigInt(1),
    },
  }),
  createEmergencyPlan: async (title: string, steps: { order: bigint; instruction: string }[]) => ({
    __kind__: "ok" as const,
    ok: {
      id: BigInt(emergencyPlans.length + 1),
      member: member.id,
      title,
      minPlanRank: BigInt(2),
      createdAt: nowNs(),
      steps,
    },
  }),
  createKit: async (name: string, items: { name: string; quantity: bigint; ready: boolean }[]) => ({
    __kind__: "ok" as const,
    ok: {
      id: BigInt(kits.length + 1),
      member: member.id,
      name,
      minPlanRank: BigInt(1),
      readiness: KitReadiness.incompleto,
      items,
    },
  }),
  execute: async () => ({ hasMore: false, rows: [] }),
  getApiDoc: async () => "# SELVÊNCIA API",
  getCallerUserRole: async () => UserRole.user,
  getCourse: async (id: bigint) => {
    const course = courses.find((c) => c.id === id);
    return course
      ? { __kind__: "ok" as const, ok: course }
      : { __kind__: "err" as const, err: { __kind__: "unknownContent" as const, unknownContent: id } };
  },
  getKnowledge: async (id: bigint) => knowledge.find((k) => k.id === id) ?? null,
  getMyProfile: async () => member,
  getMyProgress: async () => ({
    level: levels[1],
    points: BigInt(140),
    nextLevel: levels[2],
    pointsToNext: BigInt(160),
  }),
  getMySubscription: async () => subscription,
  getProduct: async (id: bigint) => products.find((p) => p.id === id) ?? null,
  getSurvivalCard: async (id: bigint) => {
    const card = survivalCards.find((c) => c.id === id);
    return card
      ? { __kind__: "ok" as const, ok: card }
      : { __kind__: "err" as const, err: { __kind__: "unknownContent" as const, unknownContent: id } };
  },
  isCallerAdmin: async () => false,
  listCategories: async () => categories,
  listCommunityPosts: async () => communityPosts,
  listCourses: async () => courses,
  listKnowledge: async () => knowledge,
  listLevels: async () => levels,
  listMyEmergencyPlans: async () => emergencyPlans,
  listMyKits: async () => kits,
  listPlans: async () => plans,
  listProducts: async () => products,
  listSurvivalCards: async () => survivalCards,
  listTrainings: async () => trainings,
  placeOrder: async (productId: bigint, quantity: bigint) => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return { __kind__: "err" as const, err: { __kind__: "unknownProduct" as const, unknownProduct: productId } };
    }
    return {
      __kind__: "ok" as const,
      ok: {
        id: BigInt(1),
        member: member.id,
        unitPriceCents: product.priceCents,
        createdAt: BigInt(Date.now()) * BigInt(1000000),
        productId,
        quantity,
      },
    };
  },
  registerMember: async (code: string) => ({
    __kind__: "ok" as const,
    ok: { ...member, code },
  }),
  schema: async () => "{}",
  subscribe: async (planId: bigint) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) {
      return { __kind__: "err" as const, err: { __kind__: "planNotFound" as const, planNotFound: planId } };
    }
    subscription = {
      ...subscription,
      status: SubscriptionStatus.pending,
      pendingPlan: planId,
    };
    return { __kind__: "ok" as const, ok: subscription };
  },
  verifyRecoveryCode: async () => ({ __kind__: "ok" as const, ok: null }),
} satisfies Pick<
  backendInterface,
  | "assignCallerUserRole"
  | "cancelSubscription"
  | "confirmSubscriptionPayment"
  | "createCommunityPost"
  | "createEmergencyPlan"
  | "createKit"
  | "execute"
  | "getApiDoc"
  | "getCallerUserRole"
  | "getCourse"
  | "getKnowledge"
  | "getMyProfile"
  | "getMyProgress"
  | "getMySubscription"
  | "getProduct"
  | "getSurvivalCard"
  | "isCallerAdmin"
  | "listCategories"
  | "listCommunityPosts"
  | "listCourses"
  | "listKnowledge"
  | "listLevels"
  | "listMyEmergencyPlans"
  | "listMyKits"
  | "listPlans"
  | "listProducts"
  | "listSurvivalCards"
  | "listTrainings"
  | "placeOrder"
  | "registerMember"
  | "schema"
  | "subscribe"
  | "verifyRecoveryCode"
>;
