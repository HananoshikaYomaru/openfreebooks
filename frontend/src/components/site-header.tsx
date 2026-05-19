import { createSignal, onCleanup, onMount, For } from "solid-js";
import { ThemeToggle } from "./theme-toggle";

type NavLink = {
  label: string;
  href: string;
};

type SiteHeaderProps = {
  brand: string;
  homeUrl: string;
  links: NavLink[];
};

export function SiteHeader(props: SiteHeaderProps) {
  const [scrolled, setScrolled] = createSignal(false);
  const [navOpen, setNavOpen] = createSignal(false);

  onMount(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      if (window.innerWidth > 768 && navOpen()) {
        setNavOpen(false);
        document.body.style.overflow = "";
      }
    };
    window.addEventListener("resize", onResize, { passive: true });

    onCleanup(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    });
  });

  const setOpen = (open: boolean) => {
    setNavOpen(open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  const headerClass = () => {
    const classes = ["site-header"];
    if (scrolled()) classes.push("is-scrolled");
    if (navOpen()) classes.push("nav-is-open");
    return classes.join(" ");
  };

  return (
    <header class={headerClass()}>
      <div class="container header-row">
        <div class="brand">
          <a class="brand-name" href={props.homeUrl}>
            {props.brand}
          </a>
        </div>
        <div class="header-actions">
          <nav class="main-nav" aria-label="Primary navigation">
            <For each={props.links}>{(link) => <a href={link.href}>{link.label}</a>}</For>
          </nav>
          <div class="site-header__search">
            <pagefind-modal-trigger compact placeholder="Search" />
          </div>
          <ThemeToggle />
          <button
            type="button"
            class="nav-burger"
            aria-controls="mobile-nav"
            aria-expanded={navOpen() ? "true" : "false"}
            aria-label={navOpen() ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!navOpen())}
          >
            <span class="nav-burger-line" />
            <span class="nav-burger-line" />
            <span class="nav-burger-line" />
          </button>
        </div>
      </div>
      <div
        class="nav-backdrop"
        aria-hidden={navOpen() ? "false" : "true"}
        onClick={() => setOpen(false)}
      />
      <nav id="mobile-nav" class="mobile-nav-panel" aria-label="Mobile navigation">
        <For each={props.links}>
          {(link) => (
            <a href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          )}
        </For>
      </nav>
    </header>
  );
}
