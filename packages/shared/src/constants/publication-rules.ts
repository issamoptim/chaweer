import type { CompletionSection } from "./completion-rules";

export const PUBLISH_BLOCKING_PRECONDITIONS: CompletionSection[] = [
  "identity",
  "expertise",
  "offer",
];

export const PUBLISH_WARNING_PRECONDITIONS: CompletionSection[] = [
  "biography",
  "contact",
  "office",
];

export const PUBLISH_PRECONDITION_ERROR_CODE = "PUBLISH_PRECONDITIONS_NOT_MET";
