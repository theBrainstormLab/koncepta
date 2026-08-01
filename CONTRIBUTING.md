# Contributing

## Getting set up

Follow the "Running it locally" section in [README.md](./README.md) first. You'll need your own Supabase project with the tables in [SCHEMA.md](./SCHEMA.md).

## Making changes

1. Fork the repo and create a branch off `main`.
2. Keep changes focused. One PR, one thing.
3. Run `bun run lint` before opening a PR.
4. Write a clear commit message and PR description: what changed, and why.

## Code style

- Match the existing patterns in `src/pages` and `src/components` (functional components, hooks, Tailwind utility classes).
- Keep components small and readable over clever.
- No unused imports or console logs in the final commit.

## Reporting bugs

Open an issue with steps to reproduce, what you expected, and what happened instead. Screenshots help.

## Suggesting features

Open an issue describing the feature and why it'd be useful. For anything bigger than a small addition, it's worth opening the issue before writing the code, so we can talk it through first.

## Questions

Open an issue.
