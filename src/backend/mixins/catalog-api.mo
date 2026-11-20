import Map "mo:core/Map";
import Types "../types";
import CatalogLib "../lib/catalog";

mixin (products : Map.Map<Nat, Types.Product>) {
  public query func listProducts() : async [Types.Product] {
    CatalogLib.listProducts(products);
  };

  public query func listCategories() : async [Types.CategoryInfo] {
    CatalogLib.listCategories(products);
  };

  public query func getProduct(id : Nat) : async ?Types.Product {
    CatalogLib.getProduct(products, id);
  };
};
