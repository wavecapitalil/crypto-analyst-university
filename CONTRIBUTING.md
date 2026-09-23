# Safe Change Workflow

This repository is intentionally structured to make frequent curriculum and product changes safe.

## Before coding

Create a branch using one of:

- `feature/<name>`
- `fix/<name>`
- `refactor/<name>`

Do not experiment directly on `main`.

## Editing rules

- Curriculum edits belong in `content/`, not page templates.
- Business rules belong in `src/features/`.
- Storage access belongs in `src/store/`.
- Pages should orchestrate and render; they should not redefine grading, mastery, persistence or calculator logic.
- Never introduce `eval` or `new Function`.
- Any new persisted field must have a default and migration/normalization path.
- Keep stable curriculum identifiers stable.

## Required checks

Run:

```bash
npm install
npm run check
npm run build
```

Then smoke-test the main routes in a browser, including mobile width:

```text
#/home
#/curriculum
#/level/0
#/topic/0/0
#/exam/0
#/cases
#/tools
#/search/test
```

Test export/import of progress before merging any persistence change.

## Review checklist

A reviewer should be able to answer yes to all of these:

- Does the change live in the correct layer?
- Is there one source of truth for each rule?
- Can malformed input fail safely?
- Is existing progress preserved?
- Are route/content identifiers stable?
- Are tests present for new domain logic?
- Does the browser runtime still load on GitHub Pages?

If not, do not merge.
