import OQL "mo:caffeineai-oql";
import Types "../types";

module {
  // Situação de prontidão de um kit -> identificador textual.
  public func _toRow(self : Types.KitReadiness) : OQL.Value {
    #text(
      switch (self) {
        case (#pronto) { "pronto" };
        case (#incompleto) { "incompleto" };
        case (#critico) { "critico" };
      }
    );
  };
};
