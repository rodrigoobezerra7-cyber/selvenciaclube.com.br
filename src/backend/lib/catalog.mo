import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Types "../types";

module {
  public func captionOf(category : Types.ProductCategory) : Text {
    switch (category) {
      case (#lanternas) { "Lanternas" };
      case (#facas) { "Facas" };
      case (#binoculos) { "Binóculos" };
      case (#camisetas) { "Camisetas" };
    };
  };

  public func allCategories() : [Types.ProductCategory] {
    [#lanternas, #facas, #binoculos, #camisetas];
  };

  public func listProducts(products : Map.Map<Nat, Types.Product>) : [Types.Product] {
    products.values().toArray();
  };

  public func getProduct(products : Map.Map<Nat, Types.Product>, id : Nat) : ?Types.Product {
    products.get(id);
  };

  public func listCategories(products : Map.Map<Nat, Types.Product>) : [Types.CategoryInfo] {
    let all = products.values().toArray();
    allCategories().map(
      func (category) {
        let count = all.filter(func (p) = p.category == category).size();
        { category; caption = captionOf(category); count };
      }
    );
  };

  public func seed(products : Map.Map<Nat, Types.Product>) {
    for (product in seedData().values()) {
      products.add(product.id, product);
    };
  };

  func seedData() : [Types.Product] {
    [
      {
        id = 0;
        name = "Lanterna Tática Selvência L-1";
        category = #lanternas;
        priceCents = 18990;
        description = "Lanterna de alumínio aeronáutico com 1200 lúmens, cinco modos de iluminação e resistência à água IPX6. Bateria recarregável por USB-C com até 18 horas de autonomia no modo econômico.";
        imageUrl = "https://images.pexels.com/photos/1098460/pexels-photo-1098460.jpeg?auto=compress&cs=tinysrgb&w=800";
        available = true;
      },
      {
        id = 1;
        name = "Lanterna de Cabeça Operador";
        category = #lanternas;
        priceCents = 12450;
        description = "Lanterna de cabeça com faixa ajustável e luz vermelha para preservar a visão noturna. Ideal para patrulhas, acampamentos e manutenção em campo.";
        imageUrl = "https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=800";
        available = true;
      },
      {
        id = 2;
        name = "Lanterna de Sinalização Estroboscópica";
        category = #lanternas;
        priceCents = 8990;
        description = "Sinalizador compacto com modo estroboscópico de alta visibilidade e base magnética. Visível a mais de dois quilômetros em condições de baixa luminosidade.";
        imageUrl = "https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=800";
        available = false;
      },
      {
        id = 3;
        name = "Faca de Campo Selvência K-7";
        category = #facas;
        priceCents = 34900;
        description = "Faca de lâmina fixa em aço inox 440C com cabo em micarta e bainha de couro. Comprimento total de 24 cm, projetada para corte, entalhe e trabalhos de campo.";
        imageUrl = "https://images.pexels.com/photos/207962/pexels-photo-207962.jpeg?auto=compress&cs=tinysrgb&w=800";
        available = true;
      },
      {
        id = 4;
        name = "Canivete Multifunção 12 em 1";
        category = #facas;
        priceCents = 15900;
        description = "Canivete dobrável com doze ferramentas integradas, trava de segurança e aço inoxidável. Compacto o bastante para o bolso do kit de emergência.";
        imageUrl = "https://images.pexels.com/photos/6764031/pexels-photo-6764031.jpeg?auto=compress&cs=tinysrgb&w=800";
        available = true;
      },
      {
        id = 5;
        name = "Faca de Sobrevivência com Pedra de Fogo";
        category = #facas;
        priceCents = 27900;
        description = "Faca de sobrevivência com dorso serrilhado, pedra de fogo integrada e cabo oco para armazenamento de linha e anzóis. Acompanha bainha tática.";
        imageUrl = "https://images.pexels.com/photos/1207918/pexels-photo-1207918.jpeg?auto=compress&cs=tinysrgb&w=800";
        available = true;
      },
      {
        id = 6;
        name = "Binóculo de Observação 10x42";
        category = #binoculos;
        priceCents = 78900;
        description = "Binóculo com aumento de 10x e lentes de 42 mm com tratamento antirreflexo multicamada. Corpo à prova de água e nitrogênio, ideal para vigilância e reconhecimento de terreno.";
        imageUrl = "https://images.pexels.com/photos/123335/pexels-photo-123335.jpeg?auto=compress&cs=tinysrgb&w=800";
        available = true;
      },
      {
        id = 7;
        name = "Binóculo Compacto de Bolso 8x21";
        category = #binoculos;
        priceCents = 24900;
        description = "Binóculo dobrável e leve, com 8x de aumento e bolsa de transporte. Perfeito para caminhadas de reconhecimento e observação rápida.";
        imageUrl = "https://images.pexels.com/photos/274973/pexels-photo-274973.jpeg?auto=compress&cs=tinysrgb&w=800";
        available = true;
      },
      {
        id = 8;
        name = "Monóculo Tático com Retículo";
        category = #binoculos;
        priceCents = 45900;
        description = "Monóculo de aumento 12x com retículo milimétrico para estimativa de distância. Montagem em tripé e bolsa rígida inclusas.";
        imageUrl = "https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=800";
        available = false;
      },
      {
        id = 9;
        name = "Camiseta Selvência Operações";
        category = #camisetas;
        priceCents = 8900;
        description = "Camiseta de algodão penteado com estampa discreta da Central de Operações SELVÊNCIA. Corte tático, costura reforçada e tecido respirável.";
        imageUrl = "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=800";
        available = true;
      },
      {
        id = 10;
        name = "Camiseta Manga Longa Campo Frio";
        category = #camisetas;
        priceCents = 11900;
        description = "Manga longa em malha de gramatura média, pensada para camadas em operações noturnas. Punhos elásticos e gola reforçada.";
        imageUrl = "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800";
        available = true;
      },
      {
        id = 11;
        name = "Camiseta Dry-Fit Preparação";
        category = #camisetas;
        priceCents = 9900;
        description = "Camiseta de secagem rápida com proteção UV, para treinos de preparação física e atividades ao ar livre. Estampa do pilar Preparação.";
        imageUrl = "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800";
        available = true;
      },
    ];
  };
};
