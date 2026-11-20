import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";

// SELVÊNCIA domain migration: replaces the retired salon state with the member,
// catalogue, knowledge and order collections, seeded with the Arsenal SELVÊNCIA
// catalogue and the knowledge library. The salon fields are consumed in
// OldActor and intentionally discarded.
module {
  type DayHours = { days : Text; hours : Text };
  type BusinessInfo = {
    name : Text;
    tagline : Text;
    phone : Text;
    email : Text;
    address : Text;
    openingHours : [DayHours];
  };
  type Service = { id : Nat; name : Text; description : Text; price : Text; duration : Text };
  type TeamMember = { id : Nat; name : Text; role : Text; bio : Text; photo : Text };
  type Testimonial = { id : Nat; author : Text; quote : Text };
  type GalleryImage = { id : Nat; url : Text; caption : Text };
  type BookingRequest = {
    id : Nat;
    name : Text;
    contact : Text;
    service : Text;
    preferredTime : Text;
    message : Text;
    createdAt : Int;
    handled : Bool;
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    businessInfo : BusinessInfo;
    services : [Service];
    team : [TeamMember];
    testimonials : [Testimonial];
    gallery : [GalleryImage];
    bookingRequests : Map.Map<Nat, BookingRequest>;
    var nextRequestId : Nat;
  };

  type ProductCategory = { #lanternas; #facas; #binoculos; #camisetas };
  type KnowledgeCategory = { #checklists; #validade; #manutencao; #tecnicas };

  type Member = { id : Principal; code : Text; email : ?Text; registeredAt : Int };
  type Product = {
    id : Nat;
    name : Text;
    category : ProductCategory;
    priceCents : Nat;
    description : Text;
    imageUrl : Text;
    available : Bool;
  };
  type KnowledgeCard = {
    id : Nat;
    title : Text;
    category : KnowledgeCategory;
    summary : Text;
    content : Text;
  };
  type Order = {
    id : Nat;
    member : Principal;
    productId : Nat;
    quantity : Nat;
    unitPriceCents : Nat;
    createdAt : Int;
  };

  type RecoveryRequest = { code : Text; expiresAt : Int; attempts : Nat };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    members : Map.Map<Principal, Member>;
    recoveries : Map.Map<Principal, RecoveryRequest>;
    products : Map.Map<Nat, Product>;
    knowledge : Map.Map<Nat, KnowledgeCard>;
    orders : Map.Map<Nat, Order>;
    orderCounter : { var value : Nat };
  };

  func seedProducts() : [Product] {
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

  func seedKnowledge() : [KnowledgeCard] {
    [
      {
        id = 0;
        title = "Checklist do Kit de 72 horas";
        category = #checklists;
        summary = "O que precisa estar na mochila de evacuação para três dias de autonomia.";
        content = "O kit de 72 horas é a base da preparação doméstica. Ele deve permitir que cada membro da família sobreviva de forma autônoma por três dias, sem depender de água, energia ou abastecimento externo.\n\nÁgua e alimentação: três litros de água por pessoa por dia, alimentos não perecíveis de preparo simples, e um meio de purificar água adicional (pastilhas ou filtro).\n\nAbrigo e calor: cobertor térmico, saco de dormir compacto, isqueiro e acendedor de fogo, além de uma lona leve.\n\nSaúde e higiene: kit de primeiros socorros, medicamentos de uso contínuo, sabonete, escova de dentes e papel higiênico.\n\nFerramentas e comunicação: canivete multifunção, lanterna de cabeça com pilhas sobressalentes, rádio a manivela, apito e cópia física de documentos importantes.\n\nRevise o kit a cada seis meses, substituindo alimentos vencidos e conferindo pilhas e medicamentos.";
      },
      {
        id = 1;
        title = "Checklist do Kit de Primeiros Socorros";
        category = #checklists;
        summary = "Itens essenciais para atendimento imediato em campo.";
        content = "Um kit de primeiros socorros bem montado reduz o impacto de ferimentos comuns em atividades de campo e em situações de emergência.\n\nCurativos e bandagens: gazes estéreis, ataduras elásticas, esparadrapo, curativos adesivos de vários tamanhos e uma bandagem triangular.\n\nInstrumentos: tesoura de ponta arredondada, pinça, luvas descartáveis e termômetro.\n\nAntissépticos e medicamentos: solução antisséptica, soro fisiológico para limpeza, analgésico, antitérmico e antialérgico de uso comum.\n\nDocumentação: uma ficha com alergias, tipo sanguíneo e contatos de emergência de cada membro do grupo.\n\nMantenha o kit em local seco, verifique os prazos de validade a cada três meses e faça um treinamento básico de primeiros socorros com todos os membros da equipe.";
      },
      {
        id = 2;
        title = "Validade dos Alimentos de Emergência";
        category = #validade;
        summary = "Como armazenar e rotacionar a reserva de alimentos para não perder nada.";
        content = "A reserva de alimentos de emergência só é útil se estiver dentro do prazo de validade. A regra de ouro é a rotação: o que entra primeiro deve sair primeiro.\n\nOrganize a despensa de emergência separada do consumo diário e etiquete cada item com a data de validade. A cada seis meses, revise a reserva e consuma os itens que vencem nos próximos meses, repondo em seguida.\n\nAlimentos enlatados duram de dois a cinco anos. Grãos secos, como arroz e feijão, duram cerca de dois anos em recipientes herméticos. Barras de cereal e alimentos liofilizados têm validade menor e devem ser priorizados na rotação.\n\nArmazene em local fresco, seco e ao abrigo da luz. Evite garagens úmidas e locais próximos a fontes de calor.\n\nRegistre tudo em uma planilha ou caderno: item, quantidade, data de validade e data da última revisão. Esse controle evita desperdício e garante que a reserva esteja sempre pronta.";
      },
      {
        id = 3;
        title = "Validade dos Medicamentos do Kit";
        category = #validade;
        summary = "Por que revisar os medicamentos periodicamente é parte da preparação.";
        content = "Medicamentos vencidos perdem eficácia e, em alguns casos, podem se tornar prejudiciais. Por isso, a revisão periódica do kit de saúde é tão importante quanto a dos alimentos.\n\nEstabeleça uma data fixa no calendário, a cada três meses, para conferir todos os medicamentos do kit. Descarte os vencidos em pontos de coleta apropriados e reponha os itens usados.\n\nMedicamentos de uso contínuo exigem atenção especial: mantenha sempre uma reserva de pelo menos sete dias e uma cópia da receita médica junto ao kit.\n\nAnote em cada caixa a data de validade visível e mantenha os medicamentos longe da umidade e do calor. Não guarde comprimidos soltos em saquinhos sem identificação.\n\nEm caso de dúvida sobre a validade ou a conservação, substitua o item. A segurança do grupo vale mais do que a economia de um medicamento.";
      },
      {
        id = 4;
        title = "Manutenção da Lanterna Tática";
        category = #manutencao;
        summary = "Cuidados que mantêm a lanterna confiável em qualquer situação.";
        content = "A lanterna é um dos equipamentos mais críticos do kit. Uma falha no momento errado pode comprometer toda a operação.\n\nApós cada uso, limpe a lente com pano macio e verifique os anéis de vedação. Poeira e areia acumuladas comprometem a resistência à água.\n\nSe a lanterna usa bateria recarregável, mantenha a carga entre 40% e 80% durante o armazenamento prolongado. Baterias de lítio não devem ser guardadas totalmente descarregadas nem totalmente carregadas por longos períodos.\n\nTeste a lanterna uma vez por mês em todos os modos de iluminação. Substitua pilhas antes que se esgotem e guarde um conjunto sobressalente junto ao equipamento.\n\nAplique uma gota de lubrificante nas roscas da tampa a cada seis meses. Nunca use óleo de cozinha, que atrai sujeira e resseca as vedações.";
      },
      {
        id = 5;
        title = "Manutenção de Facas e Canivetes";
        category = #manutencao;
        summary = "Afiação, limpeza e conservação para manter o fio sempre pronto.";
        content = "Uma faca sem fio é mais perigosa do que uma faca afiada, porque exige mais força e escorrega com facilidade. A manutenção regular é parte do uso responsável.\n\nLimpe a lâmina após cada uso com pano úmido e seque imediatamente. Evite deixar a faca molhada ou guardada dentro da bainha úmida, o que provoca corrosão.\n\nAfie a lâmina com pedra de amolar ou chaira a cada uso intenso. Mantenha um ângulo constante e passe a lâmina em movimentos firmes e uniformes.\n\nAplique uma camada fina de óleo próprio para cutelaria na lâmina antes de guardar. Nas partes móveis do canivete, use algumas gotas de lubrificante e abra e feche a ferramenta para distribuir.\n\nNunca use a faca como chave de fenda ou alavanca. O uso indevido danifica a ponta e compromete a estrutura do cabo.";
      },
      {
        id = 6;
        title = "Manutenção de Binóculos";
        category = #manutencao;
        summary = "Como limpar e guardar óptica de precisão sem danificar as lentes.";
        content = "Binóculos são instrumentos ópticos delicados. Um cuidado simples prolonga a vida útil e mantém a nitidez da imagem.\n\nLimpe as lentes apenas com pano de microfibra e solução própria para óptica. Nunca use papel, camiseta ou álcool comum, que riscam o tratamento antirreflexo.\n\nRemova primeiro a poeira com um pincel de ar ou sopro suave. Depois, faça movimentos circulares leves com a microfibra, do centro para as bordas.\n\nGuarde os binóculos na bolsa de transporte, com as tampas de proteção colocadas. Evite exposição prolongada ao sol dentro de veículos, pois o calor pode descolar os prismas.\n\nSe o equipamento for à prova de água, verifique periodicamente as vedações. Em caso de embaçamento interno, procure assistência especializada em vez de abrir o aparelho.";
      },
      {
        id = 7;
        title = "Técnica de Orientação sem GPS";
        category = #tecnicas;
        summary = "Navegar com bússola, mapa e pontos de referência quando a tecnologia falha.";
        content = "Depender apenas do GPS é um risco em qualquer operação de campo. Saber se orientar com ferramentas simples é uma habilidade fundamental.\n\nAntes de sair, estude o mapa da região e marque pontos de referência: rios, estradas, elevações e construções. Anote o rumo inicial e a distância estimada até o destino.\n\nUse a bússola para manter o rumo e confira periodicamente com o mapa. Ajuste a declinação magnética da sua região para não acumular erro ao longo do percurso.\n\nSem bússola, o sol e as estrelas servem de referência. O sol nasce a leste e se põe a oeste; no hemisfério sul, o Cruzeiro do Sul aponta para o sul.\n\nMarque o caminho percorrido com sinais discretos e memorize marcos naturais. Em caso de perda de rumo, pare, respire e retorne ao último ponto conhecido em vez de continuar às cegas.";
      },
      {
        id = 8;
        title = "Técnica de Purificação de Água";
        category = #tecnicas;
        summary = "Métodos seguros para tornar água de campo potável.";
        content = "Água contaminada é uma das principais causas de adoecimento em situações de emergência. Purificar antes de beber é uma regra que não se negocia.\n\nA fervura é o método mais confiável: leve a água a ebulição por pelo menos um minuto. Em altitudes acima de dois mil metros, prolongue para três minutos.\n\nFiltros portáteis removem partículas e muitos microrganismos, mas nem todos eliminam vírus. Combine o filtro com pastilhas de cloro ou fervura quando a fonte for duvidosa.\n\nPastilhas de cloro são leves e práticas para o kit. Siga a dosagem do fabricante e aguarde o tempo de contato indicado antes de consumir.\n\nSempre que possível, colete água de fontes correntes e claras, evitando água parada. Coe com pano limpo antes de purificar para melhorar a eficácia do tratamento.";
      },
      {
        id = 9;
        title = "Técnica de Abrigo de Emergência";
        category = #tecnicas;
        summary = "Como construir proteção contra frio, chuva e vento com poucos recursos.";
        content = "O abrigo é a primeira prioridade em qualquer situação de sobrevivência ao ar livre. Proteger-se do vento e da umidade evita a hipotermia, que mata mais rápido do que a fome ou a sede.\n\nEscolha um local elevado, longe de leitos de rio e de encostas sujeitas a deslizamento. Procure proteção natural contra o vento, como rochas, árvores ou elevações do terreno.\n\nCom uma lona, monte um telhado inclinado e fixe as pontas com cordas e estacas. A inclinação deve escoar a água para longe da área de dormir.\n\nSem lona, use galhos, folhas e capim para criar uma camada isolante do chão. O contato direto com o solo frio drena o calor do corpo rapidamente.\n\nIsole o chão com folhas secas e mantenha uma abertura de ventilação. Nunca acenda fogo dentro de abrigos fechados: o monóxido de carbono é inodoro e letal.";
      },
    ];
  };

  public func migration(old : OldActor) : NewActor {
    ignore (old.businessInfo, old.services, old.team, old.testimonials);
    ignore (old.gallery, old.bookingRequests, old.nextRequestId);

    let products = Map.empty<Nat, Product>();
    for (product in seedProducts().values()) {
      products.add(product.id, product);
    };

    let knowledge = Map.empty<Nat, KnowledgeCard>();
    for (card in seedKnowledge().values()) {
      knowledge.add(card.id, card);
    };

    {
      accessControlState = old.accessControlState;
      members = Map.empty();
      recoveries = Map.empty();
      products;
      knowledge;
      orders = Map.empty();
      orderCounter = { var value = 0 };
    };
  };
};
