# EP-07 — Payments

> **Status:** Planned  
> **Sprint:** Sprint 07 (MVP core) → Sprint 09 (enhanced)  
> **Last updated:** 2026-07-19

---

## Business Objective

Enable secure payment processing for consultations, including payment method management, transaction processing, invoicing, and post-MVP features like refunds, payouts, and subscription plans.

## Scope

- Payment method setup (citizen side)
- Payment processing (consultation fee at booking)
- Payment receipt / invoice generation
- Refund processing (post-MVP)
- Professional payouts (post-MVP)
- Payment history & transactions (post-MVP)
- Subscription plans for professionals (future)

## Business Rules

- **Payment at booking**: consultation fee is charged when appointment is confirmed
- **Secure processing**: no card data stored on platform — use payment gateway tokenization
- **Invoicing**: legal platform requires proper invoices with lawyer and client information
- **Currency**: Moroccan Dirham (MAD) as primary currency
- **Refunds**: tied to cancellation policy — automatic or manual depending on timing
- **Payouts**: lawyers receive earnings after consultation completion, minus platform fee
- **Subscriptions**: future revenue model — tiered plans for professionals

## User Story Index

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-060 | Payment Method Setup (user side) | High | MVP | Planned | Sprint 07 | EP-02 |
| US-061 | Payment Processing (consultation fee) | High | MVP | Planned | Sprint 07 | US-060, US-046 |
| US-062 | Payment Receipt / Invoice | High | MVP | Planned | Sprint 07 | US-061 |
| US-063 | Refund Processing | Medium | Post-MVP | Draft | Sprint 09 | US-061, US-051 |
| US-064 | Professional Payouts | Medium | Post-MVP | Draft | Sprint 09 | US-061 |
| US-065 | Payment History & Transactions | Medium | Post-MVP | Draft | Sprint 09 | US-061 |
| US-066 | Subscription Plans (Professional) | Low | Future | Draft | Future | EP-07 |

## Dependencies

- EP-02 Account Management (user accounts for payment methods)
- EP-05 Professional Profile (pricing setup — US-046)
- EP-06 Appointment Booking (payment triggered at booking)

## Roadmap

| Phase | Status |
|---|---|
| Sprint 07 (US-060→062) | Planned |
| Sprint 09 (US-063→065) | Draft |
| Future (US-066) | Draft |

## Related Documents

- [`Releases.md`](../00-product/Releases.md)
- [`Roadmap.md`](../00-product/Roadmap.md)
