export type {
  CategoryInfo,
  ClanContentId,
  ClanError,
  CommunityPost,
  Course,
  CourseId,
  EmergencyPlan,
  EmergencyPlanId,
  EmergencyStep,
  KitId,
  KitItem,
  KnowledgeCard,
  KnowledgeId,
  Lesson,
  Member,
  MemberId,
  MemberKit,
  MemberLevel,
  MemberProgress,
  MembershipError,
  Order,
  OrderError,
  OrderId,
  Plan,
  PlanId,
  PostId,
  Product,
  ProductId,
  Result,
  Result_1,
  Result_4,
  Result_5,
  Result_6,
  Result_7,
  Result_8,
  Subscription,
  SurvivalCard,
  Timestamp,
  Training,
  TrainingId,
} from "@/backend";

export {
  KitReadiness,
  KnowledgeCategory,
  MemberError,
  ProductCategory,
  SubscriptionStatus,
} from "@/backend";

export const PRODUCT_CATEGORY_LABEL: Record<string, string> = {
  lanternas: "Lanternas",
  facas: "Facas",
  binoculos: "Binóculos",
  camisetas: "Camisetas",
};

export const KNOWLEDGE_CATEGORY_LABEL: Record<string, string> = {
  checklists: "Checklists de kits",
  validade: "Validade",
  manutencao: "Manutenção",
  tecnicas: "Técnicas",
};

export const PLAN_LABEL: Record<string, string> = {
  visitante: "Visitante",
  recruta: "Recruta",
  guardiao: "Guardião",
  sentinela: "Sentinela",
};

export const LEVEL_LABEL: Record<string, string> = {
  novo_integrante: "Novo integrante",
  explorador: "Explorador",
  guardiao: "Guardião",
  sentinela: "Sentinela",
};

export const SUBSCRIPTION_STATUS_LABEL: Record<string, string> = {
  active: "Ativa",
  pending: "Pagamento pendente",
  cancelled: "Cancelada",
};

export const KIT_READINESS_LABEL: Record<string, string> = {
  pronto: "Pronto",
  critico: "Crítico",
  incompleto: "Incompleto",
};

export function formatPrice(cents: bigint): string {
  const value = Number(cents) / 100;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatMonthlyPrice(cents: bigint): string {
  if (cents === 0n) return "Gratuito";
  return `${formatPrice(cents)}/mês`;
}

export function planLabel(name: string): string {
  return PLAN_LABEL[name.toLowerCase()] ?? name;
}

export function levelLabel(name: string): string {
  return LEVEL_LABEL[name.toLowerCase()] ?? name;
}

export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}
