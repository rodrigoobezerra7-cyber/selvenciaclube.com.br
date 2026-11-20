import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Time "mo:core/Time";
import Types "../types";

module {
  public func placeOrder(
    orders : Map.Map<Nat, Types.Order>,
    orderCounter : { var value : Nat },
    members : Map.Map<Principal, Types.Member>,
    products : Map.Map<Nat, Types.Product>,
    caller : Principal,
    productId : Nat,
    quantity : Nat,
  ) : Result.Result<Types.Order, Types.OrderError> {
    if (members.get(caller) == null) {
      return #err(#notRegistered);
    };
    if (quantity == 0) {
      return #err(#invalidQuantity);
    };
    let product = switch (products.get(productId)) {
      case (?p) { p };
      case null { return #err(#unknownProduct(productId)) };
    };
    if (not product.available) {
      return #err(#unavailable(productId));
    };
    let id = orderCounter.value;
    orderCounter.value := id + 1;
    let order : Types.Order = {
      id;
      member = caller;
      productId;
      quantity;
      unitPriceCents = product.priceCents;
      createdAt = Time.now();
    };
    orders.add(id, order);
    #ok(order);
  };
};
