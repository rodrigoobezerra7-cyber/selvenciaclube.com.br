import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Types "../types";
import MembershipLib "../lib/membership";

mixin (
  subscriptions : Map.Map<Principal, Types.Subscription>,
  plans : Map.Map<Types.PlanId, Types.Plan>,
  levels : Map.Map<Nat, Types.MemberLevel>,
  points : Map.Map<Principal, Nat>,
  members : Map.Map<Principal, Types.Member>,
) {
  public query func listPlans() : async [Types.Plan] {
    MembershipLib.listPlans(plans);
  };

  public query ({ caller }) func getMySubscription() : async ?Types.Subscription {
    MembershipLib.getSubscription(subscriptions, caller);
  };

  public shared ({ caller }) func subscribe(planId : Types.PlanId) : async Result.Result<Types.Subscription, Types.MembershipError> {
    MembershipLib.subscribe(subscriptions, plans, members, caller, planId);
  };

  public shared ({ caller }) func confirmSubscriptionPayment() : async Result.Result<Types.Subscription, Types.MembershipError> {
    MembershipLib.confirmPayment(subscriptions, caller);
  };

  public shared ({ caller }) func cancelSubscription() : async Result.Result<Types.Subscription, Types.MembershipError> {
    MembershipLib.cancelSubscription(subscriptions, caller);
  };

  public query func listLevels() : async [Types.MemberLevel] {
    MembershipLib.listLevels(levels);
  };

  public query ({ caller }) func getMyProgress() : async Types.MemberProgress {
    MembershipLib.getProgress(levels, points, caller);
  };
};
