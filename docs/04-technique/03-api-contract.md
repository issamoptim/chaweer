# 03 — API Contract Specification

> **Phase:** 3.3 — API Contract Specification
> **Status:** Draft — awaiting validation
> **Date:** 2026-07-21
> **Prerequisites:**
> - UX Phase validated and frozen
> - Technical Design Blueprint approved
> - Architecture Document approved
> - Prisma Schema Evolution approved
>
> **Mandatory principles applied:** P1 (DDD), P2 (API-First), P4 (Incremental Migration), P5 (Separation of Responsibilities), P6 (Future Extensibility), P7 (Backward Compatibility), P8 (Documentation Quality)

---

## Table of Contents

1. [Conventions](#1-conventions)
2. [Error Handling](#2-error-handling)
3. [Versioning Strategy](#3-versioning-strategy)
4. [Authentication Overview](#4-authentication-overview)
5. [Existing Endpoints (Preserved)](#5-existing-endpoints-preserved)
6. [Evolved Endpoints](#6-evolved-endpoints)
7. [New Endpoints — Contact](#7-new-endpoints--contact)
8. [New Endpoints — Office](#8-new-endpoints--office)
9. [New Endpoints — Consultation Offers](#9-new-endpoints--consultation-offers)
10. [New Endpoints — Publication](#10-new-endpoints--publication)
11. [New Endpoints — Public Profile](#11-new-endpoints--public-profile)
12. [Next-Phase Endpoints — Education](#12-next-phase-endpoints--education)
13. [Next-Phase Endpoints — Experience](#13-next-phase-endpoints--experience)
14. [Next-Phase Endpoints — Certifications](#14-next-phase-endpoints--certifications)
15. [Next-Phase Endpoints — Memberships](#15-next-phase-endpoints--memberships)
16. [Next-Phase Endpoints — Verification](#16-next-phase-endpoints--verification)
17. [Future Compatibility](#17-future-compatibility)
18. [Response Type Reference](#18-response-type-reference)

---

## 1. Conventions

### 1.1 Naming

| Rule | Convention | Example |
|---|---|---|
| Resource names | Plural, lowercase, kebab-case | `/professional/offers`, `/professionals/:id` |
| Path parameters | camelCase | `:id`, `:offerId` |
| Query parameters | camelCase | `?page=1&limit=20` |
| JSON fields | camelCase | `professionalTitle`, `publishedAt` |
| Enums | UPPER_SNAKE_CASE | `DRAFT`, `PENDING_VERIFICATION` |
| Error codes | UPPER_SNAKE_CASE | `VALIDATION_ERROR`, `NOT_FOUND` |

**Why camelCase for JSON?** (P7, P8)

The existing API already uses camelCase for JSON fields (`firstName`, `lastName`, `photoUrl`). Changing to snake_case would break existing clients (P7). camelCase is also the JavaScript/TypeScript convention, which is the primary consumer.

### 1.2 HTTP Methods

| Method | Usage | Idempotent? |
|---|---|---|
| `GET` | Read a resource or list | Yes |
| `POST` | Create a resource | No |
| `PATCH` | Partial update of a resource | No |
| `PUT` | Full replacement of a resource | Yes |
| `DELETE` | Delete a resource | Yes |

**Why PATCH for partial updates?** (P8)

PATCH sends only the fields being modified. PUT requires sending the entire resource. For editable cards where the user changes one field at a time, PATCH is more efficient and less error-prone.

**Why PUT for expertise?** (P8)

Expertise is a single entity with three arrays (specializations, practiceAreas, languages). They are always saved together as a complete set. PUT replaces the entire expertise, which is the correct semantic — the user selects a new set of specializations, not "adds one."

### 1.3 Response Envelope

All responses use a consistent envelope:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { ... }
  }
}
```

**Why an envelope?** (P2, P8)

The frontend API client can check `success` as a boolean, then either access `data` or `error`. This eliminates ambiguity and simplifies error handling. The existing API already uses this format (P7).

### 1.4 Pagination

List endpoints use cursor-based pagination:

**Request:**
```
GET /professional/offers?limit=20&cursor=abc123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "nextCursor": "def456",
    "hasMore": true
  }
}
```

| Parameter | Type | Default | Max | Purpose |
|---|---|---|---|---|
| `limit` | number | 20 | 100 | Number of items per page |
| `cursor` | string? | null | — | Opaque cursor for next page |

**Why cursor-based instead of offset?** (P6, P8)

Cursor pagination is stable under inserts/deletes. If a new item is added while the user is paginating, offset pagination would skip or duplicate items. Cursor pagination is also more performant on large datasets (no `OFFSET` clause).

For MVP, most lists (offers, education, experience) will be small enough that pagination is optional. The cursor is included in the contract for future-proofing (P6).

### 1.5 Filtering & Sorting

| Parameter | Format | Example |
|---|---|---|
| Filter | `filter[field]=value` | `filter[active]=true` |
| Sort | `sort=field` or `sort=-field` (descending) | `sort=-order` |

**Why this format?** (P6, P8)

Bracket notation for filters allows multiple filter values (`filter[active]=true&filter[modality]=VIDEO`). The minus prefix for descending sort is a common API convention (e.g., Stripe, GitHub). These patterns are designed to scale to the future directory search (EP-04) without redesign (P6).

### 1.6 Status Codes

| Code | Meaning | When |
|---|---|---|
| `200 OK` | Success (GET, PATCH, PUT, DELETE) | Resource found and operated on |
| `201 Created` | Success (POST) | Resource created |
| `204 No Content` | Success (DELETE) | Resource deleted, no body |
| `400 Bad Request` | Validation error | Zod validation fails |
| `401 Unauthorized` | Auth missing or invalid | No JWT, expired JWT |
| `403 Forbidden` | Auth valid but insufficient permissions | Client trying to access professional endpoint |
| `404 Not Found` | Resource not found | Profile, offer, education entry not found |
| `409 Conflict` | State conflict | Publishing a profile that doesn't meet pre-conditions |
| `429 Too Many Requests` | Rate limit exceeded | Auth endpoints |
| `500 Internal Server Error` | Unhandled error | Server bug |

---

## 2. Error Handling

### 2.1 Standard Error Codes

| Code | HTTP | When | Details |
|---|---|---|---|
| `VALIDATION_ERROR` | 400 | Request body/params fail Zod validation | `details.fields[]` with per-field errors |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT | No details |
| `FORBIDDEN` | 403 | User lacks required role or ownership | `details.reason` |
| `NOT_FOUND` | 404 | Resource not found | `details.resource` |
| `CONFLICT` | 409 | Business rule violation or state conflict | `details.reason` |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | `details.retryAfter` (seconds) |
| `INTERNAL_ERROR` | 500 | Unhandled server error | `details.requestId` for tracing |

### 2.2 Validation Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": [
        { "field": "price", "message": "Le tarif doit être supérieur à 0" },
        { "field": "durationMinutes", "message": "Durée invalide" }
      ]
    }
  }
}
```

**Why per-field errors?** (P3, P8)

The frontend form can map each error back to the corresponding input field. This enables inline validation feedback without parsing free-text error messages.

### 2.3 Business Error Format

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Cannot publish profile: expertise is incomplete",
    "details": {
      "reason": "PUBLISH_PRECONDITIONS_NOT_MET",
      "missing": ["expertise", "offer"]
    }
  }
}
```

**Why structured details?** (P8)

The frontend can programmatically react to business errors. For example, if publishing fails because expertise is missing, the frontend can navigate the user to the Expertise page.

---

## 3. Versioning Strategy

### 3.1 Current Approach: No Version Prefix

The MVP API has no version prefix (`/professional/me`, not `/v1/professional/me`). This is intentional:

- Changes are additive (P4, P7) — new fields are nullable, new endpoints are separate
- No existing external clients to break
- Adding a prefix later is a backward-compatible change (redirect `/professional/me` → `/v1/professional/me`)

### 3.2 Future Versioning: URL Prefix

When the API gains external consumers or makes breaking changes:

```
/v1/professional/me     ← existing clients
/v2/professional/me     ← new clients with breaking changes
```

**Migration path:**

1. Add `/v1` prefix to all routes
2. Keep unversioned routes as aliases for `/v1` (backward compatible)
3. When breaking changes are needed, create `/v2` routes
4. Deprecate unversioned aliases
5. Remove unversioned aliases after deprecation period

**Why URL prefix over header-based?** (P8)

URL prefix is visible, cacheable, and testable. Header-based versioning (`Accept: application/vnd.chaweer.v1+json`) is invisible in browser dev tools and harder to test with curl. URL prefix is the most developer-friendly approach.

### 3.3 Breaking Change Policy

A change is **breaking** if:

- An existing field is removed from a response
- An existing field's type changes
- An existing endpoint's URL changes
- An existing endpoint's method changes
- An existing error code's meaning changes

A change is **non-breaking** (additive) if:

- A new field is added to a response (nullable)
- A new endpoint is added
- A new optional field is added to a request body
- A new error code is added

**All changes in the MVP phase are non-breaking** (P4, P7).

---

## 4. Authentication Overview

### 4.1 Token Model

| Token | Lifetime | Storage | Purpose |
|---|---|---|---|
| Access Token (JWT) | 15 minutes | `Authorization: Bearer <token>` header | API authentication |
| Refresh Token | 30 days | HTTP-only cookie (`refresh_token`) | Obtain new access tokens |

### 4.2 Auth Header

All authenticated endpoints require:

```
Authorization: Bearer <access-token>
```

### 4.3 Role-Based Authorization

| Role | Access |
|---|---|
| `CLIENT` | `/auth/*`, `/profile/*`, `/professionals/:id` (public) |
| `PROFESSIONAL` | `/auth/*`, `/profile/*`, `/professional/*`, `/professionals/:id` (public) |
| `ADMIN` | All of the above + `/admin/*` (future) |

### 4.4 Ownership Enforcement

For all `/professional/*` endpoints, the service layer verifies that the resource being accessed belongs to the authenticated user's profile. This is done by:

1. Extract `userId` from JWT
2. Resolve `profileId` from `userId` (ProfessionalProfile where userId = ?)
3. Verify the resource's `profileId` matches

**Why not just pass `profileId` in the URL?** (P5, P8)

Passing `profileId` in the URL would allow IDOR attacks (a user could guess another user's profileId). The `profileId` is always derived from the JWT, never from the request.

---

## 5. Existing Endpoints (Preserved)

These endpoints exist in the current API and remain unchanged (P7).

### 5.1 Auth Endpoints

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/auth/register` | POST | No | Register a new client user |
| `/auth/register/professional` | POST | No | Register a new professional user |
| `/auth/login` | POST | No | Login with email + password |
| `/auth/google/client` | POST | No | Google OAuth for clients |
| `/auth/google/professional` | POST | No | Google OAuth for professionals |
| `/auth/refresh` | POST | Cookie | Refresh access token |
| `/auth/logout` | POST | Cookie | Revoke refresh token |
| `/auth/me` | GET | Yes | Get current user info |
| `/auth/password` | PATCH | Yes | Change password |
| `/auth/account` | DELETE | Yes | Delete account |

### 5.2 Profile Endpoints (Client-Side)

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/profile` | GET | Yes | Get user profile (client) |
| `/profile` | PATCH | Yes | Update user profile (client) |
| `/profile/preferences` | PATCH | Yes | Update notification preferences |

### 5.3 Referential Endpoint

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/professional/referential` | GET | Yes (PROFESSIONAL) | Get reference data (specializations, languages, bar associations, cities) |

**Response:**
```json
{
  "success": true,
  "data": {
    "specializations": [
      {
        "id": "abc",
        "key": "droit-affaires",
        "name": "Droit des affaires",
        "practiceAreas": [
          { "id": "def", "key": "creation-entreprise", "name": "Création d'entreprise" }
        ]
      }
    ],
    "languages": [
      { "id": "ghi", "code": "fr", "name": "Français" }
    ],
    "barAssociations": [
      { "id": "jkl", "key": "casablanca", "name": "Barreau de Casablanca" }
    ],
    "cities": [
      { "id": "mno", "key": "casablanca", "name": "Casablanca" }
    ]
  }
}
```

### 5.4 Photo Upload

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/professional/upload-photo` | POST | Yes (PROFESSIONAL) | Upload profile photo |

**Request:** `multipart/form-data` with `photo` field

**Response:**
```json
{
  "success": true,
  "data": {
    "photoUrl": "/uploads/abc123.jpg"
  }
}
```

---

## 6. Evolved Endpoints

### 6.1 GET /professional/me

**Description:** Get the authenticated professional's full profile with all nested entities and completion status.

**Authentication:** Yes (PROFESSIONAL)

**Authorization:** User must have role `PROFESSIONAL`. Profile is resolved from JWT.

**Idempotency:** Yes (read-only)

**Rate Limiting:** 100 requests / 15 minutes

---

**Request:**

- No path parameters
- No query parameters
- No request body

---

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "profile-001",
    "status": "DRAFT",
    "publishedAt": null,
    "unpublishedAt": null,
    "identity": {
      "firstName": "Amina",
      "lastName": "El Fassi",
      "professionalTitle": "Avocate en droit des affaires",
      "photoUrl": "/uploads/abc.jpg",
      "barAssociationId": "bar-casablanca"
    },
    "biography": {
      "bio": "Avocate passionnée par le droit des affaires..."
    },
    "contact": {
      "phone": "+212 6 12 34 56 78",
      "whatsapp": null,
      "publicEmail": null,
      "website": null,
      "linkedInUrl": null
    },
    "office": {
      "name": "Cabinet El Fassi & Associés",
      "address": "12 rue de la Liberté",
      "cityId": "city-casablanca",
      "googleMapsUrl": null,
      "latitude": null,
      "longitude": null
    },
    "expertise": {
      "specializationIds": ["spec-001"],
      "practiceAreaIds": ["pa-001", "pa-002"],
      "languageIds": ["lang-fr", "lang-ar", "lang-en"]
    },
    "offers": [
      {
        "id": "offer-001",
        "title": "Consultation juridique",
        "description": null,
        "price": 300,
        "currency": "MAD",
        "durationMinutes": 30,
        "modalities": ["VIDEO"],
        "active": true,
        "order": 0
      }
    ],
    "education": [],
    "experience": [],
    "certifications": [],
    "memberships": [],
    "verification": null,
    "completion": {
      "identity": true,
      "biography": true,
      "contact": true,
      "office": true,
      "expertise": true,
      "offer": true,
      "education": false,
      "experience": false,
      "certifications": false,
      "memberships": false
    }
  }
}
```

**Backward Compatibility:** (P7)

The response shape is evolved from the current flat structure to a nested structure. The old fields (`firstName`, `lastName`, `photoUrl`, `professionalPhone`, `officeAddress`, `cityId`, `bio`, `offer`) are now nested under `identity`, `contact`, `office`, `biography`, `offers`. This is a **breaking change** for the frontend, but since the frontend is being rebuilt, it is acceptable. The old `/professional/offer` PUT endpoint is preserved during transition.

---

**Error Responses:**

| Code | HTTP | When |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | User is not a PROFESSIONAL |
| `NOT_FOUND` | 404 | User has no professional profile |
| `INTERNAL_ERROR` | 500 | Server error |

---

**Business Rules:**

- **Preconditions:** User must have a ProfessionalProfile (created during registration)
- **Side effects:** None (read-only)
- **State transitions:** None
- **Audit:** None

---

### 6.2 PATCH /professional/profile

**Description:** Update identity and biography fields on the professional profile.

**Authentication:** Yes (PROFESSIONAL)

**Authorization:** User must own the profile.

**Idempotency:** No (partial update)

**Rate Limiting:** 100 requests / 15 minutes

---

**Request Body:**

```json
{
  "professionalTitle": "Avocate en droit des affaires",
  "bio": "Avocate passionnée par le droit des affaires et le droit fiscal...",
  "barAssociationId": "bar-casablanca"
}
```

**Validation Rules (Zod schema `updateProfileSchema`):**

| Field | Type | Constraints |
|---|---|---|
| `professionalTitle` | string? | max 120, trimmed, optional |
| `bio` | string? | max 600, trimmed, nullable, optional |
| `barAssociationId` | string? | min 1, nullable, optional — must exist in BarAssociation |

**At least one field must be provided.**

**Why only identity + biography here?** (P1, P5)

Contact and Office have their own endpoints (`PATCH /professional/contact`, `PATCH /professional/office`). This separation follows the domain model — each entity has its own mutation endpoint. The profile endpoint handles only fields that belong to the aggregate root itself (title, bio, bar association).

---

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "profile-001",
    "status": "DRAFT",
    "publishedAt": null,
    "identity": {
      "firstName": "Amina",
      "lastName": "El Fassi",
      "professionalTitle": "Avocate en droit des affaires",
      "photoUrl": "/uploads/abc.jpg",
      "barAssociationId": "bar-casablanca"
    },
    "biography": {
      "bio": "Avocate passionnée par le droit des affaires..."
    }
  }
}
```

**Why return only identity + biography?** (P8)

The response contains only the fields that could have changed. The frontend already has the full profile from `GET /professional/me` and can merge this partial response. This keeps responses small and focused.

---

**Error Responses:**

| Code | HTTP | When |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Field validation fails |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | User is not a PROFESSIONAL |
| `NOT_FOUND` | 404 | Profile not found |
| `CONFLICT` | 409 | `barAssociationId` does not exist |
| `INTERNAL_ERROR` | 500 | Server error |

---

**Business Rules:**

- **Preconditions:** Profile must exist
- **Business rules:** `barAssociationId` must reference an active BarAssociation
- **Side effects:** `updatedAt` is set on ProfessionalProfile
- **State transitions:** None (does not change publication status)
- **Audit:** `updatedAt` timestamp

---

### 6.3 PUT /professional/expertise

**Description:** Replace the professional's expertise (specializations, practice areas, languages).

**Authentication:** Yes (PROFESSIONAL)

**Authorization:** User must own the profile.

**Idempotency:** Yes (full replacement)

**Rate Limiting:** 100 requests / 15 minutes

---

**Request Body:**

```json
{
  "specializationIds": ["spec-001", "spec-002"],
  "practiceAreaIds": ["pa-001", "pa-002", "pa-003"],
  "languageIds": ["lang-fr", "lang-ar"]
}
```

**Validation Rules (Zod schema `updateExpertiseSchema`):**

| Field | Type | Constraints |
|---|---|---|
| `specializationIds` | string[] | min 1, each must exist in Specialization |
| `practiceAreaIds` | string[] | min 1, each must belong to a selected specialization |
| `languageIds` | string[] | min 1, each must exist in Language |

**Why PUT instead of PATCH?** (P8)

Expertise is three arrays that are always saved together. The user selects a new set of specializations from toggle cards — this is a full replacement, not an incremental add. PUT correctly represents this semantic.

---

**Response (200):**

```json
{
  "success": true,
  "data": {
    "specializationIds": ["spec-001", "spec-002"],
    "practiceAreaIds": ["pa-001", "pa-002", "pa-003"],
    "languageIds": ["lang-fr", "lang-ar"]
  }
}
```

---

**Error Responses:**

| Code | HTTP | When |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Array is empty, or IDs don't exist |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | User is not a PROFESSIONAL |
| `NOT_FOUND` | 404 | Profile not found |
| `CONFLICT` | 409 | Practice area does not belong to selected specialization |
| `INTERNAL_ERROR` | 500 | Server error |

---

**Business Rules:**

- **Preconditions:** Profile must exist
- **Business rules:** Every `practiceAreaId` must belong to at least one of the selected `specializationIds`
- **Side effects:** Join tables (`ProfessionalSpecialization`, `ProfessionalPracticeArea`, `ProfessionalLanguage`) are rebuilt (delete all, insert new)
- **State transitions:** None
- **Audit:** `updatedAt` on ProfessionalProfile

---

### 6.4 Deprecated: PUT /professional/offer

**Status:** Deprecated (P7). Preserved during transition. Will be removed in Phase C.

**Description:** Update the single consultation offer (legacy 1:1).

**Backward Compatibility:** This endpoint continues to work. It updates the first offer in the 1:N collection. The frontend should migrate to the new 1:N endpoints (Section 9).

**Deprecation timeline:**

1. MVP: Endpoint preserved, updates first offer
2. Phase C: Endpoint removed

---

## 7. New Endpoints — Contact

### 7.1 GET /professional/contact

**Description:** Get the professional's contact information.

| Property | Value |
|---|---|
| Auth | Yes (PROFESSIONAL) |
| Authorization | Must own profile |
| Idempotency | Yes |
| Rate Limit | 100 / 15min |

**Request:** No body, no params.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "phone": "+212 6 12 34 56 78",
    "whatsapp": null,
    "publicEmail": null,
    "website": null,
    "linkedInUrl": null
  }
}
```

**If no contact record exists:**
```json
{
  "success": true,
  "data": null
}
```

**Business Rules:**
- If no ProfessionalContact record exists, return `null` (the frontend shows an empty state)
- **Side effects:** None
- **Audit:** None

---

### 7.2 PATCH /professional/contact

**Description:** Update contact information. Creates the record if it doesn't exist (upsert).

| Property | Value |
|---|---|
| Auth | Yes (PROFESSIONAL) |
| Authorization | Must own profile |
| Idempotency | No |
| Rate Limit | 100 / 15min |

**Request Body:**
```json
{
  "phone": "+212 6 12 34 56 78"
}
```

**Validation Rules (Zod schema `updateContactSchema`):**

| Field | Type | Constraints | Version |
|---|---|---|---|
| `phone` | string? | max 30, trimmed, nullable, optional | MVP |
| `whatsapp` | string? | max 30, trimmed, nullable, optional | Next |
| `publicEmail` | string? | max 255, email format, nullable, optional | Next |
| `website` | string? | max 500, URL format, nullable, optional | Next |
| `linkedInUrl` | string? | max 500, URL format, nullable, optional | Next |

**At least one field must be provided.**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "phone": "+212 6 12 34 56 78",
    "whatsapp": null,
    "publicEmail": null,
    "website": null,
    "linkedInUrl": null
  }
}
```

**Error Responses:**

| Code | HTTP | When |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Invalid phone format, invalid email |
| `UNAUTHORIZED` | 401 | Missing JWT |
| `FORBIDDEN` | 403 | Not a PROFESSIONAL |
| `NOT_FOUND` | 404 | Profile not found |
| `INTERNAL_ERROR` | 500 | Server error |

**Business Rules:**
- **Preconditions:** Profile must exist
- **Side effects:** Creates ProfessionalContact if not exists, updates if exists. Sets `updatedAt` on ProfessionalProfile.
- **State transitions:** None
- **Audit:** `updatedAt` timestamp

---

## 8. New Endpoints — Office

### 8.1 GET /professional/office

**Description:** Get the professional's office information.

| Property | Value |
|---|---|
| Auth | Yes (PROFESSIONAL) |
| Authorization | Must own profile |
| Idempotency | Yes |
| Rate Limit | 100 / 15min |

**Request:** No body, no params.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "name": "Cabinet El Fassi & Associés",
    "address": "12 rue de la Liberté",
    "cityId": "city-casablanca",
    "googleMapsUrl": null,
    "latitude": null,
    "longitude": null
  }
}
```

**If no office record exists:**
```json
{
  "success": true,
  "data": null
}
```

---

### 8.2 PATCH /professional/office

**Description:** Update office information. Creates the record if it doesn't exist (upsert).

| Property | Value |
|---|---|
| Auth | Yes (PROFESSIONAL) |
| Authorization | Must own profile |
| Idempotency | No |
| Rate Limit | 100 / 15min |

**Request Body:**
```json
{
  "name": "Cabinet El Fassi & Associés",
  "address": "12 rue de la Liberté",
  "cityId": "city-casablanca"
}
```

**Validation Rules (Zod schema `updateOfficeSchema`):**

| Field | Type | Constraints | Version |
|---|---|---|---|
| `name` | string? | max 200, trimmed, nullable, optional | MVP |
| `address` | string? | max 255, trimmed, nullable, optional | MVP |
| `cityId` | string? | min 1, nullable, optional — must exist in City | MVP |
| `googleMapsUrl` | string? | max 1000, URL format, nullable, optional | Next |
| `latitude` | number? | float, nullable, optional | Next |
| `longitude` | number? | float, nullable, optional | Next |

**At least one field must be provided.**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "name": "Cabinet El Fassi & Associés",
    "address": "12 rue de la Liberté",
    "cityId": "city-casablanca",
    "googleMapsUrl": null,
    "latitude": null,
    "longitude": null
  }
}
```

**Error Responses:**

| Code | HTTP | When |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Invalid URL, field too long |
| `UNAUTHORIZED` | 401 | Missing JWT |
| `FORBIDDEN` | 403 | Not a PROFESSIONAL |
| `NOT_FOUND` | 404 | Profile not found, or `cityId` does not exist |
| `INTERNAL_ERROR` | 500 | Server error |

**Business Rules:**
- **Preconditions:** Profile must exist
- **Business rules:** `cityId` must reference an active City
- **Side effects:** Creates Office if not exists, updates if exists. Sets `updatedAt` on ProfessionalProfile.
- **State transitions:** None
- **Audit:** `updatedAt` timestamp

---

## 9. New Endpoints — Consultation Offers

### 9.1 GET /professional/offers

**Description:** List all consultation offers for the authenticated professional.

| Property | Value |
|---|---|
| Auth | Yes (PROFESSIONAL) |
| Authorization | Must own profile |
| Idempotency | Yes |
| Rate Limit | 100 / 15min |

**Query Parameters:**

| Parameter | Type | Default | Purpose |
|---|---|---|---|
| `filter[active]` | boolean? | null | Filter by active status |
| `sort` | string? | `order` | Sort field (`order`, `-order`, `price`, `-price`) |
| `limit` | number? | 20 | Max 100 |
| `cursor` | string? | null | Pagination cursor |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "offer-001",
        "title": "Consultation juridique",
        "description": null,
        "price": 300,
        "currency": "MAD",
        "durationMinutes": 30,
        "modalities": ["VIDEO"],
        "active": true,
        "order": 0
      },
      {
        "id": "offer-002",
        "title": "Suivi de dossier",
        "description": null,
        "price": 150,
        "currency": "MAD",
        "durationMinutes": 15,
        "modalities": ["VIDEO"],
        "active": true,
        "order": 1
      }
    ],
    "nextCursor": null,
    "hasMore": false
  }
}
```

---

### 9.2 POST /professional/offers

**Description:** Create a new consultation offer.

| Property | Value |
|---|---|
| Auth | Yes (PROFESSIONAL) |
| Authorization | Must own profile |
| Idempotency | No |
| Rate Limit | 100 / 15min |

**Request Body:**
```json
{
  "title": "Consultation juridique",
  "price": 300,
  "durationMinutes": 30,
  "modalities": ["VIDEO"]
}
```

**Validation Rules (Zod schema `createOfferSchema`):**

| Field | Type | Constraints |
|---|---|---|
| `title` | string | min 1, max 200, trimmed, required |
| `description` | string? | max 500, trimmed, nullable, optional [Next] |
| `price` | number | int, positive, required |
| `durationMinutes` | number | one of [15, 30, 45, 60], required |
| `modalities` | string[] | min 1, enum [VIDEO, OFFICE], required |
| `active` | boolean? | default true, optional |
| `order` | number? | int, default 0, optional |

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "offer-003",
    "title": "Consultation juridique",
    "description": null,
    "price": 300,
    "currency": "MAD",
    "durationMinutes": 30,
    "modalities": ["VIDEO"],
    "active": true,
    "order": 0
  }
}
```

**Error Responses:**

| Code | HTTP | When |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Missing required fields, invalid duration, invalid modality |
| `UNAUTHORIZED` | 401 | Missing JWT |
| `FORBIDDEN` | 403 | Not a PROFESSIONAL |
| `NOT_FOUND` | 404 | Profile not found |
| `INTERNAL_ERROR` | 500 | Server error |

**Business Rules:**
- **Preconditions:** Profile must exist
- **Side effects:** Creates ConsultationOffer. Sets `updatedAt` on ProfessionalProfile.
- **State transitions:** None
- **Audit:** `createdAt`, `updatedAt` on the offer

---

### 9.3 PUT /professional/offers/:offerId

**Description:** Update an existing consultation offer (full replacement).

| Property | Value |
|---|---|
| Auth | Yes (PROFESSIONAL) |
| Authorization | Must own the offer (offer.profileId === profile.id) |
| Idempotency | Yes |
| Rate Limit | 100 / 15min |

**Path Parameters:**

| Parameter | Type | Purpose |
|---|---|---|
| `offerId` | string | The offer's ID |

**Request Body:**
```json
{
  "title": "Consultation juridique",
  "price": 350,
  "durationMinutes": 45,
  "modalities": ["VIDEO", "OFFICE"],
  "active": true,
  "order": 0
}
```

**Validation Rules:** Same as `createOfferSchema`, all fields required (PUT = full replacement).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "offer-001",
    "title": "Consultation juridique",
    "description": null,
    "price": 350,
    "currency": "MAD",
    "durationMinutes": 45,
    "modalities": ["VIDEO", "OFFICE"],
    "active": true,
    "order": 0
  }
}
```

**Error Responses:**

| Code | HTTP | When |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Invalid fields |
| `UNAUTHORIZED` | 401 | Missing JWT |
| `FORBIDDEN` | 403 | Not a PROFESSIONAL or offer belongs to another profile |
| `NOT_FOUND` | 404 | Offer not found |
| `INTERNAL_ERROR` | 500 | Server error |

**Business Rules:**
- **Preconditions:** Offer must exist and belong to the authenticated profile
- **Side effects:** Updates offer. Sets `updatedAt` on ProfessionalProfile.
- **Audit:** `updatedAt` on the offer

---

### 9.4 DELETE /professional/offers/:offerId

**Description:** Delete a consultation offer.

| Property | Value |
|---|---|
| Auth | Yes (PROFESSIONAL) |
| Authorization | Must own the offer |
| Idempotency | Yes |
| Rate Limit | 100 / 15min |

**Response (204):** No content.

**Error Responses:**

| Code | HTTP | When |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing JWT |
| `FORBIDDEN` | 403 | Not a PROFESSIONAL or offer belongs to another profile |
| `NOT_FOUND` | 404 | Offer not found |
| `INTERNAL_ERROR` | 500 | Server error |

**Business Rules:**
- **Preconditions:** Offer must exist and belong to the authenticated profile
- **Side effects:** Deletes ConsultationOffer. Sets `updatedAt` on ProfessionalProfile.
- **Audit:** `updatedAt` on ProfessionalProfile

---

### 9.5 PATCH /professional/offers/:offerId/toggle

**Description:** Activate or deactivate an offer without deleting it.

| Property | Value |
|---|---|
| Auth | Yes (PROFESSIONAL) |
| Authorization | Must own the offer |
| Idempotency | No |
| Rate Limit | 100 / 15min |

**Request Body:**
```json
{
  "active": false
}
```

**Validation Rules:**

| Field | Type | Constraints |
|---|---|---|
| `active` | boolean | required |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "offer-001",
    "active": false
  }
}
```

**Why a separate toggle endpoint?** (P8)

Toggling active/inactive is a common action that doesn't require sending the full offer body. A dedicated endpoint keeps the request small and the intent clear. It also allows different rate limiting if needed.

---

## 10. New Endpoints — Publication

### 10.1 POST /professional/publish

**Description:** Submit the profile for verification/publication. Changes status from DRAFT or UNPUBLISHED to PENDING_VERIFICATION.

| Property | Value |
|---|---|
| Auth | Yes (PROFESSIONAL) |
| Authorization | Must own profile |
| Idempotency | No |
| Rate Limit | 10 / 15min |

**Request:** No body.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "PENDING_VERIFICATION",
    "publishedAt": null
  }
}
```

**Error Responses:**

| Code | HTTP | When |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing JWT |
| `FORBIDDEN` | 403 | Not a PROFESSIONAL |
| `NOT_FOUND` | 404 | Profile not found |
| `CONFLICT` | 409 | Pre-conditions not met (see below) |
| `INTERNAL_ERROR` | 500 | Server error |

**Business Rules:**

- **Preconditions (MVP — blocking):**
  - `completion.identity === true` (firstName + lastName required)
  - `completion.expertise === true` (at least 1 specialization, 1 practice area, 1 language)
  - `completion.offer === true` (at least 1 active offer with price > 0 and modalities)

- **Preconditions (Next — warning, not blocking):**
  - `completion.biography === true`
  - `completion.contact === true`
  - `completion.office === true`
  - `photoUrl !== null`

- **State transitions:**
  - `DRAFT → PENDING_VERIFICATION` ✅
  - `UNPUBLISHED → PENDING_VERIFICATION` ✅
  - `PENDING_VERIFICATION → PENDING_VERIFICATION` ✅ (idempotent — no error)
  - `PUBLISHED → PUBLISHED` ✅ (idempotent — no error, returns current status)

- **Conflict response (pre-conditions not met):**
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Cannot publish: profile is incomplete",
    "details": {
      "reason": "PUBLISH_PRECONDITIONS_NOT_MET",
      "missing": ["expertise", "offer"]
    }
  }
}
```

- **Side effects:** Sets `status = PENDING_VERIFICATION`. Does NOT set `publishedAt` (that happens when admin approves).
- **Audit:** `updatedAt` on ProfessionalProfile

**Why lower rate limit?** (P8)

Publishing is an infrequent action. A lower rate limit prevents accidental spam of verification requests.

---

### 10.2 POST /professional/unpublish

**Description:** Take a published profile offline. Changes status from PUBLISHED to UNPUBLISHED.

| Property | Value |
|---|---|
| Auth | Yes (PROFESSIONAL) |
| Authorization | Must own profile |
| Idempotency | No |
| Rate Limit | 10 / 15min |

**Request:** No body.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "UNPUBLISHED",
    "unpublishedAt": "2026-07-21T15:30:00.000Z"
  }
}
```

**Error Responses:**

| Code | HTTP | When |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing JWT |
| `FORBIDDEN` | 403 | Not a PROFESSIONAL |
| `NOT_FOUND` | 404 | Profile not found |
| `CONFLICT` | 409 | Profile is not PUBLISHED |
| `INTERNAL_ERROR` | 500 | Server error |

**Business Rules:**

- **Preconditions:** Profile must exist
- **State transitions:**
  - `PUBLISHED → UNPUBLISHED` ✅
  - `DRAFT → DRAFT` (idempotent — no error, returns current status)
  - `UNPUBLISHED → UNPUBLISHED` (idempotent — no error)
  - `PENDING_VERIFICATION → PENDING_VERIFICATION` (idempotent — no error)

- **Side effects:** Sets `status = UNPUBLISHED`, `unpublishedAt = now()`. Does NOT clear `publishedAt` (preserves history).
- **Audit:** `updatedAt`, `unpublishedAt` on ProfessionalProfile

**Why preserve `publishedAt`?** (P8)

`publishedAt` records when the profile was first published. This is useful for analytics, trust signals ("on Chaweer since 2026"), and debugging. Unpublishing should not erase history.

---

## 11. New Endpoints — Public Profile

### 11.1 GET /professionals/:id

**Description:** Get a professional's public profile. Only published profiles are accessible.

| Property | Value |
|---|---|
| Auth | No |
| Authorization | Profile must have `status = PUBLISHED` |
| Idempotency | Yes |
| Rate Limit | 60 / minute |

**Path Parameters:**

| Parameter | Type | Purpose |
|---|---|---|
| `id` | string | The professional profile's ID |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "profile-001",
    "identity": {
      "firstName": "Amina",
      "lastName": "El Fassi",
      "professionalTitle": "Avocate en droit des affaires",
      "photoUrl": "/uploads/abc.jpg"
    },
    "biography": {
      "bio": "Avocate passionnée par le droit des affaires..."
    },
    "barAssociation": {
      "id": "bar-casablanca",
      "name": "Barreau de Casablanca"
    },
    "office": {
      "name": "Cabinet El Fassi & Associés",
      "address": "12 rue de la Liberté",
      "city": {
        "id": "city-casablanca",
        "name": "Casablanca"
      },
      "googleMapsUrl": null,
      "latitude": null,
      "longitude": null
    },
    "expertise": {
      "specializations": [
        { "id": "spec-001", "name": "Droit des affaires" }
      ],
      "practiceAreas": [
        { "id": "pa-001", "name": "Création d'entreprise" },
        { "id": "pa-002", "name": "Fusions et acquisitions" }
      ],
      "languages": [
        { "id": "lang-fr", "name": "Français" },
        { "id": "lang-ar", "name": "Arabe" },
        { "id": "lang-en", "name": "Anglais" }
      ]
    },
    "offers": [
      {
        "id": "offer-001",
        "title": "Consultation juridique",
        "description": null,
        "price": 300,
        "currency": "MAD",
        "durationMinutes": 30,
        "modalities": ["VIDEO"]
      }
    ],
    "education": [],
    "experience": [],
    "certifications": [],
    "isVerified": false
  }
}
```

**What is excluded from the public response?** (P5, P7)

| Field | Reason |
|---|---|
| `userId` | Security — never expose internal user IDs |
| `contact.phone` | Privacy — phone is only shown to the professional themselves |
| `contact.whatsapp`, `publicEmail`, `website`, `linkedInUrl` | Privacy — only shown when professional chooses to share [Next] |
| `verification` details | Only a boolean `isVerified` is exposed |
| `status` | Internal field — not relevant to public viewers |
| `completion` | Internal to the professional |
| `unpublishedAt` | Internal |
| `memberships` | Not displayed on public profile (may change in future) |

**Why include `isVerified` as a boolean?** (P8)

The public profile shows a verification badge. We expose only a boolean — not the verification status enum, not the verifier, not the date. This is the minimum information needed for the UI.

---

**Error Responses:**

| Code | HTTP | When |
|---|---|---|
| `NOT_FOUND` | 404 | Profile not found OR profile is not PUBLISHED |
| `INTERNAL_ERROR` | 500 | Server error |

**Why 404 for unpublished profiles?** (P5, P8)

Returning 404 instead of 403 prevents information leakage. A 403 would reveal that a profile exists but is unpublished. A 404 gives no information about whether the profile exists.

---

### 11.2 GET /professionals/:id/offers

**Description:** Get a professional's active consultation offers (public view).

| Property | Value |
|---|---|
| Auth | No |
| Authorization | Profile must have `status = PUBLISHED` |
| Idempotency | Yes |
| Rate Limit | 60 / minute |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "offer-001",
        "title": "Consultation juridique",
        "description": null,
        "price": 300,
        "currency": "MAD",
        "durationMinutes": 30,
        "modalities": ["VIDEO"]
      }
    ],
    "nextCursor": null,
    "hasMore": false
  }
}
```

**Business Rules:**
- Only offers with `active = true` are returned
- Only published profiles are accessible
- `order` field is not exposed (items are already sorted by order)

---

## 12. Next-Phase Endpoints — Education

> **Version:** [Next] — Sprint 2
> These endpoints are documented now for completeness. Implementation is deferred.

### 12.1 GET /professional/education

| Property | Value |
|---|---|
| Auth | Yes (PROFESSIONAL) |
| Rate Limit | 100 / 15min |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "edu-001",
        "degree": "Master en Droit des Affaires",
        "institution": "Université Mohammed V",
        "startYear": 2017,
        "endYear": 2019,
        "description": null,
        "order": 0
      }
    ],
    "nextCursor": null,
    "hasMore": false
  }
}
```

### 12.2 POST /professional/education

**Request Body:**
```json
{
  "degree": "Master en Droit des Affaires",
  "institution": "Université Mohammed V",
  "startYear": 2017,
  "endYear": 2019,
  "description": "Spécialisation en droit fiscal",
  "order": 0
}
```

**Validation Rules:**

| Field | Type | Constraints |
|---|---|---|
| `degree` | string | min 1, max 200, required |
| `institution` | string | min 1, max 200, required |
| `startYear` | number | int, min 1950, max current year, required |
| `endYear` | number? | int, min 1950, max current year + 10, nullable, optional (null = ongoing) |
| `description` | string? | max 500, nullable, optional |
| `order` | number? | int, default 0, optional |

**Response (201):** Returns created education entry.

### 12.3 PUT /professional/education/:educationId

Full replacement. Same validation as POST. Returns updated entry.

### 12.4 DELETE /professional/education/:educationId

**Response (204):** No content.

**All education endpoints follow the same error format as offers (Section 9).**

---

## 13. Next-Phase Endpoints — Experience

> **Version:** [Next] — Sprint 2

### 13.1 GET /professional/experience

Same structure as education. Returns experience entries.

### 13.2 POST /professional/experience

**Validation Rules:**

| Field | Type | Constraints |
|---|---|---|
| `position` | string | min 1, max 200, required |
| `organization` | string | min 1, max 200, required |
| `startYear` | number | int, min 1950, max current year, required |
| `endYear` | number? | int, nullable, optional (null = current) |
| `current` | boolean? | default false, optional |
| `description` | string? | max 500, nullable, optional |
| `order` | number? | int, default 0, optional |

### 13.3 PUT /professional/experience/:experienceId

Full replacement. Same validation as POST.

### 13.4 DELETE /professional/experience/:experienceId

**Response (204):** No content.

---

## 14. Next-Phase Endpoints — Certifications

> **Version:** [Next] — Sprint 2

### 14.1 GET /professional/certifications

Same structure as education. Returns certification entries.

### 14.2 POST /professional/certifications

**Validation Rules:**

| Field | Type | Constraints |
|---|---|---|
| `title` | string | min 1, max 200, required |
| `issuer` | string | min 1, max 200, required |
| `issueYear` | number | int, min 1950, max current year, required |
| `expiryYear` | number? | int, nullable, optional |
| `credentialId` | string? | max 100, nullable, optional |
| `order` | number? | int, default 0, optional |

### 14.3 PUT /professional/certifications/:certificationId

Full replacement. Same validation as POST.

### 14.4 DELETE /professional/certifications/:certificationId

**Response (204):** No content.

---

## 15. Next-Phase Endpoints — Memberships

> **Version:** [Next] — Sprint 2

### 15.1 GET /professional/memberships

Same structure as education. Returns membership entries.

### 15.2 POST /professional/memberships

**Validation Rules:**

| Field | Type | Constraints |
|---|---|---|
| `organization` | string | min 1, max 200, required |
| `role` | string? | max 200, nullable, optional |
| `startYear` | number | int, min 1950, max current year, required |
| `endYear` | number? | int, nullable, optional |
| `order` | number? | int, default 0, optional |

### 15.3 PUT /professional/memberships/:membershipId

Full replacement. Same validation as POST.

### 15.4 DELETE /professional/memberships/:membershipId

**Response (204):** No content.

---

## 16. Next-Phase Endpoints — Verification

> **Version:** [Next] — Sprint 2

### 16.1 GET /professional/verification

**Description:** Get the professional's verification status.

| Property | Value |
|---|---|
| Auth | Yes (PROFESSIONAL) |
| Rate Limit | 100 / 15min |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "UNVERIFIED",
    "verifiedAt": null,
    "rejectionReason": null
  }
}
```

**If no verification record exists:**
```json
{
  "success": true,
  "data": {
    "status": "UNVERIFIED",
    "verifiedAt": null,
    "rejectionReason": null
  }
}
```

**Why return UNVERIFIED instead of null?** (P8)

Verification always has a state — if no record exists, the state is UNVERIFIED. This simplifies the frontend: it always receives a status enum, never null.

**What is excluded?** (P5)

`verifiedBy` (admin user ID) is not returned to the professional. This is internal information.

---

## 17. Future Compatibility

### 17.1 How Future Modules Fit Into the API

| Future Module | API Namespace | Auth | Impact on Existing API |
|---|---|---|---|
| **Messaging** | `/messages` | Yes | None — new namespace, new endpoints |
| **Reviews** | `/professionals/:id/reviews` (public), `/reviews` (auth) | Mixed | None — reads from Professional aggregate, writes to Review aggregate |
| **Payments** | `/payments`, `/payment-methods` | Yes | None — references ProfessionalProfile via `profileId` |
| **Notifications** | `/notifications` | Yes | None — new namespace |
| **Statistics** | `/professional/statistics` | Yes | None — read-only, computed from events |
| **AI Features** | `/ai/*` | Yes | None — calls external AI APIs, returns results |
| **Admin** | `/admin/*` | Yes (ADMIN) | None — separate namespace, separate auth |
| **Directory** | `/professionals` (list, search) | No | Extends public namespace with search/filter |

### 17.2 Naming Reserved for Future

| Path | Reserved For |
|---|---|
| `/professionals` (GET, list) | Directory search (EP-04) |
| `/professionals/:id/reviews` | Public reviews (EP-08) |
| `/professionals/:id/availability` | Public availability slots (EP-06) |
| `/appointments` | Appointment booking (EP-06) |
| `/payments` | Payment processing (EP-07) |
| `/messages` | Messaging (future) |
| `/notifications` | Notification center (EP-10) |
| `/admin/*` | Administration (EP-11) |
| `/ai/*` | AI features (EP-12) |

**Why reserve these now?** (P6, P8)

Reserving namespace prefixes prevents collision when future modules are added. A new developer can see that `/appointments` is reserved and won't accidentally create a conflicting endpoint.

### 17.3 Extensibility Patterns

**Adding a new child entity to the Professional aggregate:**

1. Create new endpoints: `GET /professional/<entity>`, `POST /professional/<entity>`, etc.
2. Add the entity to the `GET /professional/me` response
3. Add a completion field if relevant
4. No changes to existing endpoints (additive only — P4, P7)

**Adding a new aggregate (e.g., Appointments):**

1. Create new namespace: `/appointments`
2. Reference ProfessionalProfile by `id` (read-only from the appointment's perspective)
3. No changes to Professional endpoints
4. The appointment service calls the public API to read profile data (P2)

---

## 18. Response Type Reference

### 18.1 ProfessionalProfileResponse (GET /professional/me)

```typescript
interface ProfessionalProfileResponse {
  id: string;
  status: 'DRAFT' | 'PENDING_VERIFICATION' | 'PUBLISHED' | 'UNPUBLISHED';
  publishedAt: string | null;
  unpublishedAt: string | null;
  identity: {
    firstName: string;
    lastName: string;
    professionalTitle: string | null;
    photoUrl: string | null;
    barAssociationId: string | null;
  };
  biography: {
    bio: string | null;
  };
  contact: {
    phone: string | null;
    whatsapp: string | null;
    publicEmail: string | null;
    website: string | null;
    linkedInUrl: string | null;
  } | null;
  office: {
    name: string | null;
    address: string | null;
    cityId: string | null;
    googleMapsUrl: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
  expertise: {
    specializationIds: string[];
    practiceAreaIds: string[];
    languageIds: string[];
  };
  offers: ConsultationOfferResponse[];
  education: EducationResponse[];
  experience: ExperienceResponse[];
  certifications: CertificationResponse[];
  memberships: MembershipResponse[];
  verification: {
    status: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
    verifiedAt: string | null;
    rejectionReason: string | null;
  } | null;
  completion: ProfileCompletion;
}

interface ProfileCompletion {
  identity: boolean;
  biography: boolean;
  contact: boolean;
  office: boolean;
  expertise: boolean;
  offer: boolean;
  education: boolean;
  experience: boolean;
  certifications: boolean;
  memberships: boolean;
}

interface ConsultationOfferResponse {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  durationMinutes: number;
  modalities: ('VIDEO' | 'OFFICE')[];
  active: boolean;
  order: number;
}

interface EducationResponse {
  id: string;
  degree: string;
  institution: string;
  startYear: number;
  endYear: number | null;
  description: string | null;
  order: number;
}

interface ExperienceResponse {
  id: string;
  position: string;
  organization: string;
  startYear: number;
  endYear: number | null;
  current: boolean;
  description: string | null;
  order: number;
}

interface CertificationResponse {
  id: string;
  title: string;
  issuer: string;
  issueYear: number;
  expiryYear: number | null;
  credentialId: string | null;
  order: number;
}

interface MembershipResponse {
  id: string;
  organization: string;
  role: string | null;
  startYear: number;
  endYear: number | null;
  order: number;
}
```

### 18.2 PublicProfileResponse (GET /professionals/:id)

```typescript
interface PublicProfileResponse {
  id: string;
  identity: {
    firstName: string;
    lastName: string;
    professionalTitle: string | null;
    photoUrl: string | null;
  };
  biography: {
    bio: string | null;
  };
  barAssociation: { id: string; name: string } | null;
  office: {
    name: string | null;
    address: string | null;
    city: { id: string; name: string } | null;
    googleMapsUrl: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
  expertise: {
    specializations: { id: string; name: string }[];
    practiceAreas: { id: string; name: string }[];
    languages: { id: string; name: string }[];
  };
  offers: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    currency: string;
    durationMinutes: number;
    modalities: ('VIDEO' | 'OFFICE')[];
  }[];
  education: EducationResponse[];
  experience: ExperienceResponse[];
  certifications: CertificationResponse[];
  isVerified: boolean;
}
```

**Why different response types for authenticated vs public?** (P2, P5, P7)

The authenticated response includes IDs (for CRUD operations), completion status, verification details, and contact info. The public response includes resolved names (not IDs), only active offers, no contact info, and only a boolean verification flag. This separation enforces the security boundary at the type level (P5).

### 18.3 PaginatedResponse<T>

```typescript
interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}
```

### 18.4 ErrorResponse

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

---

## References

| Document | Path |
|---|---|
| Technical Design Blueprint | `docs/04-technique/00-technical-design-blueprint.md` |
| Architecture Document | `docs/04-technique/01-architecture.md` |
| Prisma Schema Evolution | `docs/04-technique/02-prisma-evolution.md` |
| UX Domain Model | `docs/ux/01-domain-model.md` |
| UX Information Architecture | `docs/ux/02-information-architecture.md` |
| Current API Routes | `apps/api/src/modules/professional/professional.routes.ts` |
| Current API Schemas | `apps/api/src/modules/professional/professional.schema.ts` |
| Current API Types | `apps/api/src/modules/professional/professional.types.ts` |
