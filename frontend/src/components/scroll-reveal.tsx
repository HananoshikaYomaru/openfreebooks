import { onCleanup, onMount } from "solid-js";

const STAGGER_MS = 80;

function getStaggerGroup(card: HTMLElement): HTMLElement {
  return (
    card.closest("[data-scroll-reveal]") ??
    card.closest("section") ??
    card.parentElement ??
    document.body
  );
}

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

function groupCards(cards: HTMLElement[]): Map<HTMLElement, HTMLElement[]> {
  const groups = new Map<HTMLElement, HTMLElement[]>();
  for (const card of cards) {
    const group = getStaggerGroup(card);
    const list = groups.get(group);
    if (list) {
      list.push(card);
    } else {
      groups.set(group, [card]);
    }
  }
  return groups;
}

export function ScrollRevealBootstrap() {
  onMount(() => {
    const cards = document.querySelectorAll<HTMLElement>("[data-scroll-reveal-card]");
    if (!cards.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      cards.forEach((card) => card.classList.add("is-inview"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    const groups = groupCards([...cards]);

    for (const groupCards of groups.values()) {
      groupCards.forEach((card, index) => {
        if (isInViewport(card)) {
          card.style.transitionDelay = "0ms";
          card.classList.add("is-inview");
          return;
        }

        card.style.transitionDelay = `${index * STAGGER_MS}ms`;
        observer.observe(card);
      });
    }

    onCleanup(() => observer.disconnect());
  });

  return null;
}
