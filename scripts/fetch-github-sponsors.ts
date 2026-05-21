import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

type GraphQLError = {
  message?: string;
};

type SponsorNode = {
  sponsorEntity?: {
    login?: string;
    avatarUrl?: string;
    url?: string;
  } | null;
};

type SponsorsConnection = {
  pageInfo?: {
    hasNextPage?: boolean;
    endCursor?: string | null;
  };
  nodes?: SponsorNode[];
};

type GraphQLResponse = {
  data?: {
    user?: {
      sponsorshipsAsMaintainer?: SponsorsConnection;
    } | null;
  };
  errors?: GraphQLError[];
};

type SponsorRecord = {
  login: string;
  name: string;
  avatar: string;
  url: string;
};

const ROOT = join(import.meta.dir, "..");
const OUTPUT_PATH = join(ROOT, "data", "github-sponsors.json");
const SPONSORABLE_LOGIN = "HananoshikaYomaru";

async function fetchSponsorPage(token: string, after: string | null): Promise<SponsorsConnection> {
  const query = `
    query SponsorsAsMaintainer($login: String!, $after: String) {
      user(login: $login) {
        sponsorshipsAsMaintainer(first: 100, after: $after, includePrivate: false) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            sponsorEntity {
              ... on User {
                login
                avatarUrl
                url
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "openfreebooks-sponsor-sync",
    },
    body: JSON.stringify({
      query,
      variables: {
        login: SPONSORABLE_LOGIN,
        after,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed (${response.status} ${response.statusText})`);
  }

  const payload = (await response.json()) as GraphQLResponse;
  if (payload.errors?.length) {
    const message = payload.errors.map((err) => err.message).filter(Boolean).join("; ");
    throw new Error(`GitHub GraphQL returned errors: ${message}`);
  }

  const connection = payload.data?.user?.sponsorshipsAsMaintainer;
  return connection ?? { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
}

function toSponsorRecord(node: SponsorNode): SponsorRecord | null {
  const entity = node.sponsorEntity;
  if (!entity?.login || !entity.avatarUrl || !entity.url) return null;

  return {
    login: entity.login,
    name: entity.login,
    avatar: entity.avatarUrl,
    url: entity.url,
  };
}

async function main() {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) {
    throw new Error("GITHUB_TOKEN is required to fetch GitHub Sponsors.");
  }

  const sponsors: SponsorRecord[] = [];
  let after: string | null = null;

  while (true) {
    const connection = await fetchSponsorPage(token, after);
    const nodes = connection.nodes ?? [];
    for (const node of nodes) {
      const sponsor = toSponsorRecord(node);
      if (sponsor) sponsors.push(sponsor);
    }
    if (!connection.pageInfo?.hasNextPage) break;
    after = connection.pageInfo.endCursor ?? null;
    if (!after) break;
  }

  sponsors.sort((a, b) => a.name.localeCompare(b.name, "en"));

  const output = {
    title: "GitHub Sponsors",
    intro: "Supporters who help keep Open Free Books free and open for learners everywhere.",
    profile_url: `https://github.com/sponsors/${SPONSORABLE_LOGIN}`,
    fetched_at: new Date().toISOString(),
    sponsors,
  };

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Wrote ${OUTPUT_PATH} with ${sponsors.length} sponsor(s).`);
}

void main();
