# One-recording pilot verified — 2026-11-16

The [server pilot results](../roop-verma-archive-server/ONE_RECORDING_R2_PILOT.md)
selects existing subscriber Track.id **7** (catalog number 15), Chandrakaunsi
Kanada, 1979-01-27, Yoga Society of Florida; catalog artist Kevin West Milburn.
Owner-approved exact Cloudinary MP3 copy (46,673,192 bytes, v1650679366,
**19:26.8**) is retained in private R2 Standard. Full read-back SHA-256 matched.
Existing player/native media passed normal progression, unbuffered seeks,
pause/resume, explicit Retry after a test-only storage failure, and browser
range/CORS. Anonymous/unsubscribed/foreign-account issuance, unsigned media and
write/delete attempts denied; synthetic cancellation/revocation denied fresh
issuance. Final read-only DB snapshot, source, visibility and plays=0 unchanged.
Server PR #70 (c5e791d) and client PR #109 (2b80f58) are merged in these clean
starting checkouts; historical unstaged-state wording below is superseded.
No branch switch or optional renewal work included. The plan retains two-hour
links and explicit Retry, synthetic local identity/billing, the existing player,
private durable manifest/configuration and a separate hosted-activation handoff.
Only provider test fixtures were adapted for the single existing ID, a private
locator-free catalog snapshot and one-shot storage failure; production player,
identity/billing and request protections were unchanged. Twelve existing focused
backend synthetic checks plus the isolated primary-ID regression, client types,
touched fixture lint and launcher syntax pass. Retained manifest/read credential
are private at `~/.config/rvdl/private-playback`; uploader revoked and temporary
files/processes removed. Hosted integration remains instructions only. Prior
generated-sample expiry/completion evidence is separate; no hosted playback,
whole-recording completion, library-migration or archival-preservation claim.

# First private sample — revised scope, 2026-11-14

The first slice is secure delivery of one sample through the **existing player**.
Keep the planned two-hour link lifetime, current expiry stop and explicit Retry.
Recordings are mostly 15–45 minutes. Automatic renewal, seamless position
preservation and background-tab recovery are not part of this candidate. No
ordinary-listening failure has yet demonstrated a need for those mechanisms.

At the owner's request, the current scoped changes now live **unstaged on main**
in the normal `/Users/tomekregulski/Desktop/rvdl/roop-verma-archive-client` checkout,
from baseline `bf272a0`. Application changes are limited to the owner-approved
2026-11-15 ended-state fix below; API client, dependencies and visual design are
unchanged. Client additions are this handoff, a
synthetic MP3 preparation script and an explicit isolated provider-test page/
launcher with native diagnostics. The isolated minimal worktree remains a source
copy. The completed expanded client implementation/tests remain intact at
`/private/tmp/rvdl-private-audio-client`, branch `codex/private-audio-delivery`.
Its 28 React / 27 unit / 9 native checks apply to that optional work, not this
candidate. No optional recovery was copied into main.

The normal sibling server checkout is also on `main`, with its scoped changes
unstaged from baseline `8632b7a`: strict server-owned Track.id → content-addressed
MP3 manifest and fixed private R2 HEAD/GET adapter. The maintained AWS S3 v3 SDK
signs object-specific two-hour GETs. Existing
identity, securely associated active/past_due subscription status, cache and final
session/access checks remain authoritative. No migration, Track.url fallback,
media proxy, DRM, download prevention or analytics change was added.

Server evidence is 271 synthetic checks on Node 24.19.0, with prior 142 fresh
disposable PostgreSQL checks retained. The separately approved R2 test has now
passed real SDK authorization/range/CORS/expiry checks and actual existing-player
playback, unbuffered forward/backward seeks, ordinary pause/resume and explicit
Retry. The continuous 15-minute run and approved cleanup completed; the sibling
server's [provider report](../roop-verma-archive-server/PRIVATE_AUDIO_PROVIDER_CHECK.md)
is the canonical result and limitations record. This is real R2 media with native
audio, synthetic local identity/billing and no existing database. It does not
establish hosted application behavior or a full two-hour wall-clock expiry check.
Client 29 React browser assertions (including the focused ended-state regression),
14 unit checks, type-check, targeted touched-file lint and production build pass
(existing browser-data/chunk-size warnings). Optional client results above remain
separate from this existing-player candidate.

## Verification scope and remaining activation

The owner approved the provider plan/account and the read token at action time.
The generated 15-minute MP3 was uploaded through the dashboard into a new private
Standard bucket; no uploader credential was created. Continuous native playback
completed with no media error; fresh access denied after cancellation/revocation.
The sample/bucket/token/local secrets are removed and listeners stopped. The
observed end-of-track UI issue was fixed with owner approval on 2026-11-15:
AudioProvider handles native `ended`, clears the progress timer and synchronizes
stopped state; AudioPlayer shows the final position and Play label. Completion
retains the selection without automatic continuation or renewal; manual Next/
Previous remain. The focused React regression uses an Audio double, checks the
final controls/position and crosses the former timer tick to verify no new
issuance/listen or selection change. The earlier real R2 results were not rerun.
Hosted configuration/
deployment and any actual-recording test remain separate. Email DNS is independent
of this isolated test.

Exercise the actual AudioPlayer against the existing authorized endpoint and
actual R2 URL: anonymous public, protected allowed/denied cases, playback,
unbuffered forward/back seek, ordinary pause/resume, wrong/unsigned object denial,
provider expiry and current explicit Retry. Retain two-hour app links; label any
separate short-lived SDK expiry probe distinctly. A full two-hour wall-clock test
can be recorded separately. Expected manual Retry behavior (including restart at
zero) is not itself a defect requiring seamless restoration.

If ordinary 15–45 minute listening reveals a material failure, record the trigger,
observed behavior and listener impact, then propose the smallest fix and its
maintenance cost **before** implementing extra recovery. No problem has yet been
established that warrants automatic renewal or a generalized recovery lifecycle.

## Synthetic sample preparation

Optional `lamejs@1.2.1` lives in an external test-tools directory, not application
dependencies. The generated quiet tone defaults to 15 minutes (mono 22.05 kHz,
64 kbps). The helper uses create-only output and reads no recording/provider:

```sh
node test/synthetic-mp3.mjs /absolute/tools/node_modules/lamejs/lame.all.js /absolute/new-sample.mp3
```

An optional final argument sets duration in seconds, bounded to 1–2700. This is
sample preparation only; it neither uploads nor adds a playback API/test grant.
Designer assets, hosted-support drafts, seven-migration target and historical
rehearsal evidence remain unchanged. Normal main checkouts now contain only this
slice’s scoped unstaged changes; their branch selections are unchanged. Source/config/docs
merge coordination is recorded in the server Operations.md. No commit, push,
deployment occurred. Approved R2 test actions/results are recorded separately in
the provider report; no actual archive recording or existing DB was accessed.

---

# Current C1 playback boundary — 2026-11-02

Normal backend playback now selects the Stripe-led shared access cache, current
paid-invoice verification and terminal cancellation veto. The frontend no longer
carries subscription-status policy or uses it to invalidate playback; identity
changes/expiry/server authorization remain authoritative. Existing 23 player
browser assertions and 14 unit tests pass; normal-route purchase/deletion tests
cover paid authorization, final checks and deletion/tombstone races. Real delivery,
provider expiry/streaming and public-URL retirement remain unverified/separate.
Current billing policy is D1–D10 in the sibling backend, with evidence/activation
limits in `STRIPE_LED_PURCHASE_IMPLEMENTATION.md`. Older billing design and dated
candidate claims below are historical and superseded by the current composition.

---

# D9 playback boundary — 2026-11-02

Pending account deletion adds no playback restriction; the existing trusted
selection/paid-period policy still applies. Completion clears the shared cache
and tombstones/deletes identity transactionally. D9 tests verify suspended cache
fills and asset-mapping authorization cannot authorize after completion. Existing
23 player React assertions and 14 frontend unit checks pass; normal playback
runtime/delivery are unchanged. Current backend evidence and retention/C1 limits
live in `STRIPE_LED_PURCHASE_IMPLEMENTATION.md` in the server repository.

---

# Approved billing design checkpoint — 2026-11-01

The sibling backend's [billing entitlement design](../roop-verma-archive-server/BILLING_ENTITLEMENT_DESIGN.md)
now records the billing flow/code evidence, invoice-backed paid-period model,
event/access table, schema proposal, concurrency/retry/reconciliation protocol,
test matrix and first implementation task. This is design only; no application,
dependency, schema or migration changes and no new test/provider verification.
Locked SDK request version and unknown webhook payload version are distinguished.

Owner approved no trials/zero-cost grants or grace; full refund/open or lost
dispute revokes the affected period, partial refunds require review; immediate
cancellation preserves paid coverage. Owner also approved one ongoing subscription,
duplicate review without stacking time or removing established legitimate access,
and account deletion only after confirmed billing closure. Partial refunds
preserve remaining paid access during review unless independently disqualified;
won/withdrawn disputes restore only original unexpired coverage after fresh
payment/refund verification. Owner approved the model/first-task plan as the
design checkpoint only, excluding credits, discounts, trials, plan changes and
unsupported arrangements. No initial-scope policy questions remain open.
Implementation/provider actions remain unauthorized. Client display status
still includes incomplete/trialing and is not payment or playback authority.

The agreed first task connects a signed synthetic paid invoice to durable local
entitlement and the real reader, using disposable PostgreSQL and fake delivery;
real Stripe test-mode actions need separate authorization. The implemented
playback contract and prior evidence below are unchanged. Billing correctness,
private delivery and deployed behavior remain unverified; restoration is deferred.

# Local playback integration handoff — 2026-10-28

Local access decisions, URL issuance boundaries and necessary player integration
are implemented. Service restoration remains deferred. Live private media is
**not** proven protected. The authoritative contract is the sibling backend's
[PLAYBACK_API.md](../roop-verma-archive-server/PLAYBACK_API.md).

## Browser harness type-check follow-up — 2026-11-01

`playback-browser.tsx` was excluded by the original src-only TypeScript config.
The prior application build pass therefore did not establish that this harness
was free of type errors. Including it with the application compiler settings
reproduced 34 used-before-assignment diagnostics in the shared React state reads.
Those diagnostics are now fixed with guarded getters for the latest mounted
context state, typed Axios requests/responses and captured promises, complete
Track fixtures, and one documented cast at the partial browser Audio-double
boundary. All 23 original browser assertions remain and pass under StrictMode.

`tsconfig.json` now includes `test/**/*.tsx`, so both browser TSX fixtures receive
the same JSX, strictness and environment types as src, and normal `tsc`/build/CI
checks catch future errors. Test code remains outside the normal Vite entry
bundle; checking its types does not enable any fake API/media behavior in the
application. The isolated production build contains no playback-harness markers.
No application behavior, dependencies, entitlement logic or provider integration
changed in this follow-up.

Removed unused `baseUrl: "src"` rather than suppressing its TypeScript 6
deprecation. A resolution comparison of all 77 bare imports found no changes
without it. Installed/pinned compiler remains TypeScript 4.9.5; an editor using a
newer language service can report deprecations absent from that compiler.

Verification: normal declaration-emitting `tsc` and final no-emit type check pass;
isolated production Vite build passes; targeted ESLint for both TSX fixtures
passes; 14 existing unit tests and the 23 React browser assertions pass. Existing
build warnings concern browser-compatibility data and the main chunk size.
Whole-src ESLint separately reports pre-existing trailing whitespace on the blank
line at `src/context/AudioContext.tsx:220`; that application edit was left untouched.
No backend changes or backend test rerun were needed. Earlier dated evidence and
all delivery/entitlement prerequisites below retain their scope.

## Implemented behavior and compatibility

The player requests POST `/api/v1/track/:id/playback-access/:key` with exactly
`{}` through the shared credentialed/CSRF Axios client. `id` is Track.id, not the
historical catalog trackId. Success supplies `{trackId, url, expiresAt}`; the
client validates the selected ID, HTTPS URL and future expiry. Temporary URLs
remain in player memory and the Audio element, outside catalog/query caches and
browser storage. Catalog Track types no longer contain url or master fields.

AudioProvider owns catalog fetching. The duplicate AudioView query and infinite
cache are removed; anonymous browsing uses the public catalog and logged-in
browsing uses full metadata. Display subscription status does not grant or deny
playback; the server makes the access decision. Existing account display policy
is unchanged and is not a trustworthy paid-entitlement source.

Track, identity/status and retry changes clear/pause previous media before paint,
abort issuance and ignore late results. Requests send no asset locator, entitlement,
identity or admin input. Errors distinguish login, paid-access denial, missing
track, unavailable delivery and failed requests. Retry is inline, with existing
Button/AudioControls components; unavailable Play is focusable, described and
behaviorally guarded. Media errors and rejected play promises are handled.
Metadata events establish duration; navigation retains filtered indices,
including zero and noncontiguous IDs. No unrelated player redesign was performed.

The endpoint and URL-free catalog are a coordinated frontend/backend contract
change. Old clients that read Track.url cannot play the new catalog; this client
cannot play against a server without the new endpoint. Production adapters remain
unavailable, so public delivery and subscriber entitlement requests can return 503. The frontend reports that state; it never falls back to old Cloudinary URLs.
No deployment or service restoration is authorized or performed.

URL expiry pauses/removes local audio and offers manual Retry playback for a new
access decision. Retry replaces the Audio element. **Remaining frontend/delivery
integration:** seamless renewal that preserves time/play intent, long recordings
and paused-tab resume past expiry, actual buffered/unbuffered seeking and Range
responses, stalled recovery and automatic next/ended continuation. These are not
certified complete. Client timer behavior cannot establish provider expiration or
revoke already delivered bytes. Already-issued bearer URLs may remain usable until
expiry after a later cancellation/session change; the backend rechecks new requests.

## Evidence and reproduction

- Backend pinned Node 24.19.0: `node --test test/*.test.js` (npm test's command):
  **166 passed**, all 140 existing assertions retained plus 26 playback/runtime
  checks. Actual Express HTTP middleware/routes/controllers run with synthetic
  database/identity/mail/Stripe fixtures, normalized paid intervals and recording
  fake signing. Normal runtime separately returns 503 without fake/legacy URLs.
- **23 React browser assertions passed**, in the in-app browser under StrictMode.
  The actual AuthProvider, AudioProvider, AudioPlayer and controls are mounted
  with a test-only Axios adapter and Audio double. Tests cover issuance shape,
  rapid selection/late responses, index-zero/noncontiguous navigation, denials,
  disabled-control activation, invalid response IDs/URLs, failed play/media,
  local expiry/manual renewal, identity changes and logout. This is not one
  browser-to-provider end-to-end delivery test; HTTP and React evidence are separate.
- Existing frontend unit suite: `node --test test/*.test.cjs`: **14 passed**.
- TypeScript: `node node_modules/typescript/bin/tsc --noEmit --emitDeclarationOnly false`: pass.
- Nonmutating ESLint of src: pass. Vite test-mode build to a disposable /private/tmp
  directory: pass. Existing warnings remain: browser compatibility data is 22
  months old and main chunk exceeds 500 kB. Diff and new-server-module syntax
  checks pass. Browser/build/type/lint used existing packages; no dependencies changed.

To reproduce the browser checks with the existing isolated launcher:

```sh
node test/browser-harness.mjs
```

Open `http://127.0.0.1:3000/test/playback-browser.html` and read the 23-assertion
result. Use pinned Node 24.19.0 for the launcher because it loads the sibling
backend fixture; loopback permissions are needed. The launcher provides synthetic
frontend environment values and starts only disposable fixture services. Stop
with Ctrl-C. The playback page's Axios and Audio doubles are never imported by
src or included in the normal Vite entry bundle; there is no production test flag
or server grant endpoint. Production playback still requires genuine adapters.
The existing launcher startup-failure cleanup limitation described in
IDENTITY_HANDOFF.md is unchanged.

A disposable screenshot is at `test/evidence/playback-checks.jpg` (Git-ignored).
Versioned test sources are `test/playback-browser.html` and `.tsx`; the screenshot
is not required to reproduce the checks. This page tests behavior without product
styles and is not visual QA of the complete application. No real media was fetched.

## Remaining prerequisites and policy

Backend billing synchronization/schema currently supplies no trustworthy paid
interval; legacy status fields are not consumed by playback. Final provider
approval, real immutable playback mappings, signing and private delivery are
incomplete. Future signing credentials must access only the private MP3 playback
bucket; the separate WAV archive must be inaccessible to them. Interface/path
validation alone cannot prove provider policy, file content or archive separation.

Trials, past-due grace, refunds/disputes, paused accounts, gifts and admin playback
exceptions remain unapproved. Subscriber metadata visibility remains an owner
choice; this task preserves the existing API-key-only full metadata endpoint.
Real provider access/expiration, copied/wrong-object/unsigned URL denial, CORS,
Range/seek behavior and legacy Cloudinary URL retirement require separately
approved verification. Existing caches, seeds and deployed clients can retain
old media URLs. Hosted identity/schema/configuration/recovery blockers remain.
No production data, protected remote media, billing synchronization, migration,
upload, provider settings, purchase, deployment, restoration, push or merge was
performed. Fake signing establishes application boundaries only.
