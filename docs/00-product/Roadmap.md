# Chaweer — Product Roadmap

> **Status:** In Progress  
> **Last updated:** 2026-07-19

---

## Roadmap Overview

| Phase | Sprint | EPICs | Key Deliverables | Status |
|---|---|---|---|---|
| ✅ **Completed** | Sprint 00 | EP-00 | Monorepo, Docker, PostgreSQL, Prisma, CI/CD | Done |
| ✅ **Completed** | Sprint 01 | EP-01 | Auth: registration, Google OAuth, JWT, protected routes | Done |
| ✅ **Completed** | Sprint 02 | EP-02 | US-021 Profile view, US-022 Profile edit, US-023 Security | Done |
| 🔜 **Current Sprint** | Sprint 03 | EP-03 + EP-11 (partial) | Professional onboarding + admin verification gate | Planned |
| 📋 **MVP** | Sprint 04 | EP-05 | Professional profile (public view, edit, availability, pricing) | Planned |
| 📋 **MVP** | Sprint 05 | EP-04 | Public directory (search, filters, sorting, pagination) | Planned |
| 📋 **MVP** | Sprint 06 | EP-06 (core) | Appointment booking: slots, creation, confirmation, cancellation, video, history | Planned |
| 📋 **MVP** | Sprint 07 | EP-07 + EP-10 (basic) | Payments (method, processing, receipt) + email & push notifications | Planned |
| 🎯 | — | — | **MVP Launch** | Target |
| 📋 **Post-MVP** | Sprint 08 | EP-08 + EP-06 (enhanced) | Reviews & ratings + rescheduling, reminders, audio consultations | Planned |
| 📋 **Post-MVP** | Sprint 09 | EP-02 (enhanced) + EP-07 (enhanced) | US-024→027 account features + refunds, payouts, payment history | Planned |
| 📋 **Post-MVP** | Sprint 10 | EP-11 (full) + EP-10 (enhanced) | Full admin suite + in-app notifications, preferences | Planned |
| 🔮 **Future** | Sprint 11+ | EP-09, EP-04 (enhanced), EP-07 (subscriptions) | Q&A module, map view, favorites, subscription plans | Future |
| 🔮 **Future** | Sprint 12+ | EP-12 | AI features (matching, assistant, summaries, translation) | Future |

---

## Phase Details

### ✅ Completed

#### Sprint 00 — Foundation (EP-00)
- Monorepo initialization
- Docker environment
- PostgreSQL + Prisma
- Backend & frontend architecture
- CI/CD foundations
- Development environment

#### Sprint 01 — Authentication (EP-01)
- User registration (email + password)
- Google OAuth
- JWT authentication + refresh tokens
- Protected routes
- Basic account creation

#### Sprint 02 — Account Management (EP-02)
- US-021: View Profile ✅
- US-022: Edit Profile ✅
- US-023: Account Security ✅
- US-024→027: Deferred to Post-MVP (Email Verification, Forgot/Reset Password, Logout, Phone Auth)

### 🔜 Current Sprint

#### Sprint 03 — Professional Onboarding (EP-03 + EP-11 partial)
- US-028: Professional Registration (Avocat)
- US-029: Identity & Bar Association Verification
- US-030: Professional Document Upload
- US-031: Specializations & Languages Selection
- US-032: Professional Profile Setup (Initial)
- US-033: Onboarding Wizard (Multi-step Flow)
- US-034: Admin Verification Review

**Sprint goal:** A lawyer can register, submit credentials, complete their initial profile, and an admin can approve/reject the application.

### 📋 MVP (Sprint 04 → Sprint 07)

#### Sprint 04 — Professional Profile (EP-05)
- US-042: Professional Profile View (Public)
- US-043: Professional Profile Edit
- US-044: Availability & Calendar Management
- US-045: Consultation Types Setup
- US-046: Pricing Setup

#### Sprint 05 — Public Directory (EP-04)
- US-035: Directory Search
- US-036: Directory Filters
- US-037: Directory Sorting
- US-038: Lawyer Card Component
- US-039: Directory Pagination / Infinite Scroll

#### Sprint 06 — Appointment Booking (EP-06 core)
- US-049: Appointment Slot Selection
- US-050: Appointment Creation & Confirmation
- US-051: Appointment Cancellation
- US-052: Appointment Status Tracking
- US-053: Video Consultation Interface
- US-054: Appointment History

#### Sprint 07 — Payments & Notifications (EP-07 + EP-10 basic)
- US-060: Payment Method Setup
- US-061: Payment Processing
- US-062: Payment Receipt / Invoice
- US-077: Email Notifications
- US-078: Push Notifications

### 🎯 MVP Launch

MVP scope: ~28 User Stories across 7 EPICs. See `Product-Backlog.md` for full details.

### 📋 Post-MVP (Sprint 08 → Sprint 10)

#### Sprint 08 — Reviews & Enhanced Appointments
- EP-08: US-067→071 (Reviews & Ratings)
- EP-06: US-055→058 (Rescheduling, reminders, audio, calendar view)

#### Sprint 09 — Account Enhancement & Payment Operations
- EP-02: US-024→027 (Email verification, forgot/reset password, logout, phone auth)
- EP-07: US-063→065 (Refunds, payouts, payment history)

#### Sprint 10 — Full Admin & Enhanced Notifications
- EP-11: US-083→087 (Dashboard, user management, moderation, disputes)
- EP-10: US-079→080 (In-app notification center, preferences)

### 🔮 Future (Sprint 11+)

#### Sprint 11+ — Q&A, Directory Enhancements, Subscriptions
- EP-09: US-072→076 (Questions & Answers)
- EP-04: US-040→041 (Map view, favorites)
- EP-07: US-066 (Subscription plans)

#### Sprint 12+ — AI Features
- EP-12: US-089→093 (AI matching, assistant, summaries, document analysis, translation)

---

## MVP Scope Summary

| EPIC | User Stories | Status |
|---|---|---|
| EP-02 Account Management | US-021, US-022, US-023 | ✅ Done |
| EP-03 Professional Onboarding | US-028 → US-034 | Planned (Sprint 03) |
| EP-04 Public Directory | US-035 → US-039 | Planned (Sprint 05) |
| EP-05 Professional Profile | US-042 → US-046 | Planned (Sprint 04) |
| EP-06 Appointment Booking | US-049 → US-054 | Planned (Sprint 06) |
| EP-07 Payments | US-060 → US-062 | Planned (Sprint 07) |
| EP-10 Notifications | US-077, US-078 | Planned (Sprint 07) |
| EP-11 Administration | US-082 | Planned (Sprint 03) |

---

*This roadmap is the single source of truth for sprint planning. Updated at each sprint boundary.*
