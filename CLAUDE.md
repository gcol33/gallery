# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Personal photography gallery. Static HTML/CSS/JS on GitHub Pages (CNAME set).
Photo grading pipeline lives in `scripts/`, raw files in `photos/raw/<set>/`,
graded web outputs in `photos/<set>/`.

## Grading Workflow (CRITICAL)

**Always explore via comparison grids. Never lock in a single edit silently.**

When grading a photo, or tuning any parameter (crop, tone, blend alpha, subject
emphasis), the default workflow is:

1. Produce 4-6 variants sweeping one axis (or spanning distinct directions).
2. Build a side-by-side HTML page via `scripts/side_by_side.py` (`build_side_by_side`).
3. Let the user pick a winner before touching the canonical `<photo>.jpg`.
4. Only after a pick is confirmed: collapse `scripts/grade_<photo>.py` into the
   minimal locked recipe.

This applies to **every** iteration — initial look, crop percentage, blend
ratios, subject-emphasis methods, tonal pushes. If you're unsure whether to
render a sweep, render a sweep. A grid is cheap; a silent lock is not.

One photo per `grade_<photo>.py` and one `build_<photo>_comparison.py`.
Variant outputs use suffixes (`<photo>_<variant>.jpg`); the canonical pick is
always `<photo>.jpg`.

## Presets

Reusable grading functions live in `scripts/presets/library.py`, exported via
`scripts/presets/__init__.py`. When a recipe proves useful on multiple photos,
promote it into the preset library rather than duplicating inline. Each preset
is a complete look (not a neighborhood tweak) — for small adjustments to an
existing preset, pass kwargs through rather than forking.

Post-process helpers (`tone_push`, `apply_emphasis`, `blend`) operate on
already-graded JPGs so they can be chained after any preset.

## Photo Sets

- `photos/raw/landscapes-spring/` — FWF ESPRIT / spring landscape competition set
- `photos/raw/comedy-wildlife/` — Comedy Wildlife Awards submissions

Filenames are lowercase single-word slugs matching their display title
(e.g. `monolith.jpg` displays as "Monolith"). When a display title has spaces
(e.g. "Corn and Rabbit"), the filename stays a short slug (`rabbit.jpg`) and
the HTML `data-title` / `figcaption` carries the full title.

## Build / Deploy

Static site — no build step. Edit HTML/CSS/JS directly, commit, push.
Image grading is the only pipeline: `python scripts/grade_<photo>.py`.
