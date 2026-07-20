# Chaweer — Product Backlog

> **Status:** In Progress  
> **Last updated:** 2026-07-19  
> **This document is the single entry point to understand the project. It references every EPIC and every User Story.**

---

## How to Read This Backlog

- User Stories are grouped by **EPIC**.
- Each US has: **ID**, **Title**, **Priority**, **Classification** (MVP / Post-MVP / Future / Nice-to-have), **Dependencies**, **Status**, and a link to its EPIC document.
- Individual US files exist in `docs/03-functional/` only for completed, deferred, and current-sprint stories. Future stories exist as entries in their EPIC document.
- **Statuses**: Draft · Planned · In Progress · Review · Done · Deferred · Cancelled

---

## EPIC Index

| EPIC | Name | Status | Sprint | Document |
|---|---|---|---|---|
| EP-00 | Foundation | Done | Sprint 00 | [`EP-00-Foundation.md`](../01-epics/EP-00-Foundation.md) |
| EP-01 | Authentication | Done | Sprint 01 | [`EP-01-Authentication.md`](../01-epics/EP-01-Authentication.md) |
| EP-02 | Account Management | In Progress | Sprint 02 | [`EP-02-Account-Management.md`](../01-epics/EP-02-Account-Management.md) |
| EP-03 | Professional Onboarding | Planned | Sprint 03 | [`EP-03-Professional-Onboarding.md`](../01-epics/EP-03-Professional-Onboarding.md) |
| EP-04 | Public Directory | Planned | Sprint 05 | [`EP-04-Public-Directory.md`](../01-epics/EP-04-Public-Directory.md) |
| EP-05 | Professional Profile | Planned | Sprint 04 | [`EP-05-Professional-Profile.md`](../01-epics/EP-05-Professional-Profile.md) |
| EP-06 | Appointment Booking | Planned | Sprint 06 | [`EP-06-Appointment-Booking.md`](../01-epics/EP-06-Appointment-Booking.md) |
| EP-07 | Payments | Planned | Sprint 07 | [`EP-07-Payments.md`](../01-epics/EP-07-Payments.md) |
| EP-08 | Reviews & Ratings | Planned | Sprint 08 | [`EP-08-Reviews-Ratings.md`](../01-epics/EP-08-Reviews-Ratings.md) |
| EP-09 | Questions & Answers | Draft | Future | [`EP-09-Questions-Answers.md`](../01-epics/EP-09-Questions-Answers.md) |
| EP-10 | Notifications | Planned | Sprint 07 | [`EP-10-Notifications.md`](../01-epics/EP-10-Notifications.md) |
| EP-11 | Administration | Planned | Sprint 03+ | [`EP-11-Administration.md`](../01-epics/EP-11-Administration.md) |
| EP-12 | AI Features | Draft | Future | [`EP-12-AI-Features.md`](../01-epics/EP-12-AI-Features.md) |

---

## User Stories by EPIC

### EP-00 — Foundation

No formal User Stories. Technical setup sprint.

| ID | Title | Priority | Classification | Status | Sprint |
|---|---|---|---|---|---|
| — | Monorepo, Docker, PostgreSQL, Prisma, CI/CD | High | MVP | Done | Sprint 00 |

---

### EP-01 — Authentication

No formal User Stories. Authentication foundation sprint.

| ID | Title | Priority | Classification | Status | Sprint |
|---|---|---|---|---|---|
| — | Registration, Google OAuth, JWT, Protected routes | High | MVP | Done | Sprint 01 |

---

### EP-02 — Account Management

| ID | Title | Priority | Classification | Status | Sprint | Dependencies | US File |
|---|---|---|---|---|---|---|---|
| US-021 | View Profile | High | MVP | Done | Sprint 02 | EP-01 | [`US-021.md`](../03-functional/US-021.md) |
| US-022 | Edit Profile | High | MVP | Done | Sprint 02 | US-021 | [`US-022.md`](../03-functional/US-022.md) |
| US-023 | Account Security | High | MVP | Done | Sprint 02 | US-021 | [`US-023.md`](../03-functional/US-023.md) |
| US-024 | Email Verification | Medium | Post-MVP | Deferred | Sprint 09 | EP-01 | [`US-024.md`](../03-functional/US-024.md) |
| US-025 | Forgot / Reset Password | Medium | Post-MVP | Deferred | Sprint 09 | EP-01 | [`US-025.md`](../03-functional/US-025.md) |
| US-026 | Logout | Medium | Post-MVP | Deferred | Sprint 09 | EP-01 | [`US-026.md`](../03-functional/US-026.md) |
| US-027 | Phone Authentication | Low | Post-MVP | Deferred | Sprint 09 | EP-01 | [`US-027.md`](../03-functional/US-027.md) |

---

### EP-03 — Professional Onboarding

| ID | Title | Priority | Classification | Status | Sprint | Dependencies | US File |
|---|---|---|---|---|---|---|---|
| US-028 | Professional Registration (Avocat) | High | MVP | Planned | Sprint 03 | EP-01 | [`US-028.md`](../03-functional/US-028.md) |
| US-029 | Identity & Bar Association Verification | High | MVP | Planned | Sprint 03 | US-028 | [`US-029.md`](../03-functional/US-029.md) |
| US-030 | Professional Document Upload | High | MVP | Planned | Sprint 03 | US-028 | [`US-030.md`](../03-functional/US-030.md) |
| US-031 | Specializations & Languages Selection | High | MVP | Planned | Sprint 03 | US-028 | [`US-031.md`](../03-functional/US-031.md) |
| US-032 | Professional Profile Setup (Initial) | High | MVP | Planned | Sprint 03 | US-028, US-031 | [`US-032.md`](../03-functional/US-032.md) |
| US-033 | Onboarding Wizard (Multi-step Flow) | High | MVP | Planned | Sprint 03 | US-028→032 | [`US-033.md`](../03-functional/US-033.md) |
| US-034 | Admin Verification Review | High | MVP | Planned | Sprint 03 | US-029, US-030 | [`US-034.md`](../03-functional/US-034.md) |

---

### EP-04 — Public Directory

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-035 | Directory Search (name, specialization, location) | High | MVP | Planned | Sprint 05 | EP-03, EP-05 |
| US-036 | Directory Filters (specialization, language, availability) | High | MVP | Planned | Sprint 05 | US-035 |
| US-037 | Directory Sorting (rating, experience, price) | Medium | MVP | Planned | Sprint 05 | US-035 |
| US-038 | Lawyer Card Component (directory listing) | High | MVP | Planned | Sprint 05 | US-035 |
| US-039 | Directory Pagination / Infinite Scroll | Medium | MVP | Planned | Sprint 05 | US-035 |
| US-040 | Directory Map View | Low | Future | Draft | Future | US-035 |
| US-041 | Saved / Favorite Lawyers | Low | Nice-to-have | Draft | Future | US-035 |

---

### EP-05 — Professional Profile

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-042 | Professional Profile View (Public) | High | MVP | Planned | Sprint 04 | EP-03 |
| US-043 | Professional Profile Edit | High | MVP | Planned | Sprint 04 | US-042 |
| US-044 | Availability & Calendar Management | High | MVP | Planned | Sprint 04 | US-043 |
| US-045 | Consultation Types Setup (video, audio, chat) | High | MVP | Planned | Sprint 04 | US-043 |
| US-046 | Pricing Setup (consultation fees) | High | MVP | Planned | Sprint 04 | US-045 |
| US-047 | Education & Experience Display | Low | Post-MVP | Draft | Sprint 08 | US-042 |
| US-048 | Reviews Display on Profile | Low | Post-MVP | Draft | Sprint 08 | US-042, EP-08 |

---

### EP-06 — Appointment Booking

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-049 | Appointment Slot Selection | High | MVP | Planned | Sprint 06 | US-044 |
| US-050 | Appointment Creation & Confirmation | High | MVP | Planned | Sprint 06 | US-049, US-046 |
| US-051 | Appointment Cancellation | High | MVP | Planned | Sprint 06 | US-050 |
| US-052 | Appointment Status Tracking | High | MVP | Planned | Sprint 06 | US-050 |
| US-053 | Video Consultation Interface | High | MVP | Planned | Sprint 06 | US-050 |
| US-054 | Appointment History | Medium | MVP | Planned | Sprint 06 | US-050 |
| US-055 | Appointment Rescheduling | Medium | Post-MVP | Draft | Sprint 08 | US-050 |
| US-056 | Appointment Reminders | Medium | Post-MVP | Draft | Sprint 08 | US-050, EP-10 |
| US-057 | Audio Consultation Interface | Low | Post-MVP | Draft | Sprint 08 | US-050 |
| US-058 | Professional Calendar View | Low | Post-MVP | Draft | Sprint 08 | US-044 |
| US-059 | Chat Consultation Interface | Low | Future | Draft | Future | US-050 |

---

### EP-07 — Payments

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-060 | Payment Method Setup (user side) | High | MVP | Planned | Sprint 07 | EP-02 |
| US-061 | Payment Processing (consultation fee) | High | MVP | Planned | Sprint 07 | US-060, US-046 |
| US-062 | Payment Receipt / Invoice | High | MVP | Planned | Sprint 07 | US-061 |
| US-063 | Refund Processing | Medium | Post-MVP | Draft | Sprint 09 | US-061, US-051 |
| US-064 | Professional Payouts | Medium | Post-MVP | Draft | Sprint 09 | US-061 |
| US-065 | Payment History & Transactions | Medium | Post-MVP | Draft | Sprint 09 | US-061 |
| US-066 | Subscription Plans (Professional) | Low | Future | Draft | Future | EP-07 |

---

### EP-08 — Reviews & Ratings

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-067 | Post-Consultation Review | Medium | Post-MVP | Draft | Sprint 08 | US-052 |
| US-068 | Review Display on Profile | Medium | Post-MVP | Draft | Sprint 08 | US-067, US-042 |
| US-069 | Review Response (Professional) | Low | Post-MVP | Draft | Sprint 08 | US-067 |
| US-070 | Rating Aggregation | Medium | Post-MVP | Draft | Sprint 08 | US-067 |
| US-071 | Review Moderation (Admin) | Low | Post-MVP | Draft | Sprint 08 | US-067, EP-11 |

---

### EP-09 — Questions & Answers

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-072 | Ask a Legal Question | Low | Future | Draft | Future | EP-02 |
| US-073 | Answer a Question (Professional) | Low | Future | Draft | Future | US-072 |
| US-074 | Q&A Browse & Search | Low | Future | Draft | Future | US-072 |
| US-075 | Q&A Voting (helpful answers) | Low | Future | Draft | Future | US-073 |
| US-076 | Q&A Categorization | Low | Future | Draft | Future | US-072 |

---

### EP-10 — Notifications

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-077 | Email Notifications (transactional) | High | MVP | Planned | Sprint 07 | EP-02 |
| US-078 | Push Notifications (web) | High | MVP | Planned | Sprint 07 | EP-02 |
| US-079 | In-App Notification Center | Medium | Post-MVP | Draft | Sprint 10 | US-077, US-078 |
| US-080 | Notification Preferences Management | Medium | Post-MVP | Draft | Sprint 10 | US-077, US-078 |
| US-081 | SMS Notifications | Low | Nice-to-have | Draft | Future | US-027 |

---

### EP-11 — Administration

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-082 | Professional Verification Management | High | MVP | Planned | Sprint 03 | US-029, US-030 |
| US-083 | Admin Dashboard (overview metrics) | Medium | Post-MVP | Draft | Sprint 10 | EP-11 |
| US-084 | User Management | Medium | Post-MVP | Draft | Sprint 10 | EP-11 |
| US-085 | Content Moderation | Low | Post-MVP | Draft | Sprint 10 | EP-08, EP-09 |
| US-086 | Analytics & Reporting | Low | Future | Draft | Future | EP-11 |
| US-087 | Dispute Management | Medium | Post-MVP | Draft | Sprint 10 | EP-06, EP-07 |
| US-088 | System Configuration | Low | Future | Draft | Future | EP-11 |

---

### EP-12 — AI Features

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-089 | AI Lawyer Matching | Low | Nice-to-have | Draft | Future | EP-04, EP-05 |
| US-090 | AI Legal Assistant (chatbot) | Low | Nice-to-have | Draft | Future | EP-02 |
| US-091 | AI Consultation Summary | Low | Nice-to-have | Draft | Future | EP-06 |
| US-092 | AI Document Analysis | Low | Nice-to-have | Draft | Future | — |
| US-093 | AI Real-time Translation | Low | Nice-to-have | Draft | Future | EP-06 |

---

## Classification Summary

| Classification | Count | EPICs |
|---|---|---|
| **MVP** | ~28 | EP-02, EP-03, EP-04, EP-05, EP-06, EP-07, EP-10, EP-11 |
| **Post-MVP** | ~22 | EP-02, EP-05, EP-06, EP-07, EP-08, EP-10, EP-11 |
| **Future** | ~12 | EP-04, EP-06, EP-07, EP-09, EP-11 |
| **Nice-to-have** | ~6 | EP-04, EP-10, EP-12 |

---

*This backlog is the single source of truth. Updated at each sprint boundary. For EPIC details, see `docs/01-epics/`. For US details, see `docs/03-functional/`.*
