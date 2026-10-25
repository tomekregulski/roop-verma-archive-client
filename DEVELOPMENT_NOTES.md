# Frontend development notes

## Approved backend schema inspection — 2026-10-25

Owner-approved metadata-only SQL confirms 24 applied historical migrations with
matching checksums. The identity migration is unapplied and all four identity
tables are absent. Restoring compute/config alone cannot make v161's identity
flow work. Known NetworkError.errorCode nullability mismatch is also confirmed.
No customer records, migrations or service changes. See the updated server
[readiness plan](../roop-verma-archive-server/BACKEND_READINESS_PLAN.md); keep
restoration deferred and separate preview API targets before browser testing.

## Read-only Heroku metadata follow-up — 2026-10-25

Authenticated CLI inspection now confirms web scaled to zero (Eco), current
v161/f25c4158, and H14 router errors. Missing identity/mail/webhook config is
confirmed. Application DB A and shadow DB B are distinct resources; shadow
disposability remains unknown. No logical backups or schedules are listed;
provider physical protection does not establish a verified restore. See the
updated [readiness plan](../roop-verma-archive-server/BACKEND_READINESS_PLAN.md).
No remote SQL or service changes occurred. SQL approval is the next checkpoint;
production-targeting previews still must be separated before browser testing.

## Recovery/readiness preparation — 2026-10-25 (initial)

See the server's [bounded readiness plan](../roop-verma-archive-server/BACKEND_READINESS_PLAN.md).
Recommend deferring restoration pending local authorization work. Production API
targets in Netlify previews must be separated before browser testing resumes;
existing built deploys retain their origins and need explicit verification.
No preview settings/builds, infrastructure or application code changed. Provider
metadata access was unavailable; remote schema queries are prepared but unapproved
and unexecuted. HTTP 503 and CORS are not verified access restrictions.

## Deployment environment assessment — 2026-10-25

Completed bounded read-only assessment; full environment map and evidence limits
are at the top of the sibling server's [BACKEND_BASELINE.md](../roop-verma-archive-server/BACKEND_BASELINE.md).
Owner reports both Netlify published sites at main@244d87e. Production rvdl-ui
(and its preview contexts) targets roop-verma-archive.herokuapp.com; rvdl-ui-sb
(and its preview contexts) targets a sandbox Heroku app the owner reports absent.
Both frontend landing pages returned anonymous HTTP 200; individual previews
and access policies were not checked.

Owner manually deployed backend f25c4158/v161 during assessment, superseding an
old incompatible release. Source now includes matching identity/webhook code,
but backend root still returns 503. Owner reports required rate-limit and
Resend config absent (startup blockers), webhook secret absent (processing
blocked), DATABASE Essential 1 designated production, BROWN Essential 0 intended
as migration shadow, and Stripe API key test mode. No key/connection values,
application data or database contents were inspected. Code inclusion/local
contract compatibility does not prove hosted behavior or migration readiness.

Prioritize bounded production configuration/runtime readiness before media
review, accounting for the production-designated database and outstanding
catalog/admin/media authorization, billing and schema gaps. Only documentation
changed by the agent; no settings, deployments, migrations or protected API
requests. Owner deployment is attributed separately. Unknowns and the concrete
recovery/containment decision are recorded in the server assessment.

## Identity integration session — 2026-10-22–23

The frontend now uses server-controlled login email delivery, one-time proof exchange with immediate URL scrubbing, and cookie-backed identity restoration. Shared requests include credentials and CSRF handling. Account, portal and Checkout requests follow backend ownership enforcement. Logout, expired/revoked sessions, loading states, errors and recovery guidance are explicit.

Registration requests login immediately and at 20 and 40 seconds to accommodate delayed Stripe customer.created provisioning, then offers manual retry/help. Generic messages never claim account creation or email delivery. Missing/failed webhook processing remains a blocker to guaranteeing registration completion; billing lifecycle behavior was not repaired.

Review work clarified request/session ownership, made proof initialization explicit, added maintainer comments, simplified small form markup and reused local UI components. Generated captures under test/evidence/ are ignored; test source and durable results remain versioned.

Changes were merged separately: client cdc00cc (implementation e79cda6), server 98ba708 (implementation 3923d55). Server work was limited to the synthetic browser fixture and integration documentation; no backend application fix, dependency change or migration was needed. These identify merged results, not a fresh post-merge verification run.

Evidence includes 70 backend tests, 18 allowed-origin browser assertions, manual-style browser identity checks and frontend lint/type/build checks. The final control/proof suite passed 14 tests. Later review changes received focused checks rather than another complete acceptance run. Providers/storage were simulated. The wrong-origin assertion needs a reachability control; harness startup failure cleanup also remains deferred. See [IDENTITY_HANDOFF.md](IDENTITY_HANDOFF.md) for exact checks, historical snapshots, reproduction steps and limits.

The stopping point was local browser identity integration. Real email delivery, real Stripe behavior, deployed HTTPS/cookies/CORS/proxy behavior, billing lifecycle, media entitlement, catalog/admin authorization and other documented backend blockers remain unverified or unresolved. This is not beta readiness. No production data, real-user email, remote migrations, DNS or hosting changes were involved.

## Local UI and accessibility preferences

These are project decisions surfaced during review, not a claim that every other HTML pattern violates accessibility requirements.

- Prefer local reusable UI components where their semantics fit. Login/signup use Form, Input and Button; account/retry/logout actions use Button; account and Checkout return use Section/ViewTitle.
- Keep specialized audio controls, sliders and track icon actions specialized. Keep routine status/errors inline when the available Alert/Loading components would introduce modal overlays.
- Components own their styling. Button, Input and Form accept selected semantic/accessibility props, not caller style/className overrides. Input has no padding override. Future visual variations should use deliberate design-system APIs; no variant system was introduced here.
- Every unavailable control must explain why. isDisabledMessage alone determines Button/Input disabled state; avoid a separate boolean that permits disabling without a reason.
- Prefer focusable aria-disabled controls with guarded interactions over native disabled. Associate explanations with aria-describedby and make them available on focus as well as hover.
- Guard behavior as well as appearance. Button prevents unavailable activation/default submission and propagation; Form independently blocks disabled/implicit submissions. Unavailable text inputs use readOnly plus guarded change handlers while remaining focusable and selectable.
- Preserve native validation, correct label/input associations and clear busy/error/recovery states. Do not present external-service success that the app cannot verify.

## React and maintainability preferences

- Make side effects explicit and lifecycle-owned. AuthProvider installs/ejects its interceptor in an effect and ignores in-flight failures after cleanup. Avoid a module-global listener registry for provider-owned session state.
- Keep reusable proof helpers inert on import. A small explicit startup module initializes capture before router/SDK setup; initialization is idempotent, named listeners have cleanup, and hot disposal removes them. Do not persist/log proofs or include them in notification events.
- Event-driven session rechecks on mount, focus, visibility and known expiry are acceptable. Deduplicate overlapping requests and discard stale results; this is not continuous polling.
- Use state for rendered values and refs for async coordination that should not render. Stabilize callbacks where their identity matters, and handle StrictMode setup/cleanup correctly.
- Prefer straightforward JSX for very small fixed structures. Signup's three distinct fields are explicit. Inline maps are not inherently wrong; use them when repetition warrants the abstraction. Extract named handlers and policy helpers where they clarify intent without broad refactoring.
- Add succinct file-level explanations and function/JSDoc comments for context methods and lifecycle-sensitive helpers. Use selective internal comments for ownership, races and non-obvious decisions.
- Vite import.meta.env reads build-provided public configuration rather than importing a JavaScript module. Keep server secrets out of frontend configuration.

## Deferred: store-based state for global contexts

**Status:** consideration recorded; no library chosen or migration scheduled. Revisit during broader state architecture work or when profiling shows material context-related rerender cost. This does not displace open deployment/billing/media/security blockers.

Selector-based subscriptions could let consumers of AuthContext and other global state subscribe to individual values rather than every provider value change. Frequently updated contexts, such as audio state, may benefit more than relatively infrequent auth updates; measure before selecting a migration target.

First profile representative interactions and identify costly provider/consumer updates. Assess simpler options such as splitting contexts, separating state/actions or stabilizing provider values. A store is not automatically faster and does not itself reduce network requests.

If justified, migrate a bounded piece of state and verify the measured result. Decide separately where request caching and lifecycle orchestration belong. Preserve deduplication, stale-result protection, cleanup, proof handling and session revalidation. The backend remains authoritative; sessions stay in the HttpOnly cookie, and proofs/session credentials must not be persisted in a client store.
