import Int "mo:core/Int";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types";

module {
  // Rank mínimo para a comunidade privada: Recruta (rank 1) ou acima.
  let communityMinRank : Nat = 1;

  // Rank mínimo para planejamento de emergência e organização de kits: Guardião (rank 2).
  let guardianMinRank : Nat = 2;

  func isEntitled(callerRank : Nat, minPlanRank : Nat) : Bool {
    callerRank >= minPlanRank;
  };

  func notEntitled(minPlanRank : Nat) : Types.ClanError {
    #notEntitled(minPlanRank);
  };

  func sortedByTitle<T>(items : [T], titleOf : T -> Text) : [T] {
    items.sort(func(a, b) = Text.compare(titleOf(a), titleOf(b)));
  };

  public func listSurvivalCards(
    cards : Map.Map<Types.ClanContentId, Types.SurvivalCard>,
    callerRank : Nat,
  ) : [Types.SurvivalCard] {
    let visible = cards.values().filter(func(card) = isEntitled(callerRank, card.minPlanRank)).toArray();
    sortedByTitle(visible, func(card) = card.title);
  };

  public func getSurvivalCard(
    cards : Map.Map<Types.ClanContentId, Types.SurvivalCard>,
    callerRank : Nat,
    id : Types.ClanContentId,
  ) : Result.Result<Types.SurvivalCard, Types.ClanError> {
    switch (cards.get(id)) {
      case (?card) {
        if (isEntitled(callerRank, card.minPlanRank)) {
          #ok(card);
        } else {
          #err(notEntitled(card.minPlanRank));
        };
      };
      case null { #err(#unknownContent(id)) };
    };
  };

  public func listCourses(
    courses : Map.Map<Types.CourseId, Types.Course>,
    callerRank : Nat,
  ) : [Types.Course] {
    let visible = courses.values().filter(func(course) = isEntitled(callerRank, course.minPlanRank)).toArray();
    sortedByTitle(visible, func(course) = course.title);
  };

  public func getCourse(
    courses : Map.Map<Types.CourseId, Types.Course>,
    callerRank : Nat,
    id : Types.CourseId,
  ) : Result.Result<Types.Course, Types.ClanError> {
    switch (courses.get(id)) {
      case (?course) {
        if (isEntitled(callerRank, course.minPlanRank)) {
          #ok(course);
        } else {
          #err(notEntitled(course.minPlanRank));
        };
      };
      case null { #err(#unknownContent(id)) };
    };
  };

  public func listTrainings(
    trainings : Map.Map<Types.TrainingId, Types.Training>,
    callerRank : Nat,
  ) : [Types.Training] {
    let visible = trainings.values().filter(func(training) = isEntitled(callerRank, training.minPlanRank)).toArray();
    sortedByTitle(visible, func(training) = training.title);
  };

  public func listPosts(
    posts : Map.Map<Types.PostId, Types.CommunityPost>,
    callerRank : Nat,
  ) : [Types.CommunityPost] {
    if (not isEntitled(callerRank, communityMinRank)) {
      return [];
    };
    let visible = posts.values().filter(func(post) = isEntitled(callerRank, post.minPlanRank)).toArray();
    visible.sort(func(a, b) = Int.compare(b.createdAt, a.createdAt));
  };

  public func createPost(
    posts : Map.Map<Types.PostId, Types.CommunityPost>,
    postCounter : { var value : Nat },
    members : Map.Map<Principal, Types.Member>,
    callerRank : Nat,
    caller : Principal,
    title : Text,
    body : Text,
  ) : Result.Result<Types.CommunityPost, Types.ClanError> {
    if (not isEntitled(callerRank, communityMinRank)) {
      return #err(notEntitled(communityMinRank));
    };
    let member = switch (members.get(caller)) {
      case (?m) { m };
      case null { return #err(#notRegistered) };
    };
    let trimmedTitle = title.trim(#predicate(func(c) = c == ' '));
    let trimmedBody = body.trim(#predicate(func(c) = c == ' '));
    if (trimmedTitle.size() == 0 or trimmedBody.size() == 0) {
      return #err(#invalidInput);
    };
    let id = postCounter.value;
    postCounter.value := id + 1;
    let post : Types.CommunityPost = {
      id;
      author = caller;
      authorCode = member.code;
      title = trimmedTitle;
      body = trimmedBody;
      createdAt = Time.now();
      minPlanRank = communityMinRank;
    };
    posts.add(id, post);
    #ok(post);
  };

  public func listEmergencyPlans(
    plans : Map.Map<Types.EmergencyPlanId, Types.EmergencyPlan>,
    caller : Principal,
  ) : [Types.EmergencyPlan] {
    let mine = plans.values().filter(func(plan) = Principal.equal(plan.member, caller)).toArray();
    mine.sort(func(a, b) = Int.compare(b.createdAt, a.createdAt));
  };

  public func createEmergencyPlan(
    plans : Map.Map<Types.EmergencyPlanId, Types.EmergencyPlan>,
    planCounter : { var value : Nat },
    members : Map.Map<Principal, Types.Member>,
    callerRank : Nat,
    caller : Principal,
    title : Text,
    steps : [Types.EmergencyStep],
  ) : Result.Result<Types.EmergencyPlan, Types.ClanError> {
    if (not isEntitled(callerRank, guardianMinRank)) {
      return #err(notEntitled(guardianMinRank));
    };
    switch (members.get(caller)) {
      case null { return #err(#notRegistered) };
      case (?_) {};
    };
    let trimmedTitle = title.trim(#predicate(func(c) = c == ' '));
    if (trimmedTitle.size() == 0 or steps.size() == 0) {
      return #err(#invalidInput);
    };
    let id = planCounter.value;
    planCounter.value := id + 1;
    let plan : Types.EmergencyPlan = {
      id;
      member = caller;
      title = trimmedTitle;
      steps;
      createdAt = Time.now();
      minPlanRank = callerRank;
    };
    plans.add(id, plan);
    #ok(plan);
  };

  public func listKits(
    kits : Map.Map<Types.KitId, Types.MemberKit>,
    caller : Principal,
  ) : [Types.MemberKit] {
    let mine = kits.values().filter(func(kit) = Principal.equal(kit.member, caller)).toArray();
    sortedByTitle(mine, func(kit) = kit.name);
  };

  func readinessOf(items : [Types.KitItem]) : Types.KitReadiness {
    if (items.size() == 0) {
      return #critico;
    };
    let readyCount = items.filter(func(item) = item.ready).size();
    if (readyCount == items.size()) {
      #pronto;
    } else if (readyCount == 0) {
      #critico;
    } else {
      #incompleto;
    };
  };

  public func createKit(
    kits : Map.Map<Types.KitId, Types.MemberKit>,
    kitCounter : { var value : Nat },
    members : Map.Map<Principal, Types.Member>,
    callerRank : Nat,
    caller : Principal,
    name : Text,
    items : [Types.KitItem],
  ) : Result.Result<Types.MemberKit, Types.ClanError> {
    if (not isEntitled(callerRank, guardianMinRank)) {
      return #err(notEntitled(guardianMinRank));
    };
    switch (members.get(caller)) {
      case null { return #err(#notRegistered) };
      case (?_) {};
    };
    let trimmedName = name.trim(#predicate(func(c) = c == ' '));
    if (trimmedName.size() == 0) {
      return #err(#invalidInput);
    };
    let id = kitCounter.value;
    kitCounter.value := id + 1;
    let kit : Types.MemberKit = {
      id;
      member = caller;
      name = trimmedName;
      items;
      readiness = readinessOf(items);
      minPlanRank = callerRank;
    };
    kits.add(id, kit);
    #ok(kit);
  };
};
