# Architecture

## Rules

1. **Content never lives in UI code.** Lectures, topics, cases and sources live under `content/`.
2. **Pages do not own persistence.** All progress mutations go through `src/store/progressStore.ts`.
3. **Domain rules stay in features.** Mastery and grading cannot be reimplemented inside a page.
4. **Navigation is centralized.** Routes go through `src/router/router.ts` and `data-route` actions.
5. **Every state schema change requires a migration.** Never overwrite old user progress ad hoc.
6. **Main is deployable.** Work on `feature/*` or `fix/*`, validate, review, then merge.

## Change map

- Edit a lecture/topic → `content/curriculum/level-XX.json`
- Change mastery rules → `src/features/learning/mastery.ts`
- Change chapter grading → `src/features/exams/grading.ts`
- Change navigation → `src/components/Navbar.ts` + router if needed
- Change persistence → `src/store/` and add a migration
- Change a page layout → `src/pages/`
- Change shared visual element → `src/components/`
- Change theme → `styles/`

## Release gate

Before merge: content validation → TypeScript → unit tests → build → browser smoke.
