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
