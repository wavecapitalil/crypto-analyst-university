# Wave Capital Crypto Analyst University — v10 Architecture

Production-safe modular refactor of the v9.2 single-file prototype.

## Design goals

- Content, state, UI and domain logic are separated.
- 50 Levels are individual JSON documents; editing a lecture cannot break routing.
- Progress storage is versioned and migrates the legacy `wave_crypto_uni_v7` state.
- Browser runtime has **zero external dependencies**. This keeps GitHub Pages stable and reduces supply-chain/runtime risk.
- TypeScript source compiles to native ES modules in `/app`.
- CI validates curriculum invariants before changes are accepted.

## Architecture

```text
content/           Curriculum, cases, sources, canon
src/data/          Data loading + cache
src/features/      Mastery, grading, search domain logic
src/store/         Versioned persistence + migrations
src/components/    Shared UI
src/pages/         Route-level UI
src/router/        Hash router
styles/            Visual system
app/               Compiled JS deployed by GitHub Pages
tests/             Unit + browser smoke tests
legacy/            Rollback snapshot
```

## Safe workflow

1. Create `feature/...` branch.
2. Edit source/content only.
3. Run `npm run check` and `npm run build`.
4. Browser smoke test.
5. PR → CI → review → merge to `main`.

`main` should always remain deployable.
