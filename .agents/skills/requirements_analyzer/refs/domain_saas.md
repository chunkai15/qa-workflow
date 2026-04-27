# SaaS Domain Knowledge — Everfit & Related Contexts

> Load ngay khi qa_context_builder khởi động. Dùng để identify roles, entities, risks đặc thù SaaS.

---

## Primary Domain: Fitness Coaching SaaS (Everfit Context)

### Key Actors
| Role | Responsibilities | Permission boundary |
|---|---|---|
| **Coach/Trainer** | Manage clients, create programs, issue credits, schedule sessions | Cannot see other coaches' clients |
| **Client/Member** | Book sessions, view programs, track progress | Cannot modify coach settings |
| **Studio Admin** | Manage coaches, billing, studio-wide settings | Cannot access other studios' data |
| **Org Admin** | Top-level: manage multiple studios, billing, reports | Full access within org |
| **Super Admin** | Platform-level (Everfit staff) | Everything |

### Core Entities & Lifecycles
```
Session Credit:   issued → available → used / returned / voided / deleted
Session/Class:    draft → published → booked → completed / cancelled
Subscription:     trial → active → past_due → cancelled → expired
Program:          draft → active → archived
Client Profile:   invited → active → deactivated
Payment:          pending → processing → succeeded / failed / refunded
Order:            draft → pending_payment → confirmed → shipped → delivered
Booking:          pending → confirmed → completed / cancelled / no_show
```

### High-Risk Areas (luôn check khi phân tích spec)
- **Credit system:** issuance → consumption → balance tracking. Sai ở đây = tài chính sai
- **Multi-tenant isolation:** Coach A không được thấy data của Coach B (strict isolation)
- **Permission/RBAC:** mỗi role thấy và làm gì khác nhau — check mọi action per role
- **Billing/Subscription:** trial-to-paid transition, proration, failed payment dunning, upgrade/downgrade
- **Session booking conflicts:** double-booking, capacity limits, cancellation/refund policies
- **Data exports/reports:** accuracy of aggregated data, PII in exports

---

## Secondary Domain: Healthcare & Wellness

### Compliance checks
- **HIPAA considerations:** PII handling (name, contact, health data), consent flows, audit trails
- **Consent flows:** must be explicit, logged, revocable
- **Data retention:** check how long health data is stored and deletion policies

### Key Risks
- Unauthorized access to health records
- Missing consent before data collection
- Incomplete audit trails for health-related actions

---

## Secondary Domain: E-commerce & Marketplace

### Key Entities
```
Product/Listing:   draft → active → sold_out → archived
Cart:              active → checkout → abandoned
Order:             (see above)
Vendor/Seller:     applied → approved → active → suspended
Payout:            pending → processing → paid / failed
Commission:        calculated → deducted → settled
```

### High-Risk Areas
- Inventory sync (overselling)
- Commission calculation accuracy
- Refund/return workflows
- Multi-vendor data isolation (Vendor A cannot see Vendor B's orders)

---

## Secondary Domain: Billing & Payment

### Payment States
```
Charge:    initiated → processing → succeeded / failed / disputed
Refund:    requested → processing → completed / failed
Invoice:   draft → sent → paid / overdue / voided
Subscription: (see above)
```

### High-Risk Areas
- **Idempotency:** duplicate charge prevention (same payment submitted twice)
- **Proration:** mid-cycle plan changes, credit calculation
- **Dunning:** failed payment retry logic, grace periods
- **Tax calculation:** jurisdiction-based, rounding rules
- **Webhook handling:** payment gateway callbacks — must be idempotent and validated

---

## Secondary Domain: Dashboard & Analytics

### Key Checks
- **Data isolation:** user only sees their own data (multi-tenant)
- **Aggregation accuracy:** totals/averages match underlying records
- **Date range filtering:** edge cases (start=end date, cross-timezone, DST)
- **Export accuracy:** CSV/Excel data matches what's shown on screen
- **Real-time vs. cached:** is data live or cached? what's the staleness window?
- **Permission-scoped views:** Admin sees all, Coach sees own clients only

---

## Common Cross-Domain Patterns (luôn check)

### State Transition Risks
- **Missing terminal states:** can a "cancelled" entity be re-activated? What are the rules?
- **Invalid transitions:** system should block (e.g., cannot book a cancelled session)
- **Cascade effects:** cancelling A should cascade to B (e.g., cancel subscription → revoke credits)

### Integration Risks
- **Webhook reliability:** what happens if webhook is missed? retry mechanism?
- **Third-party API failure:** Stripe down, email provider down — graceful degradation?
- **Async operations:** action shows "success" but background job hasn't run yet

### Permission Edge Cases
- User has correct role but doesn't own this specific record
- User's role was changed mid-session (e.g., downgraded from Admin to Coach)
- API call with valid token but expired/revoked session

### Data Boundary Cases
- Empty state (no data yet) vs zero-value (data exists, value is 0)
- Boundary values: exactly at limit vs one over/under
- Concurrent modification: two users editing same record simultaneously
