import { $ } from "bun";

async function runStep(command: string) {
  const result = await $`bash -lc ${command}`;
  if (result.exitCode !== 0) process.exit(result.exitCode || 1);
}

async function main() {
  await runStep("bash scripts/check-static-html.sh");
  await runStep("rm -f themes/openfreebooks/static/main.css public/main.css");
  if (process.env.GITHUB_TOKEN?.trim()) {
    await runStep("bun scripts/fetch-github-sponsors.ts");
  } else {
    console.log("[build:site] GITHUB_TOKEN not set; skipping sponsor sync.");
  }
  await runStep("bun scripts/sync-chapters.ts --full");
  await runStep("bun scripts/build-chapter-widgets.ts --full");
  await runStep("vite build");
  await runStep("bun scripts/generate-site-metadata.ts");
  await runStep("rm -rf public");
  await runStep("zola build");
  await runStep('pagefind --site public --glob "**/index.html" && rm -rf static/pagefind && cp -R public/pagefind static/pagefind');
}

void main();
