import { createEffect, createSignal, For, onCleanup, onMount, Show } from "solid-js";

type NavHeading = {
  id: string;
  label: string;
  level: 2 | 3;
};

/** Delay before closing the rail menu so brief pointer gaps do not dismiss it. */
const RAIL_CLOSE_DELAY_MS = 200;
/** Align with sticky site header (see .book-prose__heading scroll-margin-top). */
const SCROLL_OFFSET = 96;
const CLICK_LOCK_FALLBACK_MS = 900;

function collectHeadings(article: HTMLElement): NavHeading[] {
  const nodes = article.querySelectorAll<HTMLHeadingElement>(
    ".book-prose h2.book-prose__heading[id], .book-prose h3.book-prose__heading[id]"
  );
  return Array.from(nodes).map((node) => ({
    id: node.id,
    label: node.textContent?.trim() ?? node.id,
    level: node.tagName === "H3" ? 3 : 2,
  }));
}

function headingDocumentTop(el: HTMLElement) {
  return el.getBoundingClientRect().top + window.scrollY;
}

function pickActiveId(items: NavHeading[]): string | null {
  if (items.length === 0) return null;

  const position = window.scrollY + SCROLL_OFFSET;
  let active = items[0].id;

  for (const item of items) {
    const el = document.getElementById(item.id);
    if (!el) continue;
    if (headingDocumentTop(el) <= position + 2) {
      active = item.id;
    } else {
      break;
    }
  }

  return active;
}

function scrollMenuToActive(container: HTMLElement | undefined, activeId: string | null) {
  if (!container || !activeId) return;
  const activeEl = container.querySelector(`[data-heading-id="${CSS.escape(activeId)}"]`);
  if (activeEl instanceof HTMLElement) {
    activeEl.scrollIntoView({ block: "center" });
  }
}

export function ChapterHeadingNav() {
  const [headings, setHeadings] = createSignal<NavHeading[]>([]);
  const [activeId, setActiveId] = createSignal<string | null>(null);
  const [railOpen, setRailOpen] = createSignal(false);
  const [sheetOpen, setSheetOpen] = createSignal(false);
  const [isMobile, setIsMobile] = createSignal(false);
  const [popoverListEl, setPopoverListEl] = createSignal<HTMLUListElement | undefined>();
  const [sheetEl, setSheetEl] = createSignal<HTMLElement | undefined>();

  let scrollToHeading: ((id: string) => void) | undefined;
  let railCloseTimer: number | undefined;

  const syncActiveFromScroll = () => {
    const items = headings();
    if (items.length > 0) {
      setActiveId(pickActiveId(items));
    }
  };

  const openRail = () => {
    if (railCloseTimer !== undefined) {
      window.clearTimeout(railCloseTimer);
      railCloseTimer = undefined;
    }
    syncActiveFromScroll();
    setRailOpen(true);
  };

  const scheduleRailClose = () => {
    if (railCloseTimer !== undefined) {
      window.clearTimeout(railCloseTimer);
    }
    railCloseTimer = window.setTimeout(() => {
      railCloseTimer = undefined;
      setRailOpen(false);
    }, RAIL_CLOSE_DELAY_MS);
  };

  onCleanup(() => {
    if (railCloseTimer !== undefined) {
      window.clearTimeout(railCloseTimer);
    }
  });

  onMount(() => {
    const article = document.querySelector<HTMLElement>(".book-chapter");
    if (!article) return;

    const items = collectHeadings(article);
    setHeadings(items);

    const hash = window.location.hash.slice(1);
    const hashMatch = hash && items.some((item) => item.id === hash);
    setActiveId(hashMatch ? hash : pickActiveId(items));

    let lockedId: string | null = null;
    let lockTimer: number | undefined;
    let rafId: number | undefined;
    let scrollEndHandler: (() => void) | null = null;

    const releaseLock = () => {
      lockedId = null;
      if (scrollEndHandler) {
        window.removeEventListener("scrollend", scrollEndHandler);
        scrollEndHandler = null;
      }
      if (lockTimer !== undefined) {
        window.clearTimeout(lockTimer);
        lockTimer = undefined;
      }
      setActiveId(pickActiveId(items));
    };

    const syncActive = () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = undefined;
        if (lockedId) {
          setActiveId(lockedId);
          return;
        }
        setActiveId(pickActiveId(items));
      });
    };

    scrollToHeading = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;

      lockedId = id;
      setActiveId(id);

      if (scrollEndHandler) {
        window.removeEventListener("scrollend", scrollEndHandler);
      }
      if (lockTimer !== undefined) {
        window.clearTimeout(lockTimer);
      }

      const top = Math.max(0, headingDocumentTop(el) - SCROLL_OFFSET);
      window.scrollTo({ top, behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);

      scrollEndHandler = () => releaseLock();
      window.addEventListener("scrollend", scrollEndHandler, { once: true });
      lockTimer = window.setTimeout(releaseLock, CLICK_LOCK_FALLBACK_MS);
    };

    const onScroll = () => syncActive();
    window.addEventListener("scroll", onScroll, { passive: true });

    const mq = window.matchMedia("(max-width: 899px)");
    const updateMobile = () => setIsMobile(mq.matches);
    updateMobile();
    mq.addEventListener("change", updateMobile);

    if (hashMatch) {
      requestAnimationFrame(() => scrollToHeading?.(hash));
    }

    onCleanup(() => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", updateMobile);
      releaseLock();
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      scrollToHeading = undefined;
    });
  });

  createEffect(() => {
    if (!isMobile()) {
      setSheetOpen(false);
    } else {
      setRailOpen(false);
    }
  });

  createEffect(() => {
    if (!railOpen()) return;
    const list = popoverListEl();
    const id = activeId();
    if (!list || !id) return;
    requestAnimationFrame(() => scrollMenuToActive(list, id));
  });

  createEffect(() => {
    if (!sheetOpen()) return;
    const sheet = sheetEl();
    const id = activeId();
    if (!sheet || !id) return;
    requestAnimationFrame(() => scrollMenuToActive(sheet, id));
  });

  const openSheet = () => {
    syncActiveFromScroll();
    setSheetOpen(true);
  };

  const toggleSheet = () => {
    if (sheetOpen()) {
      setSheetOpen(false);
      return;
    }
    openSheet();
  };

  const jump = (id: string) => {
    if (scrollToHeading) {
      scrollToHeading(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        const top = Math.max(0, headingDocumentTop(el) - SCROLL_OFFSET);
        window.scrollTo({ top, behavior: "smooth" });
        history.replaceState(null, "", `#${id}`);
        setActiveId(id);
      }
    }
    setSheetOpen(false);
  };

  const NavList = (props: { listRef?: (el: HTMLUListElement) => void; class?: string }) => (
    <ul
      ref={props.listRef}
      class={`chapter-heading-nav__list ${props.class ?? ""}`.trim()}
      role="list"
    >
      <For each={headings()}>
        {(item) => (
          <li
            class="chapter-heading-nav__item"
            data-heading-id={item.id}
            classList={{
              "chapter-heading-nav__item--active": activeId() === item.id,
              "chapter-heading-nav__item--h3": item.level === 3,
            }}
          >
            <button
              type="button"
              class="chapter-heading-nav__link"
              aria-current={activeId() === item.id ? "location" : undefined}
              onClick={() => jump(item.id)}
            >
              {item.label}
            </button>
          </li>
        )}
      </For>
    </ul>
  );

  return (
    <Show when={headings().length > 0}>
      <nav class="chapter-heading-nav" aria-label="On this page">
        <Show when={!isMobile()}>
          <div
            class="chapter-heading-nav__rail-wrap"
            onMouseEnter={openRail}
            onMouseLeave={scheduleRailClose}
            onFocusIn={openRail}
            onFocusOut={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                scheduleRailClose();
              }
            }}
          >
            <div class="chapter-heading-nav__rail" aria-hidden="true">
              <For each={headings()}>
                {(item) => (
                  <button
                    type="button"
                    class="chapter-heading-nav__tick"
                    classList={{
                      "chapter-heading-nav__tick--active": activeId() === item.id,
                      "chapter-heading-nav__tick--h3": item.level === 3,
                    }}
                    aria-label={item.label}
                    aria-current={activeId() === item.id ? "true" : undefined}
                    onClick={() => jump(item.id)}
                  />
                )}
              </For>
            </div>
            <Show when={railOpen()}>
              <div
                class="chapter-heading-nav__popover"
                role="dialog"
                aria-label="Page sections"
              >
                <p class="chapter-heading-nav__popover-title">On this page</p>
                <NavList listRef={setPopoverListEl} />
              </div>
            </Show>
          </div>
        </Show>

        <Show when={isMobile()}>
          <button
            type="button"
            class="chapter-heading-nav__fab"
            aria-expanded={sheetOpen()}
            aria-controls="chapter-heading-sheet"
            onClick={toggleSheet}
          >
            On this page
          </button>
          <Show when={sheetOpen()}>
            <button
              type="button"
              class="chapter-heading-nav__backdrop"
              aria-label="Close section menu"
              onClick={() => setSheetOpen(false)}
            />
            <div
              id="chapter-heading-sheet"
              ref={setSheetEl}
              class="chapter-heading-nav__sheet"
              role="dialog"
              aria-label="On this page"
            >
              <div class="chapter-heading-nav__sheet-header">
                <p class="chapter-heading-nav__popover-title">On this page</p>
                <button
                  type="button"
                  class="chapter-heading-nav__sheet-close"
                  aria-label="Close"
                  onClick={() => setSheetOpen(false)}
                >
                  ×
                </button>
              </div>
              <NavList />
            </div>
          </Show>
        </Show>
      </nav>
    </Show>
  );
}
