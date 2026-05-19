const SITE_NAME = "Open Free Books";

let defuddleModule: Promise<typeof import("defuddle/full")> | null = null;

function loadDefuddle() {
  if (!defuddleModule) {
    defuddleModule = import("defuddle/full");
  }
  return defuddleModule;
}

function escapeYamlValue(value: string): string {
  if (/[\n:"\\]/.test(value) || value.startsWith(" ") || value.endsWith(" ")) {
    return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return value;
}

function formatFrontMatter(fields: Record<string, string>): string {
  const lines = Object.entries(fields).map(
    ([key, value]) => `${key}: ${escapeYamlValue(value)}`
  );
  return `---\n${lines.join("\n")}\n---\n\n`;
}

function prepareChapterRoot(): HTMLElement {
  const article = document.querySelector<HTMLElement>(".book-chapter");
  if (!article) {
    throw new Error("Chapter content not found on this page.");
  }

  const clone = article.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".math-widget-mount, [data-copy-exclude]").forEach((el) => {
    el.remove();
  });
  return clone;
}

function buildParseDocument(chapterRoot: HTMLElement): Document {
  const doc = document.implementation.createHTMLDocument("copy");
  doc.body.appendChild(chapterRoot);
  return doc;
}

function resolveTitle(resultTitle: string, chapterRoot: HTMLElement): string {
  const trimmed = resultTitle.trim();
  if (trimmed) {
    return trimmed;
  }
  const heading = chapterRoot.querySelector("h1");
  return heading?.textContent?.trim() ?? "Untitled chapter";
}

export async function copyPageAsMarkdown(): Promise<void> {
  const chapterRoot = prepareChapterRoot();
  const parseDoc = buildParseDocument(chapterRoot);
  const source = window.location.href;

  const { default: Defuddle } = await loadDefuddle();
  const result = new Defuddle(parseDoc, {
    markdown: true,
    url: source,
    useAsync: false,
    contentSelector: ".book-chapter",
  }).parse();

  const title = resolveTitle(result.title, chapterRoot);
  const body = result.content.trim();
  const markdown = formatFrontMatter({
    title,
    source,
    site: SITE_NAME,
  }) + body;

  if (!navigator.clipboard?.writeText) {
    throw new Error("Clipboard is not available in this browser.");
  }

  await navigator.clipboard.writeText(markdown);
}
