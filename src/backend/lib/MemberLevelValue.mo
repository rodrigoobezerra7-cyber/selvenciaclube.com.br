import OQL "mo:caffeineai-oql";
import Types "../types";

module {
  // Nível de membro -> nome do nível.
  public func _toRow(self : Types.MemberLevel) : OQL.Value {
    #text(self.name);
  };
};
