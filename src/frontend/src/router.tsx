import Layout from "@/components/Layout";
import RequireMember from "@/components/RequireMember";
import AcessoPage from "@/pages/AcessoPage";
import ArsenalPage from "@/pages/ArsenalPage";
import BemVindoPage from "@/pages/BemVindoPage";
import CentralPage from "@/pages/CentralPage";
import ClaBibliotecaPage from "@/pages/ClaBibliotecaPage";
import ClaComunidadePage from "@/pages/ClaComunidadePage";
import ClaCursosPage from "@/pages/ClaCursosPage";
import ClaKitsPage from "@/pages/ClaKitsPage";
import ClaPage from "@/pages/ClaPage";
import ConhecimentoPage from "@/pages/ConhecimentoPage";
import FichaConhecimentoPage from "@/pages/FichaConhecimentoPage";
import ProdutoPage from "@/pages/ProdutoPage";
import RecuperarSenhaPage from "@/pages/RecuperarSenhaPage";
import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: BemVindoPage,
});

const acessoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/acesso",
  validateSearch: (
    search: Record<string, unknown>,
  ): { modo?: "criar" | "entrar" } => ({
    modo:
      search.modo === "criar" || search.modo === "entrar"
        ? search.modo
        : undefined,
  }),
  component: AcessoPage,
});

const recuperarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recuperar",
  component: RecuperarSenhaPage,
});

const centralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/central",
  component: () => (
    <RequireMember>
      <CentralPage />
    </RequireMember>
  ),
});

const arsenalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/arsenal",
  component: () => (
    <RequireMember>
      <ArsenalPage />
    </RequireMember>
  ),
});

const produtoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/arsenal/$productId",
  component: () => (
    <RequireMember>
      <ProdutoPage />
    </RequireMember>
  ),
});

const bibliotecaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/biblioteca",
  component: () => (
    <RequireMember>
      <ConhecimentoPage />
    </RequireMember>
  ),
});

const fichaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/biblioteca/$cardId",
  component: () => (
    <RequireMember>
      <FichaConhecimentoPage />
    </RequireMember>
  ),
});

const claRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cla",
  component: () => (
    <RequireMember>
      <ClaPage />
    </RequireMember>
  ),
});

const claBibliotecaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cla/biblioteca",
  component: () => (
    <RequireMember>
      <ClaBibliotecaPage />
    </RequireMember>
  ),
});

const claCursosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cla/cursos",
  component: () => (
    <RequireMember>
      <ClaCursosPage />
    </RequireMember>
  ),
});

const claComunidadeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cla/comunidade",
  component: () => (
    <RequireMember>
      <ClaComunidadePage />
    </RequireMember>
  ),
});

const claKitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cla/kits",
  component: () => (
    <RequireMember>
      <ClaKitsPage />
    </RequireMember>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  acessoRoute,
  recuperarRoute,
  centralRoute,
  arsenalRoute,
  produtoRoute,
  bibliotecaRoute,
  fichaRoute,
  claRoute,
  claBibliotecaRoute,
  claCursosRoute,
  claComunidadeRoute,
  claKitsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
