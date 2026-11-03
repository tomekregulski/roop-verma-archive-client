# Client working instructions

## Function documentation and spacing

- Add brief JSDoc comments to named functions, hooks, methods and named callbacks in new or changed client code, including test helpers.
- Explain purpose and non-obvious behavior or constraints. TypeScript already describes parameter and return types; avoid redundant tags and obvious implementation narration. Short anonymous JSX callbacks do not need ceremonial comments.
- Separate consecutive function/method declarations with one blank line, including named arrow functions and hook callbacks. Keep each JSDoc block directly above its declaration.
- Apply this convention to touched code; avoid unrelated formatting or documentation sweeps.

Existing React and maintainability preferences are recorded in [DEVELOPMENT_NOTES.md](DEVELOPMENT_NOTES.md).
