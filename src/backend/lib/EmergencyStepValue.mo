import OQL "mo:caffeineai-oql";
import Types "../types";

module {
  // Passo de um plano de emergência -> linha OQL.
  public func _toRow(self : Types.EmergencyStep) : OQL.Value {
    #text(self.order.toText() # ". " # self.instruction);
  };
};
