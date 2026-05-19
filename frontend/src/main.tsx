import { render } from "solid-js/web";
import { SiteHeader } from "./components/site-header";
import { Marquee } from "./components/marquee";
import { ContributorsDialogBootstrap } from "./components/contributors-dialog";
import { ScrollRevealBootstrap } from "./components/scroll-reveal";
import { initTheme } from "./theme";

function readConfig() {
  const el = document.getElementById("site-config");
  if (!el?.textContent) {
    return {
      brand: "Open Free Books",
      homeUrl: "/",
      browseUrl: "/catalog/",
      aboutUrl: "/about/",
      searchUrl: "/search/",
      contributingUrl: "/contributing/",
      githubUrl: "https://github.com/openfreebooks/openfreebooks",
    };
  }
  return JSON.parse(el.textContent) as {
    brand: string;
    homeUrl: string;
    browseUrl: string;
    aboutUrl: string;
    searchUrl: string;
    contributingUrl: string;
    githubUrl: string;
  };
}

function mountFooterYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

initTheme();

const config = readConfig();
const navLinks = [
  { label: "Browse", href: config.browseUrl },
  { label: "Search", href: config.searchUrl },
  { label: "About", href: config.aboutUrl },
  { label: "GitHub", href: config.githubUrl },
];

const headerRoot = document.getElementById("site-header");
if (headerRoot) {
  render(
    () => (
      <SiteHeader brand={config.brand} homeUrl={config.homeUrl} links={navLinks} />
    ),
    headerRoot
  );
}

const marqueeRoot = document.getElementById("marquee");
if (marqueeRoot) {
  render(() => <Marquee />, marqueeRoot);
}

render(() => <ScrollRevealBootstrap />, document.body);
render(() => <ContributorsDialogBootstrap />, document.body);

const particleRoot = document.getElementById("webgl-background");
if (particleRoot && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  void import("./lib/particle-background").then(({ initParticleBackground }) => {
    initParticleBackground(particleRoot);
  });
}

const copyPageRoot = document.getElementById("copy-page-button");
if (copyPageRoot) {
  void import("./components/copy-page-button").then(({ CopyPageButton }) => {
    render(() => <CopyPageButton />, copyPageRoot);
  });
}

const hasQuadraticChapter =
  document.getElementById("quadratic-explorer") ||
  document.getElementById("projectile-demo") ||
  document.getElementById("profit-demo") ||
  document.getElementById("area-demo");

const chapterNavRoot = document.getElementById("chapter-heading-nav");
if (chapterNavRoot) {
  void import("./components/chapter-heading-nav").then(({ ChapterHeadingNav }) => {
    render(() => <ChapterHeadingNav />, chapterNavRoot);
  });
}

if (hasQuadraticChapter) {
  void Promise.all([
    import("./components/quadratic-explorer"),
    import("./components/quadratic-application-demos"),
    import("./lib/render-math"),
  ]).then(([{ QuadraticExplorer }, demos, { renderBookMath }]) => {
    const quadraticRoot = document.getElementById("quadratic-explorer");
    if (quadraticRoot) {
      render(() => <QuadraticExplorer />, quadraticRoot);
    }
    const appDemos: Array<[string, () => import("solid-js").JSX.Element]> = [
      ["projectile-demo", demos.ProjectileDemo],
      ["profit-demo", demos.ProfitDemo],
      ["area-demo", demos.AreaDemo],
    ];
    for (const [id, Demo] of appDemos) {
      const root = document.getElementById(id);
      if (root) {
        render(() => <Demo />, root);
      }
    }
    requestAnimationFrame(() => renderBookMath());
  });
}

const catalogRoot = document.getElementById("catalog-app");
if (catalogRoot) {
  void import("./components/catalog-app").then(({ CatalogApp }) => {
    catalogRoot.replaceChildren();
    render(() => <CatalogApp />, catalogRoot);
  });
}

if (document.getElementById("contributing-demo-graph") || document.getElementById("contributing-demo-views")) {
  void import("./components/contributing-demos").then(({ mountContributingDemos }) => {
    mountContributingDemos();
  });
}

mountFooterYear();
