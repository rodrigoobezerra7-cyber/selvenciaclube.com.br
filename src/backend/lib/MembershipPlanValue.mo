import OQL "mo:caffeineai-oql";
import Types "../types";

module {
  // Plano de assinatura do clã -> identificador textual do plano.
  public func _toRow(self : Types.Plan) : OQL.Value {
    #text(self.name);
  };
};
