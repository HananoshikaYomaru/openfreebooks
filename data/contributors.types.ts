/**
 * Contributor data for Open Free Books (`data/contributors.json`).
 *
 * Use `website` for a single personal site. Put email, GitHub, X, and other
 * profiles in `socials`.
 */

export const CONTRIBUTOR_SOCIAL_TYPES = [
  "email",
  "github",
  "gitlab",
  "x",
  "youtube",
  "bluesky",
  "linkedin",
  "mastodon",
  "instagram",
  "facebook",
  "threads",
  "tiktok",
  "discord",
  "orcid",
  "scholar",
  "medium",
  "substack",
  "rss",
] as const;

export type ContributorSocialType = (typeof CONTRIBUTOR_SOCIAL_TYPES)[number];

export interface ContributorSocial {
  type: ContributorSocialType;
  /** Email address (no `mailto:`) or full https URL for other networks */
  url: string;
}

export interface Contributor {
  id?: string;
  name: string;
  avatar?: string;
  /** Single personal website URL */
  website?: string;
  job_title?: string;
  education?: string;
  contributions?: string[];
  socials?: ContributorSocial[];
}

export interface ContributorsFile {
  contributors: Contributor[];
}
