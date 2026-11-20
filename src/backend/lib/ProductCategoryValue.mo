import OQL "mo:caffeineai-oql";
import Types "../types";

module {
  public func _toRow(self : Types.ProductCategory) : OQL.Value {
    #text(
      switch (self) {
        case (#lanternas) { "lanternas" };
        case (#facas) { "facas" };
        case (#binoculos) { "binoculos" };
        case (#camisetas) { "camisetas" };
      }
    );
  };
};
