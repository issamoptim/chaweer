# EP-09 — Questions & Answers

> **Status:** Draft  
> **Sprint:** Future (Sprint 11+)  
> **Last updated:** 2026-07-19

---

## Business Objective

Create a community-driven Q&A module where citizens can ask legal questions and verified lawyers can provide answers — building a knowledge base and increasing platform engagement.

## Scope

- Ask a legal question (citizen)
- Answer a question (verified lawyer)
- Q&A browse and search
- Voting on helpful answers
- Q&A categorization by legal area

## Business Rules

- **Verified lawyers only**: only lawyers who passed verification can answer questions
- **Anonymous questions**: citizens can ask questions anonymously if desired
- **Categorization**: questions are categorized by legal area (family, business, criminal, etc.)
- **Voting**: citizens can upvote helpful answers; answers sorted by helpfulness
- **No legal advice disclaimer**: Q&A is for general information, not formal legal advice
- **Moderation**: admins can remove inappropriate questions or answers

## User Story Index

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-072 | Ask a Legal Question | Low | Future | Draft | Future | EP-02 |
| US-073 | Answer a Question (Professional) | Low | Future | Draft | Future | US-072 |
| US-074 | Q&A Browse & Search | Low | Future | Draft | Future | US-072 |
| US-075 | Q&A Voting (helpful answers) | Low | Future | Draft | Future | US-073 |
| US-076 | Q&A Categorization | Low | Future | Draft | Future | US-072 |

## Dependencies

- EP-02 Account Management (authenticated users)
- EP-03 Professional Onboarding (verified lawyers to answer)
- EP-11 Administration (moderation)

## Roadmap

| Phase | Status |
|---|---|
| Sprint 11+ (US-072→076) | Draft |

## Related Documents

- [`Releases.md`](../00-product/Releases.md)
- [`Roadmap.md`](../00-product/Roadmap.md)
