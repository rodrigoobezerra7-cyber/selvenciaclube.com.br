import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Types "../types";
import ClanLib "../lib/clan";
import MembershipLib "../lib/membership";

mixin (
  survivalCards : Map.Map<Types.ClanContentId, Types.SurvivalCard>,
  courses : Map.Map<Types.CourseId, Types.Course>,
  trainings : Map.Map<Types.TrainingId, Types.Training>,
  posts : Map.Map<Types.PostId, Types.CommunityPost>,
  postCounter : { var value : Nat },
  emergencyPlans : Map.Map<Types.EmergencyPlanId, Types.EmergencyPlan>,
  planCounter : { var value : Nat },
  kits : Map.Map<Types.KitId, Types.MemberKit>,
  kitCounter : { var value : Nat },
  subscriptions : Map.Map<Principal, Types.Subscription>,
  plans : Map.Map<Types.PlanId, Types.Plan>,
  members : Map.Map<Principal, Types.Member>,
) {
  public query ({ caller }) func listSurvivalCards() : async [Types.SurvivalCard] {
    ClanLib.listSurvivalCards(survivalCards, MembershipLib.planRankOf(subscriptions, plans, caller));
  };

  public query ({ caller }) func getSurvivalCard(id : Types.ClanContentId) : async Result.Result<Types.SurvivalCard, Types.ClanError> {
    ClanLib.getSurvivalCard(survivalCards, MembershipLib.planRankOf(subscriptions, plans, caller), id);
  };

  public query ({ caller }) func listCourses() : async [Types.Course] {
    ClanLib.listCourses(courses, MembershipLib.planRankOf(subscriptions, plans, caller));
  };

  public query ({ caller }) func getCourse(id : Types.CourseId) : async Result.Result<Types.Course, Types.ClanError> {
    ClanLib.getCourse(courses, MembershipLib.planRankOf(subscriptions, plans, caller), id);
  };

  public query ({ caller }) func listTrainings() : async [Types.Training] {
    ClanLib.listTrainings(trainings, MembershipLib.planRankOf(subscriptions, plans, caller));
  };

  public query ({ caller }) func listCommunityPosts() : async [Types.CommunityPost] {
    ClanLib.listPosts(posts, MembershipLib.planRankOf(subscriptions, plans, caller));
  };

  public shared ({ caller }) func createCommunityPost(title : Text, body : Text) : async Result.Result<Types.CommunityPost, Types.ClanError> {
    ClanLib.createPost(posts, postCounter, members, MembershipLib.planRankOf(subscriptions, plans, caller), caller, title, body);
  };

  public query ({ caller }) func listMyEmergencyPlans() : async [Types.EmergencyPlan] {
    ClanLib.listEmergencyPlans(emergencyPlans, caller);
  };

  public shared ({ caller }) func createEmergencyPlan(title : Text, steps : [Types.EmergencyStep]) : async Result.Result<Types.EmergencyPlan, Types.ClanError> {
    ClanLib.createEmergencyPlan(emergencyPlans, planCounter, members, MembershipLib.planRankOf(subscriptions, plans, caller), caller, title, steps);
  };

  public query ({ caller }) func listMyKits() : async [Types.MemberKit] {
    ClanLib.listKits(kits, caller);
  };

  public shared ({ caller }) func createKit(name : Text, items : [Types.KitItem]) : async Result.Result<Types.MemberKit, Types.ClanError> {
    ClanLib.createKit(kits, kitCounter, members, MembershipLib.planRankOf(subscriptions, plans, caller), caller, name, items);
  };
};
