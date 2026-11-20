import Map "mo:core/Map";
import Types "../types";

mixin (cards : Map.Map<Nat, Types.KnowledgeCard>) {
  public query func listKnowledge() : async [Types.KnowledgeCard] {
    cards.values().toArray();
  };

  public query func getKnowledge(id : Nat) : async ?Types.KnowledgeCard {
    cards.get(id);
  };
};
