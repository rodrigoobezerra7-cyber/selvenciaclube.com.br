import type {
  MemberLevel,
  MemberProgress,
  Plan,
  Subscription,
} from "@/backend";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMemo } from "react";
import {
  useMyProfile,
  useMyProgress,
  useMySubscription,
  usePlans,
} from "./useQueries";

export type MemberSession = {
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  isLoginError: boolean;
  loginError?: Error;
  login: () => void;
  logout: () => void;
  profile: ReturnType<typeof useMyProfile>["data"];
  isProfileLoading: boolean;
  isProfileFetched: boolean;
  isRegistered: boolean;
  /** Current subscription, or null when the member has none. */
  subscription: Subscription | null;
  /** Plan the member is entitled to (active plan, else pending plan). */
  plan: Plan | null;
  /** Rank of the member's plan; 0 for visitors without a subscription. */
  planRank: bigint;
  /** Progress through the member levels. */
  progress: MemberProgress | null;
  level: MemberLevel | null;
  isPlanLoading: boolean;
};

export function useMemberSession(): MemberSession {
  const {
    identity,
    login,
    clear,
    isInitializing,
    isLoggingIn,
    isLoginError,
    loginError,
  } = useInternetIdentity();
  const profileQuery = useMyProfile();
  const subscriptionQuery = useMySubscription();
  const plansQuery = usePlans();
  const progressQuery = useMyProgress();
  const isAuthenticated = !!identity;

  const subscription = subscriptionQuery.data ?? null;
  const plans = plansQuery.data ?? [];

  const plan = useMemo<Plan | null>(() => {
    if (!subscription) return null;
    const targetId = subscription.pendingPlan ?? subscription.planId;
    return plans.find((p) => p.id === targetId) ?? null;
  }, [subscription, plans]);

  const planRank = plan?.rank ?? 0n;
  const progress = progressQuery.data ?? null;

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    isLoginError,
    loginError,
    login: () => login(),
    logout: clear,
    profile: profileQuery.data ?? null,
    isProfileLoading: isAuthenticated && profileQuery.isLoading,
    isProfileFetched: profileQuery.isFetched,
    isRegistered: !!profileQuery.data,
    subscription,
    plan,
    planRank,
    progress,
    level: progress?.level ?? null,
    isPlanLoading:
      isAuthenticated && (subscriptionQuery.isLoading || plansQuery.isLoading),
  };
}
