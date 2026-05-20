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

function scheduleChapterMath() {
  void import("./lib/render-math").then(({ renderBookMath }) => {
    requestAnimationFrame(() => renderBookMath());
  });
}

function mountChapterWidgets() {
  const article = document.querySelector<HTMLElement>("[data-chapter]");
  const chapterKey = article?.dataset.chapter;
  const mounts = document.querySelectorAll<HTMLElement>("[data-widget]");
  if (!article || !chapterKey) return;

  // KaTeX must run on widget-less chapters too (renderBookMath was only chained after widgets).
  if (mounts.length === 0) {
    scheduleChapterMath();
    return;
  }

  void import("./generated/chapter-widgets").then(({ chapterWidgetLoaders }) => {
    const loadPromises: Promise<void>[] = [];

    for (const el of mounts) {
      const widget = el.dataset.widget;
      if (!widget) continue;
      const loaderKey = `${chapterKey}/${widget}`;
      const loader = chapterWidgetLoaders[loaderKey];
      if (!loader) {
        console.warn(`No widget loader registered for ${loaderKey}`);
        continue;
      }
      loadPromises.push(
        loader().then((mod) => {
          render(() => mod.default(), el);
        })
      );
    }

    void Promise.all(loadPromises).then(() => {
      scheduleChapterMath();
    });
  });
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

const chapterNavRoot = document.getElementById("chapter-heading-nav");
if (chapterNavRoot) {
  void import("./components/chapter-heading-nav").then(({ ChapterHeadingNav }) => {
    render(() => <ChapterHeadingNav />, chapterNavRoot);
  });
}

mountChapterWidgets();

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
