import OQL "mo:caffeineai-oql";
import Types "../types";

module {
  // Aula de um curso -> linha OQL.
  public func _toRow(self : Types.Lesson) : OQL.Value {
    #text(self.title # " — " # self.summary # " (" # self.durationMinutes.toText() # " min)");
  };
};
