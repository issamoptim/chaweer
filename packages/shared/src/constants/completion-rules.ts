export const COMPLETION_SECTIONS = [
  "identity",
  "biography",
  "contact",
  "office",
  "expertise",
  "offer",
  "education",
  "experience",
  "certifications",
  "memberships",
] as const;

export type CompletionSection = (typeof COMPLETION_SECTIONS)[number];

export const MVP_COMPLETION_SECTIONS: CompletionSection[] = [
  "identity",
  "biography",
  "contact",
  "office",
  "expertise",
  "offer",
];

export const NEXT_COMPLETION_SECTIONS: CompletionSection[] = [
  "education",
  "experience",
  "certifications",
  "memberships",
];
