/** Credits page data (`data/credits.json`). */

export interface CreditProject {
  name: string;
  version: string;
  license: string;
  license_url: string;
  copyright: string;
  url?: string;
}

export interface CreditLibrary {
  name: string;
  version: string;
  license: string;
  license_url?: string;
  copyright: string;
  url: string;
}

export interface CreditHosting {
  name: string;
  version?: string;
  url: string;
  note: string;
}

export interface CreditsFile {
  intro: string;
  contributors_note: string;
  project: CreditProject;
  libraries: CreditLibrary[];
  hosting: CreditHosting[];
}
