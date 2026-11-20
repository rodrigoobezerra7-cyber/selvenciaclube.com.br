import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Time "mo:core/Time";
import Types "../types";

module {
  // Duração de um ciclo mensal de assinatura em nanossegundos (30 dias).
  let monthNanos : Int = 2_592_000_000_000_000;

  public func listPlans(plans : Map.Map<Types.PlanId, Types.Plan>) : [Types.Plan] {
    let all = plans.values().toArray();
    all.sort(func (a, b) = Nat.compare(a.rank, b.rank));
  };

  public func getPlan(plans : Map.Map<Types.PlanId, Types.Plan>, id : Types.PlanId) : ?Types.Plan {
    plans.get(id);
  };

  public func getSubscription(
    subscriptions : Map.Map<Principal, Types.Subscription>,
    caller : Principal,
  ) : ?Types.Subscription {
    subscriptions.get(caller);
  };

  public func subscribe(
    subscriptions : Map.Map<Principal, Types.Subscription>,
    plans : Map.Map<Types.PlanId, Types.Plan>,
    members : Map.Map<Principal, Types.Member>,
    caller : Principal,
    planId : Types.PlanId,
  ) : Result.Result<Types.Subscription, Types.MembershipError> {
    if (members.get(caller) == null) {
      return #err(#invalidInput);
    };
    let plan = switch (plans.get(planId)) {
      case (?p) { p };
      case null { return #err(#planNotFound(planId)) };
    };
    // Plano gratuito: ativa imediatamente, sem etapa de pagamento.
    if (plan.priceCents == 0) {
      let now = Time.now();
      let sub : Types.Subscription = {
        member = caller;
        planId;
        status = #active;
        startedAt = now;
        renewsAt = now + monthNanos;
        pendingPlan = null;
      };
      subscriptions.add(caller, sub);
      return #ok(sub);
    };
    switch (subscriptions.get(caller)) {
      case (?existing) {
        switch (existing.status) {
          case (#active) {
            // Troca de plano: aplica o novo rank imediatamente e mantém a
            // assinatura ativa, renovando o ciclo a partir de agora.
            let now = Time.now();
            let updated : Types.Subscription = {
              existing with
              planId;
              status = #active;
              startedAt = now;
              renewsAt = now + monthNanos;
              pendingPlan = null;
            };
            subscriptions.add(caller, updated);
            #ok(updated);
          };
          case (#pending) {
            // Já existe um pagamento pendente: registra o plano desejado.
            let updated : Types.Subscription = {
              existing with
              planId;
              pendingPlan = ?planId;
            };
            subscriptions.add(caller, updated);
            #ok(updated);
          };
          case (#cancelled) {
            let now = Time.now();
            let created : Types.Subscription = {
              member = caller;
              planId;
              status = #pending;
              startedAt = now;
              renewsAt = now;
              pendingPlan = null;
            };
            subscriptions.add(caller, created);
            #ok(created);
          };
        };
      };
      case null {
        let now = Time.now();
        let created : Types.Subscription = {
          member = caller;
          planId;
          status = #pending;
          startedAt = now;
          renewsAt = now;
          pendingPlan = null;
        };
        subscriptions.add(caller, created);
        #ok(created);
      };
    };
  };

  public func confirmPayment(
    subscriptions : Map.Map<Principal, Types.Subscription>,
    caller : Principal,
  ) : Result.Result<Types.Subscription, Types.MembershipError> {
    switch (subscriptions.get(caller)) {
      case (?existing) {
        switch (existing.status) {
          case (#pending) {
            let now = Time.now();
            let targetPlan = existing.pendingPlan ?? existing.planId;
            let activated : Types.Subscription = {
              existing with
              planId = targetPlan;
              status = #active;
              startedAt = now;
              renewsAt = now + monthNanos;
              pendingPlan = null;
            };
            subscriptions.add(caller, activated);
            #ok(activated);
          };
          case (#active) { #err(#subscriptionAlreadyActive) };
          case (#cancelled) { #err(#paymentNotConfirmed) };
        };
      };
      case null { #err(#paymentNotConfirmed) };
    };
  };

  public func cancelSubscription(
    subscriptions : Map.Map<Principal, Types.Subscription>,
    caller : Principal,
  ) : Result.Result<Types.Subscription, Types.MembershipError> {
    switch (subscriptions.get(caller)) {
      case (?existing) {
        // Cancelar devolve o membro ao acesso gratuito Visitante (plano 0).
        let cancelled : Types.Subscription = {
          existing with
          planId = 0;
          status = #cancelled;
          renewsAt = existing.startedAt;
          pendingPlan = null;
        };
        subscriptions.add(caller, cancelled);
        #ok(cancelled);
      };
      case null { #err(#paymentNotConfirmed) };
    };
  };

  public func listLevels(levels : Map.Map<Nat, Types.MemberLevel>) : [Types.MemberLevel] {
    let all = levels.values().toArray();
    all.sort(func (a, b) = Nat.compare(a.ordinal, b.ordinal));
  };

  public func getProgress(
    levels : Map.Map<Nat, Types.MemberLevel>,
    points : Map.Map<Principal, Nat>,
    caller : Principal,
  ) : Types.MemberProgress {
    let memberPoints = points.get(caller) ?? 0;
    let ordered = listLevels(levels);
    var current : Types.MemberLevel = {
      ordinal = 0;
      name = "Novo integrante";
      description = "";
      pointsRequired = 0;
    };
    var next : ?Types.MemberLevel = null;
    for (level in ordered.values()) {
      if (level.pointsRequired <= memberPoints) {
        current := level;
      } else if (next == null) {
        next := ?level;
      };
    };
    let pointsToNext = switch (next) {
      case (?n) {
        if (n.pointsRequired > memberPoints) {
          n.pointsRequired - memberPoints;
        } else {
          0;
        };
      };
      case null { 0 };
    };
    {
      level = current;
      points = memberPoints;
      nextLevel = next;
      pointsToNext;
    };
  };

  public func planRankOf(
    subscriptions : Map.Map<Principal, Types.Subscription>,
    plans : Map.Map<Types.PlanId, Types.Plan>,
    caller : Principal,
  ) : Nat {
    let planId = switch (subscriptions.get(caller)) {
      case (?sub) {
        switch (sub.status) {
          case (#active) { sub.planId };
          case (_) { 0 };
        };
      };
      case null { 0 };
    };
    switch (plans.get(planId)) {
      case (?plan) { plan.rank };
      case null { 0 };
    };
  };
};
