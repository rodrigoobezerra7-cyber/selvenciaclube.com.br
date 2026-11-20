import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CategoryInfo {
    count: bigint;
    caption: string;
    category: ProductCategory;
}
export interface Cell {
    value: Value;
    name: string;
}
export type ClanContentId = bigint;
export type ClanError = {
    __kind__: "invalidInput";
    invalidInput: null;
} | {
    __kind__: "unknownContent";
    unknownContent: ClanContentId;
} | {
    __kind__: "notEntitled";
    notEntitled: PlanId;
} | {
    __kind__: "notRegistered";
    notRegistered: null;
};
export interface CommunityPost {
    id: PostId;
    title: string;
    minPlanRank: bigint;
    body: string;
    authorCode: string;
    createdAt: Timestamp;
    author: MemberId;
}
export interface Course {
    id: CourseId;
    title: string;
    minPlanRank: bigint;
    lessons: Array<Lesson>;
    summary: string;
    materials: Array<string>;
}
export type CourseId = bigint;
export interface EmergencyPlan {
    id: EmergencyPlanId;
    member: MemberId;
    title: string;
    minPlanRank: bigint;
    createdAt: Timestamp;
    steps: Array<EmergencyStep>;
}
export type EmergencyPlanId = bigint;
export interface EmergencyStep {
    order: bigint;
    instruction: string;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export type KitId = bigint;
export interface KitItem {
    name: string;
    quantity: bigint;
    ready: boolean;
}
export interface KnowledgeCard {
    id: KnowledgeId;
    title: string;
    content: string;
    summary: string;
    category: KnowledgeCategory;
}
export type KnowledgeId = bigint;
export interface Lesson {
    title: string;
    summary: string;
    durationMinutes: bigint;
}
export interface Member {
    id: MemberId;
    code: string;
    email?: string;
    registeredAt: Timestamp;
}
export type MemberId = Principal;
export interface MemberKit {
    id: KitId;
    member: MemberId;
    minPlanRank: bigint;
    name: string;
    items: Array<KitItem>;
    readiness: KitReadiness;
}
export interface MemberLevel {
    pointsRequired: bigint;
    name: string;
    description: string;
    ordinal: bigint;
}
export interface MemberProgress {
    nextLevel?: MemberLevel;
    level: MemberLevel;
    pointsToNext: bigint;
    points: bigint;
}
export type MembershipError = {
    __kind__: "planNotFound";
    planNotFound: PlanId;
} | {
    __kind__: "paymentNotConfirmed";
    paymentNotConfirmed: null;
} | {
    __kind__: "invalidInput";
    invalidInput: null;
} | {
    __kind__: "subscriptionAlreadyActive";
    subscriptionAlreadyActive: null;
} | {
    __kind__: "notEntitled";
    notEntitled: PlanId;
};
export interface Order {
    id: OrderId;
    member: MemberId;
    unitPriceCents: bigint;
    createdAt: Timestamp;
    productId: ProductId;
    quantity: bigint;
}
export type OrderError = {
    __kind__: "unknownProduct";
    unknownProduct: ProductId;
} | {
    __kind__: "notRegistered";
    notRegistered: null;
} | {
    __kind__: "invalidQuantity";
    invalidQuantity: null;
} | {
    __kind__: "unavailable";
    unavailable: ProductId;
};
export type OrderId = bigint;
export interface Plan {
    id: PlanId;
    name: string;
    rank: bigint;
    description: string;
    priceCents: bigint;
}
export type PlanId = bigint;
export type PostId = bigint;
export interface Product {
    id: ProductId;
    name: string;
    description: string;
    available: boolean;
    imageUrl: string;
    category: ProductCategory;
    priceCents: bigint;
}
export type ProductId = bigint;
export type RecoveryError = {
    __kind__: "invalidEmail";
    invalidEmail: null;
} | {
    __kind__: "codeExpired";
    codeExpired: null;
} | {
    __kind__: "noEmail";
    noEmail: null;
} | {
    __kind__: "tooManyAttempts";
    tooManyAttempts: null;
} | {
    __kind__: "invalidCode";
    invalidCode: null;
} | {
    __kind__: "emailFailed";
    emailFailed: string;
} | {
    __kind__: "notRegistered";
    notRegistered: null;
};
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: RecoveryError;
};
export type Result_1 = {
    __kind__: "ok";
    ok: Subscription;
} | {
    __kind__: "err";
    err: MembershipError;
};
export type Result_10 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export type Result_2 = {
    __kind__: "ok";
    ok: Member;
} | {
    __kind__: "err";
    err: MemberError;
};
export type Result_3 = {
    __kind__: "ok";
    ok: Order;
} | {
    __kind__: "err";
    err: OrderError;
};
export type Result_4 = {
    __kind__: "ok";
    ok: SurvivalCard;
} | {
    __kind__: "err";
    err: ClanError;
};
export type Result_5 = {
    __kind__: "ok";
    ok: Course;
} | {
    __kind__: "err";
    err: ClanError;
};
export type Result_6 = {
    __kind__: "ok";
    ok: MemberKit;
} | {
    __kind__: "err";
    err: ClanError;
};
export type Result_7 = {
    __kind__: "ok";
    ok: EmergencyPlan;
} | {
    __kind__: "err";
    err: ClanError;
};
export type Result_8 = {
    __kind__: "ok";
    ok: CommunityPost;
} | {
    __kind__: "err";
    err: ClanError;
};
export type Result_9 = {
    __kind__: "ok";
    ok: Member;
} | {
    __kind__: "err";
    err: RecoveryError;
};
export interface Result__1 {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface Subscription {
    member: MemberId;
    status: SubscriptionStatus;
    startedAt: Timestamp;
    planId: PlanId;
    renewsAt: Timestamp;
    pendingPlan?: PlanId;
}
export interface SurvivalCard {
    id: ClanContentId;
    title: string;
    content: string;
    minPlanRank: bigint;
    summary: string;
}
export type Timestamp = bigint;
export interface Training {
    id: TrainingId;
    title: string;
    content: string;
    minPlanRank: bigint;
    summary: string;
}
export type TrainingId = bigint;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum KitReadiness {
    incompleto = "incompleto",
    critico = "critico",
    pronto = "pronto"
}
export enum KnowledgeCategory {
    validade = "validade",
    manutencao = "manutencao",
    tecnicas = "tecnicas",
    checklists = "checklists"
}
export enum MemberError {
    codeTaken = "codeTaken",
    invalidCode = "invalidCode",
    notRegistered = "notRegistered"
}
export enum ProductCategory {
    lanternas = "lanternas",
    camisetas = "camisetas",
    binoculos = "binoculos",
    facas = "facas"
}
export enum SubscriptionStatus {
    active = "active",
    cancelled = "cancelled",
    pending = "pending"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelSubscription(): Promise<Result_1>;
    completeRecovery(code: string): Promise<Result_9>;
    confirmSubscriptionPayment(): Promise<Result_1>;
    createCommunityPost(title: string, body: string): Promise<Result_8>;
    createEmergencyPlan(title: string, steps: Array<EmergencyStep>): Promise<Result_7>;
    createKit(name: string, items: Array<KitItem>): Promise<Result_6>;
    execute(qJson: string): Promise<Result__1>;
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getCourse(id: CourseId): Promise<Result_5>;
    getKnowledge(id: bigint): Promise<KnowledgeCard | null>;
    getMyProfile(): Promise<Member | null>;
    getMyProgress(): Promise<MemberProgress>;
    getMySubscription(): Promise<Subscription | null>;
    getProduct(id: bigint): Promise<Product | null>;
    getSurvivalCard(id: ClanContentId): Promise<Result_4>;
    isCallerAdmin(): Promise<boolean>;
    listCategories(): Promise<Array<CategoryInfo>>;
    listCommunityPosts(): Promise<Array<CommunityPost>>;
    listCourses(): Promise<Array<Course>>;
    listKnowledge(): Promise<Array<KnowledgeCard>>;
    listLevels(): Promise<Array<MemberLevel>>;
    listMyEmergencyPlans(): Promise<Array<EmergencyPlan>>;
    listMyKits(): Promise<Array<MemberKit>>;
    listPlans(): Promise<Array<Plan>>;
    listProducts(): Promise<Array<Product>>;
    listSurvivalCards(): Promise<Array<SurvivalCard>>;
    listTrainings(): Promise<Array<Training>>;
    placeOrder(productId: bigint, quantity: bigint): Promise<Result_3>;
    registerMember(code: string, email: string | null): Promise<Result_2>;
    requestRecoveryCode(email: string): Promise<Result>;
    schema(): Promise<string>;
    subscribe(planId: PlanId): Promise<Result_1>;
    verifyRecoveryCode(code: string): Promise<Result>;
}
