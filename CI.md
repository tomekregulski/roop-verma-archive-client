# Frontend automated verification

## Minimal pipeline

`.github/workflows/ci.yml` runs on pull requests targeting `main` and pushes to
`main` (GitHub's actual default branch, confirmed read-only on 2026-10-24).
There was no existing CI configuration. This repository remains independent of
the backend. One Ubuntu job uses `.nvmrc` (Node 18.15.0), the existing
`packageManager` pin (pnpm 9.1.2), and the frozen lockfile.

The job runs all existing standalone unit tests, `pnpm build` (which already
runs TypeScript before Vite), and non-mutating ESLint with the existing rules.
Running `type-check` separately would repeat the same `tsc` invocation. No
automated test package script existed; Node's test runner is invoked directly.
The existing `lint` script formats and fixes files; CI invokes ESLint directly
without `--fix` instead. Whole-repository Prettier rewriting is excluded.
No lint rule, security assertion, dependency, lockfile or application file was
changed to establish CI.

The workflow has read-only contents permission, no persisted checkout
credentials, no secrets, a ten-minute timeout and cancellation of superseded
runs for the same PR/ref. Official checkout/setup-node v6 actions are pinned to
verified release commit SHAs. There is no deployment or privileged PR workflow.

## Reproduce locally

Use a clean checkout with no `.env*` files or provider configuration. Select
Node with `nvm install && nvm use`, then:

```sh
npm install --global pnpm@9.1.2 --ignore-scripts --no-audit --no-fund
pnpm install --frozen-lockfile --ignore-scripts
node --test test/*.test.cjs
VITE_API_ORIGIN=http://127.0.0.1:8090 \
VITE_API_KEY=synthetic-public-key \
VITE_RVDL_EMAIL_ADDRESS=help@example.invalid pnpm build
pnpm exec eslint src --ext .jsx,.js,.ts,.tsx --quiet
```

These are public, build-only placeholders. Stripe's publishable key and other
provider configuration are deliberately absent. The build does not open a
browser or make application API/email/Stripe calls. Never supply production
values to verification. Dependency installation still downloads public packages;
dependency lifecycle scripts are disabled, matching the existing test setup.

## Actual results — 2026-10-24

Local macOS arm64, isolated source copy without env files, freshly installed
locked dependencies, Node **18.15.0**, pnpm **9.1.2**:

| Check                                             | Local outcome                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------ |
| Frozen dependency install with scripts disabled   | Passed; lockfile unchanged                                                     |
| Proof and shared-control unit tests               | 14 passed                                                                      |
| `pnpm build` (TypeScript and Vite)                | Passed                                                                         |
| Non-mutating ESLint                               | Failed: `src/views/LoginGate.tsx:38`, two trailing spaces, `prettier/prettier` |
| Workflow YAML and triggers/permissions inspection | Passed                                                                         |

The lint error was reproduced before workflow implementation and after a clean
install. It remains enforced and visible: this workflow is expected to fail
until that formatting-only application follow-up is approved and fixed. No broad
cleanup or lint suppression was added. Existing build warnings concern old
Browserslist data and the main bundle exceeding 500 kB; they remain unchanged.

**Hosted results: pending.** No changes were pushed and no hosted runs were
observed. Local execution does not establish Linux/GitHub Actions compatibility;
YAML parsing and manual review do not replace a hosted workflow run.

## Exclusions and publication

Cross-repository browser orchestration remains deferred. `test/browser-harness.mjs`
needs a sibling backend, fixed loopback ports and interactive browser controls;
it is not a self-contained headless acceptance runner. The documented startup
cleanup and wrong-origin reachability-control follow-ups also remain open. See
[IDENTITY_HANDOFF.md](IDENTITY_HANDOFF.md) for historical synthetic browser
evidence and reproduction. Unit tests cover proof handling and component
semantics, not real browser cookies, keyboard navigation or end-to-end identity.
Real email, Stripe, deployed HTTPS/CORS/cookies, billing, media access and overall
beta readiness remain unverified by CI.

Tracked deployment inspection found only `netlify.toml` SPA redirects, no CI or
deployment jobs. Provider-side Netlify production/preview auto-deploy settings
are unknown; a branch push or PR could trigger a provider build independently
of Actions. Publishing requires explicit authorization after confirming the
connected site's production branch, branch deploy/PR preview behavior and build
hooks are safe for the proposed push. No push is proposed as safe on the basis
of the checked-in redirects alone. Repository settings and branch protection
were not changed.

After fixing the existing lint failure and observing reliable hosted runs,
suggest requiring **Frontend verification**. Do not require it on the strength
of local results alone. Keep any branch-protection change separately authorized.

Configuration references checked 2026-10-24: GitHub's
[workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax),
[Node.js verification guide](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs),
and [setup-node documentation](https://github.com/actions/setup-node/tree/v6).
