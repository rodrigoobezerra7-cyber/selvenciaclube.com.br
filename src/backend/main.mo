import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import MapEntity "mo:caffeineai-oql/MapEntity";
import Entity "mo:caffeineai-oql/Entity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import PrincipalValue "mo:caffeineai-oql/PrincipalValue";
import ProductCategoryValue "lib/ProductCategoryValue";
import KnowledgeCategoryValue "lib/KnowledgeCategoryValue";
import SubscriptionStatusValue "lib/SubscriptionStatusValue";
import Types "types";
import MembersLib "lib/members";
import MembersMixin "mixins/members-api";
import CatalogMixin "mixins/catalog-api";
import KnowledgeMixin "mixins/knowledge-api";
import OrdersMixin "mixins/orders-api";
import MembershipMixin "mixins/membership-api";
import ClanMixin "mixins/clan-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;

  let members : Map.Map<Principal, Types.Member>;
  let recoveries : Map.Map<Principal, Types.RecoveryRequest>;
  let products : Map.Map<Nat, Types.Product>;
  let knowledge : Map.Map<Nat, Types.KnowledgeCard>;
  let orders : Map.Map<Nat, Types.Order>;
  let orderCounter : { var value : Nat };

  // Clã Selvência: assinaturas, níveis e conteúdos exclusivos.
  let subscriptions : Map.Map<Principal, Types.Subscription>;
  let plans : Map.Map<Types.PlanId, Types.Plan>;
  let levels : Map.Map<Nat, Types.MemberLevel>;
  let points : Map.Map<Principal, Nat>;
  let survivalCards : Map.Map<Types.ClanContentId, Types.SurvivalCard>;
  let courses : Map.Map<Types.CourseId, Types.Course>;
  let trainings : Map.Map<Types.TrainingId, Types.Training>;
  let posts : Map.Map<Types.PostId, Types.CommunityPost>;
  let postCounter : { var value : Nat };
  let emergencyPlans : Map.Map<Types.EmergencyPlanId, Types.EmergencyPlan>;
  let planCounter : { var value : Nat };
  let kits : Map.Map<Types.KitId, Types.MemberKit>;
  let kitCounter : { var value : Nat };

  // Verified email from the signed-in identity reaches the member profile.
  include MixinAuthorization(
    accessControlState,
    ?(func(caller : Principal, attributes : { name : ?Text; email : ?Text; sso : ?Text }) {
      switch (attributes.email) {
        case (?email) { MembersLib.setVerifiedEmail(members, caller, email) };
        case null {};
      };
    }),
  );

  include MembersMixin(members, recoveries);
  include CatalogMixin(products);
  include KnowledgeMixin(knowledge);
  include OrdersMixin(orders, orderCounter, members, products);
  include MembershipMixin(subscriptions, plans, levels, points, members);
  include ClanMixin(
    survivalCards,
    courses,
    trainings,
    posts,
    postCounter,
    emergencyPlans,
    planCounter,
    kits,
    kitCounter,
    subscriptions,
    plans,
    members,
  );

  transient let samplePrincipal = Principal.fromText("aaaaa-aa");

  include Expose({
    entities = [
      products.toEntity("product", "Product", "id")
        .sample({
          id = 0;
          name = "";
          category = #lanternas;
          priceCents = 0;
          description = "";
          imageUrl = "";
          available = true;
        })
        .public_()
        .build(),
      knowledge.toEntity("knowledgeCard", "KnowledgeCard", "id")
        .sample({
          id = 0;
          title = "";
          category = #checklists;
          summary = "";
          content = "";
        })
        .public_()
        .build(),
      orders.toEntity("order", "Order", "id")
        .sample({
          id = 0;
          member = samplePrincipal;
          productId = 0;
          quantity = 1;
          unitPriceCents = 0;
          createdAt = 0;
        })
        .ownedBy("member")
        .controllerOrScoped()
        .build(),
      // ===== Clã Selvência =====
      // Catálogo de planos: público.
      plans.toEntity("plan", "Plan", "id")
        .sample({
          id = 0;
          name = "";
          priceCents = 0;
          rank = 0;
          description = "";
        })
        .public_()
        .build(),
      // Níveis de membro: público.
      levels.toEntity("memberLevel", "MemberLevel", "ordinal")
        .sample({
          ordinal = 0;
          name = "";
          description = "";
          pointsRequired = 0;
        })
        .public_()
        .build(),
      // Assinaturas: cada membro lê a própria; o controlador lê todas.
      subscriptions.toEntity("subscription", "Subscription", "member")
        .sample({
          member = samplePrincipal;
          planId = 0;
          status = #active;
          startedAt = 0;
          renewsAt = 0;
          pendingPlan = ?0;
        })
        .ownedBy("member")
        .controllerOrScoped()
        .build(),
      // Biblioteca de sobrevivência do clã: conteúdo exclusivo, controlador lê tudo.
      survivalCards.toEntity("survivalCard", "SurvivalCard", "id")
        .sample({
          id = 0;
          title = "";
          summary = "";
          content = "";
          minPlanRank = 0;
        })
        .controllerOnly()
        .build(),
      // Cursos: conteúdo exclusivo do clã.
      courses.toEntityManual("course", "Course", "id")
        .sample({
          id = 0;
          title = "";
          summary = "";
          lessons = [{ title = ""; summary = ""; durationMinutes = 0 }];
          materials = [""];
          minPlanRank = 0;
        })
        .controllerOnly()
        .build(),
      // Treinamentos: conteúdo exclusivo do clã.
      trainings.toEntity("training", "Training", "id")
        .sample({
          id = 0;
          title = "";
          summary = "";
          content = "";
          minPlanRank = 0;
        })
        .controllerOnly()
        .build(),
      // Comunidade privada: posts do clã, controlador lê tudo.
      posts.toEntity("communityPost", "CommunityPost", "id")
        .sample({
          id = 0;
          author = samplePrincipal;
          authorCode = "";
          title = "";
          body = "";
          createdAt = 0;
          minPlanRank = 0;
        })
        .controllerOnly()
        .build(),
      // Planejamento de emergência: cada membro lê os próprios planos.
      emergencyPlans.toEntityManual("emergencyPlan", "EmergencyPlan", "id")
        .payload("member", func(plan) = plan.member)
        .sample({
          id = 0;
          member = samplePrincipal;
          title = "";
          steps = [{ order = 0; instruction = "" }];
          createdAt = 0;
          minPlanRank = 0;
        })
        .ownedBy("member")
        .controllerOrScoped()
        .build(),
      // Organização de kits: cada membro lê os próprios kits.
      kits.toEntityManual("kit", "MemberKit", "id")
        .payload("member", func(kit) = kit.member)
        .sample({
          id = 0;
          member = samplePrincipal;
          name = "";
          items = [{ name = ""; quantity = 0; ready = false }];
          readiness = #pronto;
          minPlanRank = 0;
        })
        .ownedBy("member")
        .controllerOrScoped()
        .build(),
    ];
  });

  include ApiDocMixin();
};
