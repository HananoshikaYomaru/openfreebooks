import { createSignal, onMount, Show } from "solid-js";
import { resolveTheme, setTheme, type ThemeChoice } from "../theme";

export function ThemeToggle() {
  const [theme, setThemeState] = createSignal<ThemeChoice>("light");

  onMount(() => {
    setThemeState(resolveTheme());
  });

  const toggle = () => {
    const next: ThemeChoice = theme() === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  };

  return (
    <button
      type="button"
      class="theme-toggle"
      onClick={toggle}
      aria-label={theme() === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme() === "dark" ? "Light mode" : "Dark mode"}
    >
      <Show when={theme() === "dark"} fallback={<span aria-hidden="true">☾</span>}>
        <span aria-hidden="true">☀</span>
      </Show>
    </button>
  );
}
