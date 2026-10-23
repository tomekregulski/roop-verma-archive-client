# Browser identity integration — 2026-10-22

The React identity flow works against the isolated local Express backend. This is a local identity integration result, not verified email delivery, billing correctness, media protection, deployed security or beta readiness.

## Review follow-up — 2026-10-23

Session-failure handling now belongs to an AuthProvider effect. The effect registers the Axios interceptor and ejects it on cleanup; an active flag also ignores already-in-flight failures after cleanup. The client-level listener registry and onSessionExpired export were removed. Expected 401 exclusions, rejection propagation, credentials and CSRF behavior are unchanged. The client file-level comment now reflects this ownership.

Changed-file ESLint, TypeScript, production build, three existing proof regression tests and a focused lifecycle smoke check passed. The smoke uses real Axios with simulated React hooks and no HTTP; it checks protected 401 handling, expected endpoint exclusions, 500 handling, original error propagation, cleanup/in-flight failures and remount without duplicate handling. Existing build warnings remain. No browser or backend tests were rerun for this review follow-up; the browser results below describe the earlier integration revision. The source fingerprints for this follow-up and the original browser-tested snapshot are recorded below. No backend or dependency changes were made.

### Proof startup cleanup

`loginProof.ts` now exports an explicit, idempotent initializer and has no import-time browser side effects. A named hashchange handler can be removed; cleanup clears the captured proof. The first import in `main.tsx` runs the small `startup.ts` bootstrap, which calls the initializer before import-time router setup and SDK initialization, and registers Vite hot-disposal cleanup. Succinct file/function comments explain the ownership and credential-free event. Six proof regression tests pass, including inert imports, duplicate initialization, cleanup/reinitialization and the retained URL-scrubbing cases. Changed-file ESLint, TypeScript and production build pass (existing build warnings remain). No backend or dependency changes; browser checks were not rerun for this follow-up. Source fingerprints for this follow-up are recorded below.

### Local UI component reuse

The 2026-10-23 pass reviewed tracked client markup and reused local Form, Input and Button components for login/signup, account actions, session retry and navbar logout. Account and Checkout-return screens now use Section/ViewTitle. Specialized audio controls, the seek slider and track icon action retain their existing implementations. Inline status/error messages remain inline because the local Alert/Loading components are modal overlays.

Button derives disabled state solely from isDisabledMessage. Unavailable actions remain keyboard-focusable with aria-disabled, an associated explanation and hover/focus tooltip; activation cancels the native default and propagation. Form independently blocks disabled submissions. Input retains native validation attributes and associates its label with the actual input ID. Busy inputs also derive aria-disabled from an explanation, stay focusable, use readOnly to prevent native edits and guard their change callbacks. Button/Input/Form expose selected semantic props; they accept no caller style/className overrides, and Input no longer exposes padding overrides.

Verification used the current uncommitted frontend working tree on the base HEAD below. `node --test test/ui-components.test.cjs test/login-proof.test.cjs` passed all 13 tests (seven shared-control tests and six proof tests). Control tests use real React elements/static rendering with tooltip/icon/hook doubles; browser keyboard behavior was checked separately. Changed-file ESLint, TypeScript and production build passed, with the existing build warnings. No dependency or backend changes were made for this pass, so backend tests were not rerun.

Manual-style browser checks against the isolated harness verified native email/required validation, label focus, disabled-action Tab focus and explanation, and blocked click/Enter/Space/implicit submissions. Captured request metadata showed one login POST after these attempts. Synthetic login, reload restoration, portal return, logout and delayed-webhook signup through owned Checkout return also passed with the reused controls. Screenshots were inspected for signup, account, disabled-action and Checkout-return layouts. These are representative UI checks, not a rerun of the full original proof/session/CORS/CSRF acceptance matrix. External email/Stripe behavior remained simulated; HTTP/deployment limitations and other blockers below are unchanged.

The subsequent owner review removed the redundant isDisabled boolean, native disabled support on Input, and styling overrides introduced in the initial UI pass. The revised working tree passed all 14 control/proof tests, changed-file ESLint, TypeScript and production build (existing warnings remain). A focused synthetic browser recheck confirmed that the unavailable registration-login email field retains focus and its original value after typing/deletion attempts, exposes its explanation on focus, and participates in Tab/Shift-Tab navigation with the unavailable submit button. This narrower recheck does not repeat the earlier full identity flow.

## Working-tree state

Repositories remain separate, with no commits created. Frontend base HEAD: `baefaf4ddf8d2f0797cbf8073fb18e861b9b79a7`. Backend base HEAD: `f6a91da98a7b21ac7745bb9441b151afa9b17b01`. Both were initially clean. The historical SHA-256 tables below identify the original browser-tested source/test files and subsequent verification snapshots. These fingerprints describe past uncommitted trees; the later UI reuse pass received only the checks explicitly listed above. No dependency or lockfile changes. Build output is not part of the change.

No frontend `AGENTS.md` exists in the checked repository or enclosing workspace directories. The backend `AGENTS.md`, current baseline and identity contract were read. The owner's explicit frontend authorization supersedes older backend notes prohibiting frontend implementation.

## Changed behavior

- Login posts only `{email}` to server-controlled delivery. Browser EmailJS/JWT login issuance, credential logging and JavaScript-cookie authentication are removed from active paths. EmailJS remains for the unrelated support form; dependencies were not pruned.
- Email proofs arrive at `/login-gate#token=…`, are removed from history before app startup, and exchange once even under React StrictMode. Another link opening in an existing gate tab is handled too. There is no automatic retry of a proof after an ambiguous network result; request a fresh link. No proof is stored in browser storage or forwarded to telemetry.
- Identity comes from `GET /auth/session`, including after verification to confirm cookie acceptance. Restoration, focus/visibility refresh, absolute-expiry recheck, logout and protected-request 401 handling use the server cookie. Session races cannot restore an older in-flight identity after verification/logout. Session lookup failures show retry guidance and remove client identity.
- Shared Axios handling includes credentials and `X-RVDL-CSRF: 1`. Account UI uses current server identity. Portal omits caller-selected customer IDs; Checkout targets the authenticated user's customer; returned Checkout IDs undergo backend ownership checks. Protected legacy GETs also carry CSRF. Account state refreshes on mount/portal return and via an explicit refresh button.
- The global frontend-only admin-password gate is removed from bootstrap so normal mailbox login is reachable. This establishes no catalog/admin authorization. Its old unused source is not an active access boundary.
- Signup creates the Stripe customer request, then requests email login immediately and at 20 and 40 seconds (at most three requests, stops early on request failure). It does not trust the returned customer ID as identity. The UI then offers a manual retry after a minute and help guidance. A new verified user can explicitly continue to Checkout from Account. Generic responses never claim email delivery or account provisioning.
- Checkout return refreshes identity and looks up only the owned Checkout session. A success URL is not presented as payment/subscription confirmation. Existing subscription status display/UI policy remains; backend media entitlement and subscription lifecycle are unchanged.
- Track callers no longer read/send old JWT cookies. Existing catalog selection, caching and media access defects remain outside this work.

## Verification

Runtime used: Node v26.3.0, existing locked packages. This does not establish supported deployed-runtime or provider compatibility; backend Node 24.19.0 remains pinned.

Automated checks:

- Frontend `pnpm build` (`tsc && vite build`): pass. Direct local TypeScript/Vite commands also passed. The exact PNPM command required a permitted rerun because the sandbox blocked its registry signature check. Warnings: browser-compatibility data is 22 months old; main chunk exceeds 500 kB.
- Frontend non-mutating `node node_modules/eslint/bin/eslint.js src --ext .jsx,.js,.ts,.tsx --quiet`: pass. No whole-project formatting or unrelated cleanup performed.
- `node --test test/login-proof.test.cjs`: 3 pass, covering initial history scrubbing, single retrieval, same-tab replacement links and unrelated fragments.
- Backend `npm test`: 70 pass. First sandbox attempt failed to bind loopback; permitted rerun passed. Existing real-PostgreSQL tests were not rerun: no application backend/database behavior changed. Historical schema-drift failure remains open.
- Browser contract page: 18 assertions pass from the allowed origin; a separate wrong-origin check was exercised from `http://localhost:3000` (qualification below). These are automated JavaScript assertions manually launched in the app's browser, not a headless E2E runner. Actual browser fetch, cookie storage, HttpOnly visibility, credential omission, CORS preflights, CSRF failure, self/foreign account access, portal/Checkout/payment ownership and zero fake Stripe calls on denied requests were exercised. The independent wrong-origin page also reported a pass, but its current assertion treats any network failure as CORS rejection. That result alone cannot distinguish CORS enforcement from an unavailable API and needs a reachability control before reuse.
- Syntax checks for the new harness files and `git diff --check` in both repositories: pass.

Browser UI checks driven through the browser tool (manual-style checks, not a committed automated React E2E suite):

- Existing account A: generic initiation → captured synthetic email → proof exchange → Account; reload restores Account without another proof exchange. Portal opens the fake hosted page and returns to Account.
- Invalid, expired (test clock advanced 16 minutes), reused and missing proofs show recovery guidance; fragment is scrubbed. StrictMode still produces one verification per supplied proof. A second hash link in the same tab is scrubbed and rejected correctly.
- Navbar logout clears authenticated UI; navigating/reloading Account requires login. Server-side revocation followed by a portal action receives 401 and clears client identity. Advancing the backend clock eight days makes reload restoration fail despite the browser retaining its cookie.
- Delayed registration: first login request precedes provisioning; a synthetic signed customer.created webhook arrives after ten seconds; later login requests capture mail. Verification establishes the new user; only then does the Account button request Checkout. Fake hosted return performs one owned lookup. The recorded request sequence contained three login POSTs, two fake emails, one verify, one Checkout creation and one retrieval.
- Missing webhook: three generic requests stop without mail, session or Checkout; manual retry/help remains. Recorded totals were three login POSTs, zero captured emails, zero verification requests and zero sessions; the only fake Stripe call was customer creation.

All external behavior is simulated: in-memory Prisma double, fake Resend acceptance, fake Stripe resources and a test-only replacement for Stripe's browser SDK. The signed local webhook still passes through the actual app's raw-body/signature middleware. Expiry/revocation use fixture clocks/storage. Synthetic storage does not establish PostgreSQL atomicity, existing-data compatibility or migration readiness. No real user email, Stripe test/live calls, production data, remote migrations or hosting changes were used.

## Local artifact policy

`test/evidence/` is reserved for disposable local screenshots, request traces and run metadata and is ignored by Git. Existing captures may remain on the developer's machine; a fresh checkout does not need them to run the tests. The current harness does not automatically populate this directory. Test source and synthetic fixtures remain versioned under `test/`; durable results, revision fingerprints and verification limits are recorded in this document.

## Reproduce locally

Install existing locked dependencies in each repository (frontend PNPM; backend npm; ignore install scripts), then from this repository run:

```sh
node --test test/login-proof.test.cjs
node test/browser-harness.mjs
```

The test launcher defaults to the sibling backend checkout; set `RVDL_TEST_BACKEND_ROOT` to another explicit checkout if needed. This is a test-only cross-repository launcher, not a shared package/workspace or deployment dependency. It loads the actual backend fixture without dotenv/provider clients and uses an empty temporary Vite env directory plus synthetic public config. Fixed loopback ports: frontend 3000, API 8090, controls/mail capture 8091. It refuses production mode. Normal `vite`/backend entry points do not mount any test routes or mail capture.

Open `http://127.0.0.1:3000`, request login as `a@example.invalid`, then use `http://127.0.0.1:8091` → Open latest synthetic email link. Do not copy proofs into logs. On the control page, use reset between independent cases; delayed-webhook/missing-webhook selects registration behavior. Clock/revoke/mail-failure controls affect only disposable memory. Browser contract checks require account A; the wrong-origin check uses `http://localhost:3000/__identity-checks`. Stop the launcher with Ctrl-C to discard storage and stop all local servers. The launcher currently lacks failure-path cleanup if Vite startup fails after the backend starts (for example, when port 3000 is occupied). Startup cleanup and the wrong-origin assertion qualification above remain harness follow-ups; neither is changed by the artifact policy.

## Remaining blockers and deployment requirements

Registration remains blocked whenever customer.created provisioning is delayed beyond retries, absent or fails. No readiness endpoint exists and generic login cannot identify the cause. Repeating signup may create another external customer before a local user exists. Retry/reconciliation/idempotency and billing lifecycle repair remain separate work. The frontend cannot guarantee this journey under real webhook failures.

Configure frontend `VITE_API_ORIGIN`, public `VITE_API_KEY`, Stripe publishable key and support address for the correct environment. Never put mail/rate/Stripe secret keys in frontend variables. Configure backend mail sender/provider, exact `CLIENT_URL`, rate secret, cookie/proxy settings and webhook secret per `IDENTITY_API.md`/`Operations.md`. Disable credential-link tracking and prevent access/error analytics from collecting fragments or auth bodies. Ensure SPA hosting serves `/login-gate`, `/manage-account` and `/complete-registration` on direct navigation (existing Netlify rewrite retained).

This run used HTTP with the deliberately insecure `rv-session-local` cookie, HttpOnly, SameSite=Lax, and different loopback ports on one host. It verifies cross-origin CORS/CSRF but cannot verify the production Secure `__Host-rv-session` prefix, TLS, proxy forwarding or third-party-cookie behavior. Intended deployment is HTTPS sibling frontend/API subdomains under one registrable domain, with host-only API cookies and exact credentialed CORS. Current cross-site Netlify/Heroku origins may require SameSite=None; Secure and may still be blocked by browser third-party-cookie policies. Confirm actual domains, proxy trust and supported runtime before deployment; do not infer this from localhost.

Real provider acceptance/inbox delivery, real Stripe test mode, hosted webhook setup, deployed HTTPS/cookies/CORS/proxy behavior, production data and remote migration readiness are unverified. Designated-inbox delivery and real Stripe tests require owner approval. Media URL/entitlement, catalog/admin authorization, billing lifecycle and the historical NetworkError.errorCode schema mismatch remain open. This work does not establish beta readiness.

## Historical source fingerprints

These SHA-256 values preserve the recorded verification snapshots without requiring local artifact files. The 2026-10-22 snapshot received the browser checks described above. The 2026-10-23 snapshots received the narrower checks listed in the review follow-up; browser checks were not rerun. Later comments and form-readability edits may change file hashes. Source fingerprints identify file contents but do not preserve or reconstruct the earlier uncommitted files.

<details>
<summary>Recorded source versions</summary>

### Original integration — 2026-10-22 — roop-verma-archive-client

Base HEAD: `baefaf4ddf8d2f0797cbf8073fb18e861b9b79a7`; uncommitted source/test snapshot.

| File | SHA-256 |
| --- | --- |
| `src/api/client.ts` | `9e2168347d7b29d8157e24ffbccadd98bd85904083d71ecf344fddab3fbf2b23` |
| `src/components/Navbar/Navbar.tsx` | `d5a2464916c484115fb0875d770b73ef9bc8a9974a8100a7c910b66da0b5b197` |
| `src/context/AudioContext.tsx` | `8f366c8211c788a47da6ebe2bc1a6c63540b59262f289ca6eb4d7e4f7399712f` |
| `src/context/AuthContext.tsx` | `a18e6cdce6cbd44f8a95997d8ed8b063db0b9dfff9003e669c6aee18a8891513` |
| `src/layouts/AppLayout.tsx` | `6780fd364de4cb051c8e28d7511bf5a558861e817297b8ad33b6f3a70423f540` |
| `src/main.tsx` | `75ff6e601246ccf5734526100e1333dc511d68de49c97ff61c43db7f3da45609` |
| `src/queries/audioQueries.ts` | `37a9647916e740a08c36b59761ba148922ff3aaa8a066e09bca675f64fce2b5a` |
| `src/util/handleCheckout.tsx` | `a959f9aa233c1525444aa0655b3f1bb727c92464000ed21b11612c6d34d50e15` |
| `src/util/loginProof.ts` | `94af2e8d02f9343776265a44543d35a2b01cc30b964a41ad138b4a59d0c12fb4` |
| `src/views/CompleteRegistration.tsx` | `e70b4569817a4f2b7b2e27874f59c13eae34570bafebd5bc0a0644443cfc95de` |
| `src/views/Login.tsx` | `cd57a632a418e73dd4f7d90b653e4538754a9bed02bf3b448d28da58b6dc988d` |
| `src/views/LoginGate.tsx` | `aaca63945d720032117fd659e00ee41458494a8d521acc62c9967a32fe5efee0` |
| `src/views/ManageAccount.tsx` | `6af89bb973429ce074c82ba9a104ff1ec319c463c098318b919ba91b52d247e7` |
| `src/views/Signup.tsx` | `12e4930546cfcb0c2601e192663d7608f66b4b3ffb1e1f9fd3f3d4a97b2c6d5a` |
| `src/views/Welcome.tsx` | `589d76e1dc597504c75067199439db28ee9864ef4747f51bacf9da1864139f90` |
| `test/browser-checks.html` | `37b05675db778b7f602c0961b2ae457d96a900bd4a76cf2fe461e62200f90005` |
| `test/browser-harness.mjs` | `cd6ccf09e663dc833cdcfb69fc18c4d9105adaf0f2bfe44e021aec2e646af0cc` |
| `test/login-proof.test.cjs` | `413b54d9b26ec5ce4f549e1b88594369b2e3abb26e17488de025b905942cce65` |
| `test/stripe-double.tsx` | `5c290327f4841f4c3e7a61d257b0ed27febdd843c40495aedb7048c4c20a77cf` |

### Original integration — 2026-10-22 — roop-verma-archive-server

Base HEAD: `f6a91da98a7b21ac7745bb9441b151afa9b17b01`; uncommitted source/test snapshot.

| File | SHA-256 |
| --- | --- |
| `test/support/browser-fixture.js` | `5af7ed36956b959059bed7abdc316f6acabf8ec751b5cae7f4a5de7522a5537b` |

### Interceptor cleanup — 2026-10-23

Frontend base HEAD: `baefaf4ddf8d2f0797cbf8073fb18e861b9b79a7`; uncommitted review snapshot.

| File | SHA-256 |
| --- | --- |
| `src/api/client.ts` | `4781fc15dec3d93be637462d335f552a78eecb15c1c4d8e523a646cc9c6feeaf` |
| `src/context/AuthContext.tsx` | `e85ff9a9e65e3dc9edb385c0da82fc8dc00d8192f3d21645c5c6a7a980bd6d2b` |

### Proof startup cleanup — 2026-10-23

Frontend base HEAD: `baefaf4ddf8d2f0797cbf8073fb18e861b9b79a7`; uncommitted review snapshot.

| File | SHA-256 |
| --- | --- |
| `src/util/loginProof.ts` | `089d8ac9edeea2b6e35f6480a80fa08f92df07f024f15a8a0c844ce66ddb63d1` |
| `src/startup.ts` | `c1836c132e9fc9316d0c170e19d83254223132319f58fdbe9b0c1c45a1b2c125` |
| `src/main.tsx` | `6c6251543e3f2aab74d5d0f1d221deaa8fbf8f38b8ccf4d5c20a40939b8abecd` |
| `test/login-proof.test.cjs` | `a452bb7bf1d378d1b8c39d04727da5aa1bf05a8dcc8471aca23a771ebed6e19c` |

</details>
