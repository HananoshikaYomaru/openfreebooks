const STORAGE_KEY = "openfreebooks-theme";

export type ThemeChoice = "light" | "dark";

export function getSystemTheme(): ThemeChoice {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme(): ThemeChoice | null {
  const value = localStorage.getItem(STORAGE_KEY);
  if (value === "light" || value === "dark") {
    return value;
  }
  return null;
}

export function resolveTheme(): ThemeChoice {
  return getStoredTheme() ?? getSystemTheme();
}

export function applyTheme(theme: ThemeChoice) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function setTheme(theme: ThemeChoice) {
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
}

export function initTheme() {
  applyTheme(resolveTheme());
}
