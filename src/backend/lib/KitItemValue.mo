import OQL "mo:caffeineai-oql";
import Types "../types";

module {
  // Item de um kit -> linha OQL.
  public func _toRow(self : Types.KitItem) : OQL.Value {
    #text(self.name # " x" # self.quantity.toText() # (if (self.ready) { " (pronto)" } else { " (pendente)" }));
  };
};
