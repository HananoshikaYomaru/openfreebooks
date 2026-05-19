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
      browseUrl: "/browse/",
      aboutUrl: "/about/",
      githubUrl: "https://github.com/openfreebooks/openfreebooks",
    };
  }
  return JSON.parse(el.textContent) as {
    brand: string;
    homeUrl: string;
    browseUrl: string;
    aboutUrl: string;
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
mountFooterYear();
