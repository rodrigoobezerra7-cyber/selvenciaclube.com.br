import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Types "../types";
import OrdersLib "../lib/orders";

mixin (
  orders : Map.Map<Nat, Types.Order>,
  orderCounter : { var value : Nat },
  members : Map.Map<Principal, Types.Member>,
  products : Map.Map<Nat, Types.Product>,
) {
  public shared ({ caller }) func placeOrder(productId : Nat, quantity : Nat) : async Result.Result<Types.Order, Types.OrderError> {
    OrdersLib.placeOrder(orders, orderCounter, members, products, caller, productId, quantity);
  };
};
