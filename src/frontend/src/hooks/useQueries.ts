import type {
  CategoryInfo,
  CommunityPost,
  Course,
  EmergencyPlan,
  EmergencyStep,
  KitItem,
  KnowledgeCard,
  Member,
  MemberKit,
  MemberLevel,
  MemberProgress,
  Plan,
  PlanId,
  Product,
  Result,
  Result_1,
  Result_2,
  Result_3,
  Result_4,
  Result_5,
  Result_6,
  Result_7,
  Result_8,
  Result_9,
  Subscription,
  SurvivalCard,
  Training,
} from "@/backend";
import { createActor } from "@/backend";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMyProfile() {
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useQuery<Member | null>({
    queryKey: ["myProfile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
  });
}

export function useRegisterMember() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<Result_2, Error, { code: string; email: string | null }>({
    mutationFn: async ({ code, email }) => {
      if (!actor) throw new Error("Backend indisponível");
      return actor.registerMember(code, email);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      }
    },
  });
}

export function useRequestRecoveryCode() {
  const { actor } = useActor(createActor);

  return useMutation<Result, Error, { email: string }>({
    mutationFn: async ({ email }) => {
      if (!actor) throw new Error("Backend indisponível");
      return actor.requestRecoveryCode(email);
    },
  });
}

export function useVerifyRecoveryCode() {
  const { actor } = useActor(createActor);

  return useMutation<Result, Error, { code: string }>({
    mutationFn: async ({ code }) => {
      if (!actor) throw new Error("Backend indisponível");
      return actor.verifyRecoveryCode(code);
    },
  });
}

export function useCompleteRecovery() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<Result_9, Error, { code: string }>({
    mutationFn: async ({ code }) => {
      if (!actor) throw new Error("Backend indisponível");
      return actor.completeRecovery(code);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      }
    },
  });
}

export function useProducts() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCategories() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<CategoryInfo[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProduct(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Product | null>({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useKnowledgeList() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<KnowledgeCard[]>({
    queryKey: ["knowledge"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listKnowledge();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useKnowledgeCard(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<KnowledgeCard | null>({
    queryKey: ["knowledgeCard", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getKnowledge(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<Result_3, Error, { productId: bigint; quantity: bigint }>({
    mutationFn: async ({ productId, quantity }) => {
      if (!actor) throw new Error("Backend indisponível");
      return actor.placeOrder(productId, quantity);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ── Clã Selvência ──────────────────────────────────────────────────────────

export function usePlans() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Plan[]>({
    queryKey: ["clan", "plans"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMySubscription() {
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useQuery<Subscription | null>({
    queryKey: ["clan", "subscription", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMySubscription();
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
  });
}

export function useSubscribe() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<Result_1, Error, { planId: PlanId }>({
    mutationFn: async ({ planId }) => {
      if (!actor) throw new Error("Backend indisponível");
      return actor.subscribe(planId);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        void queryClient.invalidateQueries({ queryKey: ["clan"] });
      }
    },
  });
}

export function useConfirmSubscriptionPayment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<Result_1, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend indisponível");
      return actor.confirmSubscriptionPayment();
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        void queryClient.invalidateQueries({ queryKey: ["clan"] });
      }
    },
  });
}

export function useCancelSubscription() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<Result_1, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend indisponível");
      return actor.cancelSubscription();
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        void queryClient.invalidateQueries({ queryKey: ["clan"] });
      }
    },
  });
}

export function useLevels() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<MemberLevel[]>({
    queryKey: ["clan", "levels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listLevels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyProgress() {
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useQuery<MemberProgress | null>({
    queryKey: ["clan", "progress", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProgress();
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
  });
}

export function useSurvivalCards() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SurvivalCard[]>({
    queryKey: ["clan", "survivalCards"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSurvivalCards();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSurvivalCard(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Result_4 | null>({
    queryKey: ["clan", "survivalCard", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getSurvivalCard(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCourses() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Course[]>({
    queryKey: ["clan", "courses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCourses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCourse(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Result_5 | null>({
    queryKey: ["clan", "course", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getCourse(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useTrainings() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Training[]>({
    queryKey: ["clan", "trainings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTrainings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCommunityPosts() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<CommunityPost[]>({
    queryKey: ["clan", "communityPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCommunityPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCommunityPost() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<Result_8, Error, { title: string; body: string }>({
    mutationFn: async ({ title, body }) => {
      if (!actor) throw new Error("Backend indisponível");
      return actor.createCommunityPost(title, body);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        void queryClient.invalidateQueries({
          queryKey: ["clan", "communityPosts"],
        });
      }
    },
  });
}

export function useMyEmergencyPlans() {
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useQuery<EmergencyPlan[]>({
    queryKey: ["clan", "emergencyPlans", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyEmergencyPlans();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useCreateEmergencyPlan() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<
    Result_7,
    Error,
    { title: string; steps: EmergencyStep[] }
  >({
    mutationFn: async ({ title, steps }) => {
      if (!actor) throw new Error("Backend indisponível");
      return actor.createEmergencyPlan(title, steps);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        void queryClient.invalidateQueries({
          queryKey: ["clan", "emergencyPlans"],
        });
      }
    },
  });
}

export function useMyKits() {
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();

  return useQuery<MemberKit[]>({
    queryKey: ["clan", "kits", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyKits();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useCreateKit() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<Result_6, Error, { name: string; items: KitItem[] }>({
    mutationFn: async ({ name, items }) => {
      if (!actor) throw new Error("Backend indisponível");
      return actor.createKit(name, items);
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        void queryClient.invalidateQueries({ queryKey: ["clan", "kits"] });
      }
    },
  });
}
