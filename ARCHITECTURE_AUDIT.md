# Architecture Audit — v11 Hardening

Date: 2026-09-23  
Scope: routing, content contracts, state/persistence, grading, analyst tools, rendering security, build/CI, deploy artifacts and long-term extensibility.

## Executive summary

The v10 refactor successfully split the former single-file application into content, data, domain, state, pages and routing layers. The audit found several issues that would become expensive as the course grows. The highest-risk items were fixed in this branch before merge.

The project is now materially safer to extend, but two structural migrations should be completed before large-scale curriculum reordering or cloud accounts: stable topic identifiers and a stronger deployment pipeline.

## Findings

| Severity | Finding | Risk | Status |
|---|---|---|---|
| P0 | Analyst calculators executed DOM expressions with `new Function` | Dynamic code execution and UI/domain coupling | FIXED |
| P0 | User-controlled search/imported progress could be rendered into HTML without escaping | DOM injection / corrupted UI | FIXED |
| P0 | Imported progress objects were broadly trusted | Invalid state could propagate through the app | FIXED |
| P1 | Practice cases were persisted by array position | Reordering cases detached answers from the correct case | FIXED with stable case IDs + legacy fallback |
| P1 | Chapter grading trusted raw input values | Values outside 0–100 could distort pass state | FIXED |
| P1 | Content validator hard-coded 50 levels / 247 topics | Adding curriculum required code changes | FIXED; counts now come from manifest |
| P1 | Validator did not verify source/prerequisite/canon relationships | Broken references could ship silently | FIXED |
| P1 | `src/` and committed `app/` can drift | GitHub Pages could serve code different from reviewed TypeScript | MITIGATED; CI now checks build drift |
| P1 | Topic/checkpoint/note progress is keyed by level/topic array position | Reordering topics can attach historic progress to the wrong concept | OPEN — next migration |
| P1 | Browser smoke scripts exist but are not executed in CI | Route/render regressions can pass unit CI | OPEN |
| P2 | Router accepts arbitrary path parts and numeric parameters | Invalid deep links become load errors instead of typed not-found routes | OPEN |
| P2 | No dependency lockfile | Toolchain install is not fully reproducible | OPEN |
| P2 | Branch protection/rules are not enforced on the current branch | A direct push to main can bypass PR discipline | OPEN / repository setting |
| P2 | Product/version labels still say v10 while hardening is v11 | Operational confusion, not runtime risk | OPEN until release |
| P3 | Several page templates directly render trusted versioned curriculum strings | Safe while content stays repository-controlled, but limits future CMS/user content | ACCEPTED for current architecture |

## Hardening completed in this branch

### Domain isolation

Analyst calculator definitions and formulas now live in one typed domain registry under:

`src/features/tools/calculators.ts`

The UI renders definitions and sends numeric inputs to the domain function. No formula is executed from a DOM attribute or JSON string.

### Persistence trust boundary

Progress import/storage is normalized before becoming application state. Scores are bounded, malformed maps are rejected, unsupported values are ignored, and oversized imports fail closed.

### Stable practice-case identity

Every practice case now has a stable string ID. Existing numeric-index answers still render through a legacy fallback, so the change does not erase old progress.

### Rendering boundary

Search text, imported progress text and external source metadata are escaped before insertion into HTML. External links are limited to HTTP/HTTPS.

### Content integrity

Validation now verifies:

- manifest metadata matches actual curriculum size
- level IDs are unique
- prerequisite level IDs exist
- level/topic source references exist
- source URLs are valid HTTP/HTTPS
- Research Canon references existing sources
- practice-case IDs are stable and unique
- required topic learning invariants remain intact

### Build integrity

CI rebuilds TypeScript and rejects the change if committed `app/` output differs from the compiled result. This makes source/runtime drift visible before merge.

## Remaining architectural work

### 1. Stable topic IDs — highest remaining priority

Current keys such as:

`level:topicIndex`

are position-based. Before topics are reordered, inserted in the middle, merged or split, every topic should receive a permanent ID such as:

`tokenomics.free-float`

Progress should then be keyed by that ID. A schema migration must map existing positional keys to the new IDs using the current curriculum snapshot.

This should be done once, deliberately, before the course structure becomes more fluid.

### 2. Typed router

Replace free-form path parsing with a route parser that validates:

- route name
- integer level ID
- topic existence
- malformed URI segments
- explicit not-found state

The router should own validation instead of allowing pages to discover invalid parameters through failed fetches.

### 3. CI browser smoke

Promote the existing Playwright smoke test into CI and test at minimum:

- desktop Chromium
- iPad-like viewport
- home → curriculum → level → topic → exam
- Practice Lab
- search with encoded/malformed input
- progress export/import
- back/forward navigation

### 4. Reproducible toolchain

Add and maintain a package lockfile, then move CI from `npm install` to `npm ci`.

### 5. Deployment separation

Longer term, prefer a build artifact deployed by GitHub Actions rather than treating committed `app/` as a permanent source tree. Until that migration is made, the new CI drift gate is mandatory.

### 6. Main-branch governance

Enable branch protection or a repository ruleset requiring:

- pull requests
- passing CI
- no force push
- ideally one review for structural changes

## Merge criteria for PR #3

PR #3 should remain draft until:

1. all current CI checks are green
2. compiled-runtime drift check is green
3. Practice Lab answers survive case reordering by stable ID
4. search/import rendering checks pass
5. no direct regression is observed on GitHub Pages/iPad layout

Stable topic IDs and typed routing can be a follow-up PR because they are larger migrations and should not be mixed blindly into the current security/state hardening.

## Decision rule going forward

A change is architecturally acceptable when:

- content changes do not require page-code changes
- domain rules have one source of truth
- identifiers survive reordering
- persisted state has a migration path
- untrusted input is normalized/escaped
- build output is reproducible
- failure is local and recoverable
