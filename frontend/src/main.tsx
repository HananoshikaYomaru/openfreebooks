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
      faqUrl: "/faq/",
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
    faqUrl: string;
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

function localizeChapterLastModified() {
  const times = document.querySelectorAll<HTMLTimeElement>("time[data-localize-lastmod]");
  if (times.length === 0) return;

  const formatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  for (const timeEl of times) {
    const iso = timeEl.getAttribute("datetime");
    if (!iso) continue;

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) continue;
    timeEl.textContent = formatter.format(date);
  }
}

let stopMathObserver: (() => void) | null = null;

function scheduleBookMath() {
  void import("./lib/katex").then(({ observeMathAutoRender, renderBookMath }) => {
    requestAnimationFrame(() => {
      renderBookMath(document);
      if (!stopMathObserver) {
        stopMathObserver = observeMathAutoRender(document);
      }
    });
  });
}

function mountChapterWidgets() {
  const article = document.querySelector<HTMLElement>("[data-chapter]");
  const chapterKey = article?.dataset.chapter;
  const mounts = document.querySelectorAll<HTMLElement>("[data-widget]");
  if (!article || !chapterKey) return;

  if (mounts.length === 0) return;

  void import("./generated/chapter-widgets").then(({ chapterWidgetUrls }) => {
    const loadPromises: Promise<void>[] = [];

    for (const el of mounts) {
      const widget = el.dataset.widget;
      if (!widget) continue;
      const loaderKey = `${chapterKey}/${widget}`;
      const moduleUrl = chapterWidgetUrls[loaderKey];
      if (!moduleUrl) {
        console.warn(`No widget module URL registered for ${loaderKey}`);
        continue;
      }
      loadPromises.push(
        import(/* @vite-ignore */ moduleUrl).then((mod) => {
          render(() => mod.default({}), el);
        })
      );
    }

    void Promise.all(loadPromises).then(() => {
      scheduleBookMath();
    });
  });
}

/** Prose math runs immediately; widgets re-run after mount for any new captions. */
function initBookMath() {
  if (document.querySelector("[data-pagefind-body]")) {
    scheduleBookMath();
  }
}

initTheme();

const config = readConfig();
const navLinks = [
  { label: "Browse", href: config.browseUrl },
  { label: "Search", href: config.searchUrl },
  { label: "About", href: config.aboutUrl },
  { label: "FAQ", href: config.faqUrl },
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

function mountSubjectInit() {
  const article = document.querySelector<HTMLElement>("[data-chapter]");
  const chapterKey = article?.dataset.chapter;
  if (!article || !chapterKey) return;

  const subject = chapterKey.split("/")[0];
  void import("./generated/subject-modules").then(({ subjectInitLoaders }) => {
    const loader = subjectInitLoaders[subject];
    if (!loader) return;
    void loader().then((mod) => mod.initSubject(article));
  });
}

initBookMath();
mountSubjectInit();
mountChapterWidgets();
localizeChapterLastModified();

const catalogRoot = document.getElementById("catalog-app");
if (catalogRoot) {
  void import("./components/catalog-app").then(({ CatalogApp }) => {
    catalogRoot.replaceChildren();
    render(() => <CatalogApp />, catalogRoot);
  });
}

mountFooterYear();
