import OQL "mo:caffeineai-oql";
import Types "../types";

module {
  public func _toRow(self : Types.KnowledgeCategory) : OQL.Value {
    #text(
      switch (self) {
        case (#checklists) { "checklists" };
        case (#validade) { "validade" };
        case (#manutencao) { "manutencao" };
        case (#tecnicas) { "tecnicas" };
      }
    );
  };
};
