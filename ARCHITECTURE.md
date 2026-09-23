# Architecture — Wave Capital Crypto Analyst University

## Purpose

This repository is a learning platform, not a single HTML document. The architecture is designed so curriculum content, scoring rules, persistence, navigation and UI can evolve independently without turning every content change into a deployment risk.

## Non-negotiable boundaries

1. **Content never lives in UI code.** Lectures, topics, cases, sources and curriculum metadata live under `content/`.
2. **Pages never write storage directly.** All progress mutations go through `src/store/progressStore.ts`.
3. **Domain rules stay outside pages.** Mastery, exam grading and analyst-tool calculations belong under `src/features/`.
4. **Navigation is centralized.** Route parsing and navigation stay in `src/router/`.
5. **External or persisted data is untrusted.** JSON loaded from disk, browser storage and imported progress must cross validation/normalization boundaries before use.
6. **No dynamic code execution from content.** Never use `eval`, `new Function` or executable expressions stored in JSON/DOM attributes.
7. **State changes are versioned.** Any incompatible progress-state change requires a migration before release.
8. **Main is always deployable.** Work happens on `feature/*`, `fix/*` or `refactor/*` branches and reaches `main` only after validation.
9. **Source is authoritative.** `src/` and `content/` are the editing surfaces. `app/` is compiled runtime output and must remain in sync for GitHub Pages.
10. **Failure should be local, not catastrophic.** A broken route, malformed import or calculator input must fail closed without destroying user progress or the whole application.

## Layer model

```text
content/                  versioned curriculum and research content
        ↓
src/data/                 loading, caching, repository boundary
        ↓
src/features/             learning/mastery/exams/tools/search domain logic
        ↓
src/store/                versioned persistence, normalization, migrations
        ↓
src/pages/ + components/  presentation and interaction
        ↓
src/router/               navigation boundary
        ↓
src/main.ts               bootstrap only
```

Cross-layer imports should move downward through this model. Pages may call features/store/data; domain modules should not depend on pages.

## Change map

- Edit lecture/topic → `content/curriculum/level-XX.json`
- Edit cases → `content/cases.json`
- Change mastery rules → `src/features/learning/mastery.ts`
- Change chapter grading → `src/features/exams/grading.ts`
- Change analyst calculators → `src/features/tools/calculators.ts`
- Change navigation → `src/router/` and shared navigation component
- Change persistence → `src/store/` plus migration/normalization tests
- Change page layout → `src/pages/`
- Change shared UI → `src/components/`
- Change theme → `styles/`

## Data contracts

Curriculum JSON is code-adjacent data and must satisfy the repository validator before release. Progress JSON is user-controlled data and must be normalized before it enters application state. Never spread arbitrary imported objects directly into trusted state.

Stable IDs matter. Existing level/topic/case IDs should not be silently reused for different concepts because progress keys depend on them.

## Release gate

Before merge:

1. content validation
2. TypeScript typecheck
3. unit tests
4. production build
5. browser smoke test
6. verify compiled runtime exists
7. review changed content/state contracts
8. merge only when the branch is green

## Rollback strategy

`legacy/` keeps the pre-refactor snapshot. Production changes should be small enough that a bad release can be reverted by commit instead of repaired live on `main`.

## Architectural rule of thumb

If a future change requires editing the same business rule in more than one place, the abstraction is wrong. Move that rule into one domain module and make the UI consume it.
