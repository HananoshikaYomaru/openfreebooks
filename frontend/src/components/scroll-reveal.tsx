import { onCleanup, onMount } from "solid-js";

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

    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 80}ms`;
      observer.observe(card);
    });

    onCleanup(() => observer.disconnect());
  });

  return null;
}
