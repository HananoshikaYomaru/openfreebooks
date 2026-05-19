import { createSignal } from "solid-js";
import { copyPageAsMarkdown } from "../lib/copy-page-as-markdown";

type ButtonState = "idle" | "loading" | "copied" | "error";

const COPIED_RESET_MS = 2000;

function CopyIcon() {
  return (
    <svg
      class="copy-page-button__icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <rect x="5" y="5" width="9" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.25" />
      <path
        d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11"
        fill="none"
        stroke="currentColor"
        stroke-width="1.25"
        stroke-linecap="round"
      />
    </svg>
  );
}

export function CopyPageButton() {
  const [state, setState] = createSignal<ButtonState>("idle");
  const [errorMessage, setErrorMessage] = createSignal("");

  const label = () => {
    switch (state()) {
      case "loading":
        return "Preparing…";
      case "copied":
        return "Copied!";
      case "error":
        return "Copy failed";
      default:
        return "Copy page";
    }
  };

  const handleClick = async () => {
    if (state() === "loading") {
      return;
    }

    setState("loading");
    setErrorMessage("");

    try {
      await copyPageAsMarkdown();
      setState("copied");
      window.setTimeout(() => {
        if (state() === "copied") {
          setState("idle");
        }
      }, COPIED_RESET_MS);
    } catch (err) {
      setState("error");
      setErrorMessage(err instanceof Error ? err.message : "Could not copy page.");
      window.setTimeout(() => {
        if (state() === "error") {
          setState("idle");
          setErrorMessage("");
        }
      }, COPIED_RESET_MS);
    }
  };

  return (
    <div class="copy-page-button-wrap">
      <button
        type="button"
        class="copy-page-button"
        classList={{
          "copy-page-button--loading": state() === "loading",
          "copy-page-button--copied": state() === "copied",
          "copy-page-button--error": state() === "error",
        }}
        onClick={handleClick}
        disabled={state() === "loading"}
        aria-label={label()}
        title="Copy page as Markdown for LLMs"
      >
        <CopyIcon />
        <span class="copy-page-button__label">{label()}</span>
      </button>
      <p class="copy-page-button__status" aria-live="polite">
        {state() === "error" ? errorMessage() : state() === "copied" ? "Page copied to clipboard." : ""}
      </p>
    </div>
  );
}
