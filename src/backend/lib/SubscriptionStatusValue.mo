import OQL "mo:caffeineai-oql";
import Types "../types";

module {
  // Situação da assinatura -> identificador textual.
  public func _toRow(self : Types.SubscriptionStatus) : OQL.Value {
    #text(
      switch (self) {
        case (#active) { "active" };
        case (#pending) { "pending" };
        case (#cancelled) { "cancelled" };
      }
    );
  };
};
