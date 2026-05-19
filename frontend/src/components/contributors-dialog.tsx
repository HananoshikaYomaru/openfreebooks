import { onMount } from "solid-js";

function openContributorDialog(dialogId: string) {
  const dialog = document.getElementById(dialogId);
  if (dialog instanceof HTMLDialogElement) {
    dialog.showModal();
  }
}

function wireContributorDialogs() {
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-contributor-dialog]");
  const dialogs = document.querySelectorAll<HTMLDialogElement>(".contributor-dialog");

  const onButtonClick = (event: Event) => {
    const button = event.currentTarget;
    if (!(button instanceof HTMLButtonElement)) return;
    const dialogId = button.dataset.contributorDialog;
    if (dialogId) openContributorDialog(dialogId);
  };

  const onDialogClick = (event: MouseEvent) => {
    const dialog = event.currentTarget;
    if (!(dialog instanceof HTMLDialogElement)) return;
    if (event.target === dialog) {
      dialog.close();
    }
  };

  buttons.forEach((button) => button.addEventListener("click", onButtonClick));
  dialogs.forEach((dialog) => dialog.addEventListener("click", onDialogClick));

  return () => {
    buttons.forEach((button) => button.removeEventListener("click", onButtonClick));
    dialogs.forEach((dialog) => dialog.removeEventListener("click", onDialogClick));
  };
}

export function ContributorsDialogBootstrap() {
  onMount(() => {
    return wireContributorDialogs();
  });

  return null;
}
