import "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "pagefind-modal-trigger": {
        compact?: boolean;
        placeholder?: string;
        shortcut?: string;
        "hide-shortcut"?: boolean;
        instance?: string;
      };
    }
  }
}
