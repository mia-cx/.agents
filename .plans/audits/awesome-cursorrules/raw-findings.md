## rules-new/clean-code.mdc
**Type**: General clean-code and maintainability checklist (naming, SRP, DRY, structure, testing, VCS hygiene).
**Portable**: Yes.
**Reason**: Language- and stack-agnostic software-engineering principles; no Cursor-, repo-, or tool-specific rules; empty `globs` keeps applicability broad.
**Strip**: YAML frontmatter (`description`, `globs`) if the target SOP is human-only; align or drop the "write tests before fixing bugs" line with org QA policy if needed.
**Notes**: Strong SOP handbook material; pair with project style/lint config so "consistent naming" and comment norms do not conflict with enforced rules.

## .cursorrules
**Type**: Maintainer SOP for a curated "awesome" registry of third-party `.cursorrules` (README layout, `rules/` taxonomy, naming, links, and Cursor-oriented doc quality).
**Portable**: Partial.
**Reason**: General guidance (Markdown for docs, clarity, relative links, accurate TOC, Cursor capitalization, repo-level vs global rules) transfers to many repos; the enumerated README section order (badge, logo, nine fixed sections), the fixed category list for `rules/`, the naming pattern `technology-focus-cursorrules-prompt-file`, and per-folder README conventions are specific to this list project.
**Strip**: README structure checklist (lines 9–28), verbatim category lists and "place in rules folder" rules (lines 31–44), naming pattern and alphabetical-order rules tied to this README (lines 47–49), and cross-reference guidance that assumes this taxonomy; keep or rephrase the content/best-practices and "Additional insights" blocks if reusing elsewhere.
**Notes**: `//` comment style reads like JS but is harmless in `.cursorrules`. Valuable as a pattern for maintaining any curated rules collection; a poor drop-in for app/service codebases that are not maintaining an awesome-list layout.
## rules-new/gitflow.mdc
**Type**: Gitflow workflow SOP — branch model (main, develop, feature/*, release/*, hotfix/*), conventional commit prefixes, SemVer, PR rules, branch-protection expectations, and numbered release/hotfix procedures.
**Portable**: Yes — purely Git/process guidance; no repo paths, globs, stack locks, or IDE behavior.
**Reason**: Self-contained playbook an agent or team can apply in any Git host that supports branching and PRs; merge targets and naming rules are explicit and technology-agnostic.
**Strip**: YAML frontmatter (`description:` line and delimiters) meant for Cursor rule indexing; optional tightening of policy literals (e.g. “minimum 1” approval, “include administrators”) if the SOP should stay vendor-neutral.
**Notes**: Content is standard Gitflow + conventional commits — valuable as a compact checklist, not novel. Assumes a long-lived develop branch and protected main; teams on trunk-based or GitHub Flow should label the doc as Gitflow-specific to avoid policy clash.

## rules-new/codequality.mdc
**Type**: Meta / assistant-conduct rules — verification discipline, edit granularity, communication constraints (no apologies, no “understanding” feedback), scope control (no inventions, preserve unrelated code), and link hygiene; not engineering “code quality” (tests, linting, architecture).
**Portable**: Partial — verify-before-claiming, don’t invent scope, preserve unrelated code, and don’t ask users to re-verify what context already proves are portable SOP clauses. File-by-file pacing, single-chunk edits, “no summaries,” and blanket bans on apologies/understanding-feedback are workflow- and persona-specific; often clash with org norms (PR descriptions, pair-programming cadence, accessibility-friendly tone).
**Reason**: The evidence-and-scope lines lift cleanly into a generic agent SOP. The remainder encodes one user’s preferred review rhythm and voice rather than transferable process; the filename overpromises vs. content.
**Strip**: YAML frontmatter (`description`, empty `globs`); rules that duplicate or fight higher-priority org agent instructions; optionally drop or rewrite `No Summaries` / `Single Chunk Edits` / `File-by-File Changes` if the target SOP assumes parallel edits or required change narratives; soften `No Apologies` / `No Understanding Feedback` into a neutral “professional tone” policy if needed.
**Notes**: Best mined as a short “scope & evidence” subsection (≈5 bullets) rather than adopted wholesale. Keep `Provide Real File Links` as “cite real workspace paths or URLs, not placeholder filenames.” `No Current Implementation` is context-dependent — useful for execution-only tasks, harmful for teaching/reviews.

## rules-new/medusa.mdc
**Type**: Medusa v2 stack SOP — Workflow SDK patterns (steps, transform, when, no async workflow fn), Query for reads, `MedusaError`, `model` utility and naming (camelCase vars, snake_case fields/names), services extending `MedusaService`, admin via JS SDK and Tailwind.
**Portable**: Partial.
**Reason**: Almost all rules assume `@medusajs/framework` and Medusa commerce architecture; TS/React/Tailwind mentions are incidental to that stack, not generic frontend guidance.
**Strip**: YAML frontmatter (`description`, `globs`); the LLM doc link block if the SOP is offline or not Medusa-specific; entire sections when the codebase is not Medusa.
**Notes**: Tight, actionable Medusa checklist; workflow constraints (e.g. no `await` on steps, non-async workflow function) are framework-specific and must not be generalized to other workflow libraries.

## rules-new/beefreeSDK.mdc
**Type**: Vendor integration playbook for Beefree SDK — install/auth (V2 login, proxy server), container markup/CSS, `beeConfig` (container required, callbacks, merge tags), React/HTML init, HTML importer API, security and UX practices, long runnable examples.
**Portable**: Partial.
**Reason**: Portable slices are “proxy credentials,” `onError`, lazy init/cleanup, and separation of config vs business logic; the rest is Beefree-specific URLs, package names, and API shapes.
**Strip**: Frontmatter; pinned dependency JSON and localhost:3001 URLs if turning into a generic “email builder SDK” SOP; trim duplicate long code samples after extracting principles; reconcile or drop snippets that show client secrets in browser fetches (conflicts with stated security rules).
**Notes**: Strong operational detail; readers should treat version pins and port numbers as examples only. One “getBeeToken” HTML example undermines the “never expose credentials in frontend” rule—keep the proxy pattern as canonical.

## rules-new/rust.mdc
**Type**: Solana smart-contract SOP with Anchor — program layout (`lib.rs`, modules, `declare_id!`), account validation and CPI patterns, Borsh/zero-copy/repr guidance, TypeScript tests with Anchor workspace, bare `solana_program` notes, security (PDAs, signer checks), performance and CI (`anchor test`, deploy/IDL hygiene).
**Portable**: Partial.
**Reason**: Applies within Rust+Solana+Anchor (and related test tooling); not general Rust application guidance despite the filename.
**Strip**: Frontmatter; project-specific claims (e.g. where to commit `Cargo.lock`) if they differ from your monorepo policy; fix or ignore the erroneous “`msg.sender`” wording when lifting signer-validation bullets (Solana uses signers/accounts, not Ethereum msg.sender).
**Notes**: Filename says “rust” but body is Anchor/Solana-specific — relabel in a merged SOP to avoid misleading non-blockchain Rust teams. Otherwise a solid condensed Anchor checklist.

## rules-new/cpp.mdc
**Type**: C++ / CMake engineering SOP — naming, functions, data/classes, exceptions, memory (RAII, smart pointers), testing (AAA, Given-When-Then), project layout, stdlib, and concurrency.
**Portable**: Yes — for C/C++/CMake codebases matching the globs; no Cursor- or host-specific behavior.
**Reason**: Self-contained language and tooling conventions (ODR, SOLID, Rule of Five, modern std types); `alwaysApply: false` scopes by file patterns.
**Strip**: YAML frontmatter (`description`, `globs`, `alwaysApply`); directory layout bullets (`include/`, `src/`, etc.) if they conflict with an existing repo standard; Doxygen depth if docs policy differs.
**Notes**: Aligns with mainstream modern C++; some rules are opinionated (e.g. default parameters vs null checks, “don’t abuse primitives”).

## rules-new/svelte.mdc
**Type**: Svelte / SvelteKit / Vite checklist — components, reactivity, stores, routing, forms, TypeScript, testing, build.
**Portable**: Partial — applies only where Svelte/SvelteKit/Vite match team stack; globs assume `src/**` for TS/JS.
**Reason**: Stack-scoped best-practice reminders; no project paths or Cursor-only directives; content is generic (“proper X”) rather than repo-specific.
**Strip**: YAML frontmatter; bullets are repetitive placeholders — replace with concrete org choices (testing libs, store patterns) or drop if redundant with lint/docs.
**Notes**: Low specificity — mostly “do things properly”; thin as an executable SOP without project conventions layered on top.

## rules-new/vue.mdc
**Type**: Vue 3 SOP — Composition API, Pinia, Vue Router, Vite, forms, TypeScript, testing (Vue Test Utils), performance patterns.
**Portable**: Partial — Vue ecosystem only; globs are broad (`**/*.ts`, `components/**/*`) and may hit non-Vue TS if not careful.
**Reason**: Mirrors the Svelte rules-new style: stack checklist without Cursor hacks or repo-specific paths.
**Strip**: YAML frontmatter; tighten `globs` for monorepos; swap Pinia/Router/Vite bullets if the project differs; same “proper” vagueness as sibling file.
**Notes**: Nearly structural twin of `svelte.mdc`; use as a seed list and rewrite with team-specific norms and tooling versions.

## rules-new/nativescript.mdc
**Type**: NativeScript mobile SOP — modular structure, `.ios.ts`/`.android.ts` splits, native class patterns (iOS delegates/GC), platform defines, timers, UI (Grid/Stack, ListView), Tailwind + NS plugin versions, performance and `ns clean`.
**Portable**: Partial — strong NativeScript and Tailwind-for-NS coupling; version pins (`@nativescript/tailwind`, `tailwindcss`) may go stale.
**Reason**: Actionable stack rules (platform files, `__ANDROID__`/`__APPLE__`, delegate retention) transferable within NS teams; frontmatter only scopes files.
**Strip**: YAML frontmatter; pinned dependency versions unless maintained; Angular/React/Solid/Svelte/Vue umbrella line if the app uses only one UI framework; XML/Observable bits if using framework bindings only.
**Notes**: Wide globs cover Vue/Svelte/TSX — good for NS+frameworks, noisy if imported outside NS; minor wording glitch (“Always TailwindCSS”) in source.

## rules-new/python.mdc
**Type**: Python stack guide — layout, Black/isort/PEP 8, typing (`typing` module, `Optional` not `| None`), Flask factory/blueprints/SQLAlchemy/Alembic, auth (Flask-Login, OAuth), REST, pytest, security and performance checklists.
**Portable**: Partial — generic Python style, types, testing, and security bullets travel well; most sections assume **Flask + SQLAlchemy/SQLite** and named libraries (e.g. Flask-RESTful, bcrypt), so non-Flask or async stacks need heavy rewrite.
**Reason**: Self-contained cookbook for one web stack; globs target `*.py` only — portable clauses are mixed with stack-specific ops.
**Strip**: YAML frontmatter; Flask/SQLAlchemy/auth/API subsections if the project is not Flask; reconcile `Optional[T]` vs modern `T | None` with team Python version and style guide.
**Notes**: Useful as a Flask-centric checklist, not a neutral “Python only” SOP; line length 88 matches Black default.

## rules-new/react.mdc
**Type**: React UI SOP — functional components, hooks rules, local/context state, memoization, forms, error boundaries, RTL testing, a11y, file organization.
**Portable**: Yes for React codebases — conventional guidance with no Cursor- or repo-specific directives beyond glob hints.
**Reason**: Hooks, state locality, and testing/a11y bullets apply broadly; stack is React-only (no router/state-library prescription beyond “when necessary”).
**Strip**: YAML frontmatter; the TypeScript prop-types bullet if the codebase is JSX-only; tune examples to match existing state-library choices.
**Notes**: Short, checklist-style; complements `typescript.mdc` for TSX projects; stops mid-sentence on last line (“complex component logic”) — minor source blemish.

## rules-new/typescript.mdc
**Type**: TypeScript language SOP — interfaces vs types, strict mode, naming (incl. `*Props`), organization/barrels, functions, discriminated unions, error handling, and named OOP patterns (Builder, Repository, Factory, DI, Module).
**Portable**: Yes for any TS project — rules are language-level with generic globs.
**Reason**: No tool lock-in; conventions map cleanly to `tsconfig`-driven workflows.
**Strip**: YAML frontmatter; “interfaces over types” / React `Props` prefix if they conflict with lint or team standards; pattern list may be noise for small apps.
**Notes**: Practical baseline for strict TS; Result types and error boundaries are mentioned briefly — may need linking to real project error libraries.

## rules-new/tailwind.mdc
**Type**: Tailwind CSS SOP — config/theme, utility-first vs `@apply`, responsive/dark mode, layout/typography/color, **shadcn/ui** mention, performance (purge, bundle), general hygiene.
**Portable**: Partial — Tailwind mechanics are reusable; **shadcn/ui** and “purge” framing anchor a specific component stack and Tailwind 2/3-era vocabulary (modern docs use content paths/JIT).
**Reason**: Most sections apply wherever Tailwind runs; a few lines assume a React+shadcn adjacent setup from globs.
**Strip**: YAML frontmatter; shadcn subsection when not used; replace or clarify “purge” vs current Tailwind content configuration for the project major version.
**Notes**: Good quick reference for utility discipline and a11y reminders; “container queries” and responsive sections are brief — pair with project `tailwind.config` as source of truth.

## rules-new/database.mdc
**Type**: Database checklist focused on Prisma (schema, queries, migrations) and Supabase (setup, RLS, auth, queries) plus generic design, performance, and security bullets.
**Portable**: Partial — ORM/host choices are stack-specific; normalization, indexing, transactions, and RLS ideas transfer as concepts if names change.
**Reason**: High-level “do X properly” reminders with no Cursor- or repo-specific mechanics; frontmatter globs scope Prisma/Supabase paths only.
**Strip**: YAML frontmatter (`description`, `globs`); Supabase or Prisma sections when the stack differs; repetitive “proper” phrasing if tightening into a shorter SOP.
**Notes**: Very low specificity — reads like section headings without procedures or examples; fine as a coarse outline to expand with org standards.

## rules-new/fastapi.mdc
**Type**: FastAPI/Python API SOP outline — project layout, OpenAPI-oriented API design, Pydantic models, SQLAlchemy-style DB, JWT/OAuth2 auth, security, performance, testing, deployment, docs.
**Portable**: Partial — framework and Python paths are fixed; HTTP status codes, validation, testing, and deployment themes are broadly familiar.
**Reason**: Generic best-practice enumeration tied only by glob to `*.py`/`app`/`api`; no tool-specific agent rules.
**Strip**: Frontmatter; SQLAlchemy/JWT literals if the service differs; thin bullets that duplicate official FastAPI guidance if space is limited.
**Notes**: Same “use proper X” density as other stack templates — better as a trigger list than executable runbooks unless you add org defaults.

## rules-new/nextjs.mdc
**Type**: Next.js App Router + TypeScript checklist — `app` vs `components` vs `lib`, RSC-by-default, Suspense/dynamic imports, data fetching, routing, Zod forms, minimal client state; Tailwind mentioned only in frontmatter description.
**Portable**: Partial — App Router and RSC conventions are Next 13+ specific; ideas like server-first data and validation still translate to other React frameworks with adaptation.
**Reason**: More concrete than the generic backend rules (directory naming, `use client`, Zod); globs target TS/TSX broadly.
**Strip**: YAML frontmatter; App Router-only rules if the project uses Pages router; broaden globs note if `.ts` should not cover non-Next packages.
**Notes**: Version- and architecture-sensitive; pair with actual Next major version and styling stack because “Tailwind” is not spelled out in the body.

## rules-new/node-express.mdc
**Type**: Node.js/Express backend checklist — structure, middleware, REST API, DB layer, JWT/sessions/OAuth, security, performance, testing, deployment.
**Portable**: Partial — Express and Node idioms dominate; REST, auth, and ops bullets overlap other HTTP stacks conceptually.
**Reason**: Same template shape as `fastapi.mdc`; globs include `**/*.ts` and `src/**/*.ts`, which may overlap frontends in monorepos.
**Strip**: Frontmatter; merge with a shared “HTTP service” SOP if duplicating API-security sections across Node and Python rules; narrow globs for mixed TS codebases.
**Notes**: Thin procedural content; glob breadth is the main footgun — worth path-scoping (e.g. `server/**`) when adopting verbatim.

## rules/cypress-accessibility-testing-cursorrules-prompt-file/.cursorrules
**Type**: Cypress-only accessibility playbook — wick-a11y WCAG scans, keyboard/ARIA/contrast/focus patterns, TS auto-detect, 3–5 tests per page.
**Portable**: Partial — naming, grouping, and a11y intent generalize; `cy.wickA11y()` and structure assume Cypress + wick-a11y.
**Reason**: Tied to Cypress commands and a specific third-party a11y package; output contract is Cypress spec files.
**Notes**: Example uses `.tab()` chaining — may imply an extra Cypress tab plugin; otherwise a clear template for that stack.

## rules/cypress-api-testing-cursorrules-prompt-file/.cursorrules
**Type**: Cypress-only API testing playbook — `cy.request`, cypress-ajv-schema-validator, status/auth/error coverage, deterministic isolation, 3–5 tests per resource.
**Portable**: Partial — schema/status/auth testing ideas transfer; `validateSchema` import and `cy.request` are Cypress-specific.
**Reason**: Written around Cypress HTTP testing and one AJV helper package, not generic API clients.
**Notes**: Practical skeleton for contract-style API checks under Cypress; fixture/factory detail is light.

## rules/cypress-defect-tracking-cursorrules-prompt-file/.cursorrules
**Type**: Cypress-only defect/reporting playbook — qa-shadow-report, hierarchical `[Team][category]` describe titles, `[C####]` case IDs, sample `shadowReportConfig` with Google Sheets fields.
**Portable**: Partial — tagging hierarchy and metadata discipline travel as process; `ReportTracker` / config keys are tool-specific.
**Reason**: Centers on qa-shadow-report and example spreadsheet/credential wiring, not generic test docs.
**Notes**: Still useful as a naming/tagging convention without the package; treat URLs and key paths as placeholders only.

## rules/cypress-e2e-testing-cursorrules-prompt-file/.cursorrules
**Type**: Cypress-only E2E UI playbook — critical flows, `data-testid` selectors, `cy.intercept` mocks, avoid hard waits and visual-style asserts, 3–5 tests per file.
**Portable**: Partial — selector and isolation practices generalize; intercept/`cy.wait('@alias')` pattern is Cypress.
**Reason**: All examples and I/O assume Cypress-generated specs and native Cypress network stubbing.
**Notes**: Straightforward baseline E2E hygiene aligned with common Cypress 10+ intercept usage.

## rules/code-guidelines-cursorrules-prompt-file/.cursorrules
**Type**: Mixed meta assistant-conduct (verification, edit pacing, communication bans, scope preservation, links/context) plus language-agnostic engineering habits (naming, style alignment, performance, security, tests, errors, modularity, version compatibility, constants, edge cases, assertions).
**Portable**: Partial — evidence/scope/link hygiene and many coding bullets travel well; file-by-file pacing, single-chunk-only, no summaries, and blanket no-apologies/no-understanding-feedback are persona- and workflow-specific and may conflict with team PR or tone norms.
**Reason**: No stack or framework lock-in; content is a concatenation of agent ritual rules and generic “good code” reminders, similar in spirit to condensed codequality-style rulesets elsewhere in this audit.
**Notes**: Long overlap with typical “don’t invent scope / verify before claiming” SOPs — best mined selectively rather than adopted wholesale; engineering bullets are thin checklists without project-specific lint or architecture hooks.

## rules/code-style-consistency-cursorrules-prompt-file/.cursorrules
**Type**: Executable playbook for a “code style analyst” — pre-code repo sampling, style-profile template, adaptation techniques, and a short JS before/after example illustrating matching local conventions.
**Portable**: Yes — methodology (sample files, weight recent edits, mirror patterns, ask when inconsistent) applies to any stack; `//` comments read as JS but do not bind the rules to JavaScript.
**Reason**: No Cursor-only directives or pinned tooling; focuses on observational consistency with existing code rather than imposing an external standard.
**Notes**: Strong reusable pattern for agents joining brownfield codebases; pair with actual linter/formatter config so inferred style does not fight enforced rules.

## rules/code-pair-interviews/.cursorrules
**Type**: Interview-oriented clean-code brief — structure/SRP/modularity, 2-space indentation default, naming and commenting discipline, line-length guidance, edge cases and testing mindset.
**Portable**: Yes — general software craft framed for pair/whiteboard interviews; no framework or vendor coupling.
**Reason**: Prescriptive only at the level of common readability defaults (indent, line length); otherwise stack-agnostic.
**Notes**: Context is interview pacing (“start simple, optimize later”) — useful as a short candidate or session rubric, not a substitute for org-wide style guides.

## rules/ascii-simulation-game-cursorrules-prompt-file/.cursorrules
**Type**: Product/design spec for a specific turn-based colored-ASCII nation simulation (nested grids, procgen, resources, trade/war, armies, terrain, UI/logging, CRT aesthetic, Conway’s Life analogy).
**Portable**: No.
**Reason**: **Verdict**: Domain-exclusive — only meaningful for building this exact game concept; not a coding standard and useless as a general agent or repo SOP.
**Notes**: Treat as game GDD fragments for one project; do not merge into role-to-sop style corpora except as an example of “highly specialized prompt files” in curated lists.

## rules/cypress-integration-testing-cursorrules-prompt-file/.cursorrules
**Type**: Cypress + TypeScript integration-testing SOP — QA persona, UI↔API flows, `cy.intercept` mocking, `data-testid` selectors, success/error/state assertions, 3–5 tests per feature, no visual/pixel tests.
**Portable**: Partial — applies where Cypress drives a web app with interceptable HTTP; TypeScript is optional with auto-detect guidance.
**Reason**: Self-contained testing playbook with no repo-specific paths or Cursor-only directives; long JS/TS examples are copy-pasteable patterns.
**Notes**: Heavy example surface (registration + cart); pairs well with projects already on Cypress; “integration” here means component/API boundary testing with mocks, not necessarily full backend-in-the-loop.

## rules/cypress-unit-testing-cursorrules-prompt-file/.cursorrules
**Type**: Not read — file missing at the referenced path in this workspace checkout.
**Portable**: N/A.
**Reason**: `/Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-cursorrules/rules/cypress-unit-testing-cursorrules-prompt-file/.cursorrules` does not exist; other Cypress rule folders present include integration, e2e, api, accessibility, and defect-tracking only.
**Notes**: Re-sync or re-clone `awesome-cursorrules` if that rule should exist; otherwise treat the path as stale in the task list.

## rules/cursorrules-cursor-ai-nextjs-14-tailwind-seo-setup/.cursorrules
**Type**: Next.js 14 + Tailwind + TypeScript generation SOP — App Router, RSC-by-default, `fetch` caching/revalidation, Metadata API/SEO, Image, a11y, `error.tsx`/`loading.tsx`, route handlers, export/style conventions, screenshot-driven layout work.
**Portable**: Partial — tightly coupled to Next 14 App Router and Tailwind utility styling.
**Reason**: General framework conventions without hardcoded repo paths; assumes Tailwind already configured.
**Notes**: Body truncates mid–`error.tsx` example (incomplete closing); data-fetch snippet shows a typo-style URL `<https://api.example.com/data>` — scrub if lifting examples verbatim.

## rules/cursorrules-file-cursor-ai-python-fastapi-api/.cursorrules
**Type**: Python FastAPI API SOP — concise technical tone, type hints, Pydantic v2 models, async for I/O, RORO, router layout, guard clauses/early returns, `HTTPException`, lifespan over deprecated `on_event`, middleware, performance and DI conventions.
**Portable**: Partial — FastAPI/Pydantic/async stack; HTTP/API themes echo other frameworks but naming/file rules are Python-specific.
**Reason**: Standalone engineering checklist with named dependencies; no workspace paths or IDE rules.
**Notes**: A few bullets read like JavaScript style-guide slip (“curly braces,” “named exports”) and should be ignored or rewritten for Python; otherwise standard FastAPI guidance density.

## rules/cursorrules-cursor-ai-wordpress-draft-macos-prompt/.cursorrules
**Type**: Product brief and NUX copy for a macOS menu-bar client (“PressThat”) that drafts posts via WordPress Application Passwords.
**Portable**: No.
**Reason**: Describes one app’s setup flow (site URL, user, app password) and user-facing steps, not transferable coding standards.
**Notes**: Body appears truncated in source; no engineering rules beyond onboarding narrative.

## rules/android-jetpack-compose-cursorrules-prompt-file/.cursorrules
**Type**: Android Jetpack Compose checklist (Material 3, Hilt, clean architecture, coroutines/Flow, navigation, testing/performance) expressed as `//` comments and string-bearing `const` arrays. **Portable**: No (Android/Kotlin/Compose only). **Reason**: Entire file assumes Compose, Hilt, and typical multi-layer Android layout. **Notes**: Explicit flexibility note to adapt folder structure—good; JavaScript-like `const` blocks are odd for `.cursorrules` but LLMs still parse the strings.

## rules/angular-novo-elements-cursorrules-prompt-file/.cursorrules
**Type**: Hybrid file—meta assistant behavior, long generic clean-code principles (DRY, KISS, YAGNI, etc.), then Angular standalone + Novo Elements integration with doc links and `@Docs` JSON blocks.
**Portable**: Partial.
**Reason**: Upper “general rules” and clean-code essay are stack-agnostic; bottom section pins Angular + Novo Elements and standalone-components constraints.
**Notes**: Duplicate “verify” bullet, gamified/tipping motivational text, and `@Docs{...}` convention may or may not match your tooling; strong maintainer-facing tone (“penalized,” psychopath quote) to reconcile with org voice.

## rules/angular-typescript-cursorrules-prompt-file/.cursorrules
**Type**: Angular 18 + TypeScript + Jest expert persona with clarity/performance rules, max nesting (2), ≤4 parameters, ≤50 executable lines, 80-character lines, Jest, preserve JSDoc on refactor, and a repo-specific mandate to use `forNext` from `libs/smart-ngrx/src/common/for-next.function.ts` instead of ordinary loops; defers to local `.eslintrc.json`, `.prettierrc`, `.htmlhintrc`, and `.editorconfig`. **Portable**: Partial. **Reason**: Generic coding discipline and limits travel; Angular version, Smart NgRx path, and named project config filenames anchor this to a specific codebase layout. **Notes**: Repetitive “think step by step” / reasoning boilerplate; otherwise a compact Angular checklist if paths and tooling match.

## rules/aspnet-abp-cursorrules-prompt-file/.cursorrules
**Type**: ABP Framework + ASP.NET Core + EF Core backend SOP covering layered module structure, C# style, LINQ, async I/O, `IDistributedCache`, REST/HttpApi, validation, global exception handling, DI, repositories, AutoMapper, background jobs, domain events, DDD layering, xUnit/NSubstitute/Shouldly testing, OpenIddict, permissions, Swagger, and official doc links. **Portable**: No. **Reason**: Entire body is Volosoft ABP module conventions, APIs, and documentation targets—not meaningful outside that stack without wholesale rewrite. **Notes**: Long but coherent agent onboarding for ABP teams; mirrors official guidance density.

## rules/astro-typescript-cursorrules-prompt-file/.cursorrules
**Type**: JSON document (not prose) defining `commit_message_guidelines` (conventional commits, `/commit`, full `git commit` command), `development_guidelines` (strict TS, Tailwind, modular Astro components), `coding_style` (leading path/filename comment, purpose-focused comments, DRY/performance), and `custom_slash_commands`. **Portable**: Partial. **Reason**: Commit and general style slices transfer; Astro + Tailwind + TS framing is stack-specific. **Notes**: Atypical `.cursorrules` shape—LLM/tooling must accept JSON rule trees; thin bullets compared to prose playbooks.

## rules/beefreeSDK-nocode-content-editor-cursorrules-prompt-file/.cursorrules
**Type**: Beefree SDK playbook with YAML frontmatter (`description`, `globs` for web sources), npm install, proxy-based V2 auth, Express sample, container/CSS, `beeConfig` (required `container`, callbacks, merge tags/special links), React `useEffect` init, template load/save, HTML importer API, error handling, customization links, security/UX, and long copy-paste examples. **Portable**: Partial. **Reason**: Vendor endpoints, package names, and SDK API dominate; “credentials via proxy” and `onError`/lazy-init ideas generalize as patterns. **Notes**: Overlaps audited `beefreeSDK.mdc`; pinned versions and `localhost:3001` are samples; some snippets risk contradicting “never expose secrets” if copied to the browser—treat proxy pattern as canonical.

## rules/chrome-extension-dev-js-typescript-cursorrules-pro/.cursorrules
**Type**: Chrome Extension (MV3-forward) engineering SOP — JS/TS style, TS types for messaging, architecture (background/content/popup/options), manifest/permissions/CSP, security/privacy, UI layout, performance, `chrome.*` APIs, WebExtensions cross-browser notes, testing/debugging, context-aware integration, and strict “output full files” code contract.
**Portable**: Partial — general web security, CSP, and least-privilege ideas travel; `chrome.*`, MV3, and extension layout are platform-specific.
**Reason**: Centers on browser extension surfaces and Chrome extension docs, not a generic web or Node SOP.
**Notes**: Opening line also claims Shadcn/Radix/Tailwind expertise for extension UIs; “event pages vs persistent background” mixes MV2-era wording with MV3; underscore file naming is a fixed convention here.

## rules/convex-cursorrules-prompt-file/.cursorrules
**Type**: Convex backend playbook with Cursor YAML frontmatter (`globs` for TS/JS) — function syntax, HTTP routes, validators/schema, internal vs public registration, calling patterns, pagination, queries/mutations/actions, crons, file storage, TypeScript `Id` usage, full-text search, and a long end-to-end “chat-app” example.
**Portable**: No — assumes Convex `convex/` layout, `v` validators, and `./_generated/*` APIs.
**Reason**: Every substantive rule maps to Convex runtime and codegen; not reusable outside that stack without rewrite.
**Notes**: Very high signal for Convex teams; huge reference surface (validator table, samples); minor doc typos in upstream (e.g. table/placeholder issues) if copying verbatim.

## rules/cpp-programming-guidelines-cursorrules-prompt-file/.cursorrules
**Type**: Modern C++ / CMake-oriented coding SOP — principles and naming, short functions, data/class design (SOLID, Rule of Five), exceptions vs `optional`/`expected`, RAII/smart pointers, AAA/GWT tests, modular dirs (`include/`/`src/`/`test/`), stdlib and concurrency.
**Portable**: Yes — for C/C++/CMake workspaces matching the file globs; `alwaysApply: false` scopes by pattern.
**Reason**: Language and project-structure conventions without Cursor- or vendor-specific APIs.
**Notes**: Frontmatter `description` is empty; several rules are opinionated (e.g. default parameters vs explicit null checks, validation placement); aligns with entries elsewhere in this audit for generic C++ checklists.

## rules/cursor-ai-react-typescript-shadcn-ui-cursorrules-p/.cursorrules
**Type**: Minimal frontend assistant persona — claims expertise in latest stable TypeScript, JavaScript, React, Node, Next.js App Router, Shadcn UI, Tailwind; section headings only (Style, Naming, TypeScript, UI, Performance) with almost no body; ends with “don’t be lazy, write all the code.”
**Portable**: Partial — only the generic “implement fully” nudge is stack-agnostic; the rest locks to a React/Next/shadcn/Tailwind toolchain.
**Reason**: Names a concrete UI stack and Next App Router without portable procedural detail under each heading.
**Notes**: Too thin to act as an SOP until filled in; useful only as a short stack primer line vs. executable rules.

## rules/python-github-setup-cursorrules-prompt-file/.cursorrules
**Type**: JSON tree (`general`, `project_specific`, `context`, `behavior`) encoding Python style, security, testing/docs, Git/GitHub Flow, Actions CI, tooling (Black, Pylint, pytest), plus a concrete codebase blurb and dependency list.
**Portable**: Partial — process and Python conventions generalize; `context` ties to one file-classification app and named libraries (spaCy, transformers, etc.).
**Notes**: Unusual machine-readable shape for `.cursorrules`; a few keys read web/JS-flavored (`prefer_try_catch` for Python).

## rules/python-machine-learning-models-cursorrules-prompt-file/.cursorrules
**Type**: Not read — file missing at the referenced path in this workspace checkout.
**Portable**: N/A.
**Notes**: No `rules/python-machine-learning-models-cursorrules-prompt-file/.cursorrules` under `.references/awesome-cursorrules/`; re-sync the reference repo if this rule should exist.

## rules/pytorch-scikit-learn-cursorrules-prompt-file/.cursorrules
**Type**: Long-form expert SOP for scientific/chemistry ML in Python (scikit-learn vs PyTorch split, RDKit/OpenBabel, splits/scaffold validation, GNNs, metrics, SHAP/interpretability, experiment tracking, testing).
**Portable**: Partial — reproducibility and evaluation patterns travel; domain chemistry and cheminformatics stack lock scope; ends with Flask API / Tauri integration notes.
**Notes**: High-signal for QSAR/chem ML teams; strip chemistry-specific and full-stack tail if reused as generic ML guidance.

## rules/rails-ruby-cursorrules-prompt-file/.cursorrules
**Type**: Not read — file missing at the referenced path in this workspace checkout.
**Portable**: N/A.
**Notes**: No folder matching `rails-ruby-cursorrules-prompt-file`; unrelated `rails-cursorrules-prompt-file/` exists with `.mdx` snippets, not this `.cursorrules` path.

## rules/react-graphql-cursorrules-prompt-file/.cursorrules
**Type**: Not read — file missing at the referenced path in this workspace checkout.
**Portable**: N/A.
**Notes**: Closest present sibling is `react-graphql-apollo-client-cursorrules-prompt-file/.cursorrules` (Apollo Client checklist, queries/mutations/fragments, folder layout).

## rules/react-mobx-cursorrules-prompt-file/.cursorrules
**Type**: React + MobX template expressed as `//` comments and string-literal `const` arrays (mobx-react-lite, stores/actions/computed, strict mode, observers, folder tree).
**Portable**: Partial — MobX React conventions only; same “mini JS module” pattern as other React + X rules in this family.
**Notes**: Operational depth is shallow; useful as a reminder list rather than a full SOP.

## rules/react-native-expo-cursorrules-prompt-file/.cursorrules
**Type**: React Native + Expo SOP (functional components, Expo SDK/Router, assets, push, OTA, StyleSheet, secure store, offline/performance notes, sample `src/` tree).
**Portable**: Partial — Expo-specific APIs and Router; general RN hygiene partly transferable outside Expo.
**Notes**: Same structural template as other `const`-style React rule files.

## rules/react-query-cursorrules-prompt-file/.cursorrules
**Type**: React + TanStack Query SOP (QueryClient/provider, query keys, prefetch, mutations, custom hooks under `hooks/useQueries`/`useMutations`, error boundaries, DevTools, invalidation/optimistic updates).
**Portable**: Partial — library-bound; caching/stale-while-revalidate ideas are familiar across data libraries.
**Notes**: Fits the same short checklist pattern as MobX/Styled Components entries.

## rules/react-redux-cursorrules-prompt-file/.cursorrules
**Type**: Not read — file missing at the referenced path in this workspace checkout.
**Portable**: N/A.
**Notes**: Present alternative: `react-redux-typescript-cursorrules-prompt-file/.cursorrules` (Redux Toolkit, slices, `createAsyncThunk`, typed hooks, feature/store layout).

## rules/react-styled-components-cursorrules-prompt-file/.cursorrules
**Type**: React + styled-components/theming SOP (`styled-components/macro`, ThemeProvider, css tagged templates, attrs, `Styled*` naming, TypeScript, folder layout under `components/styled` and `styles/`).
**Portable**: Partial — CSS-in-JS/theming stack-specific; reminder bullets apply wherever styled-components is primary.
**Notes**: Same compact `const` checklist format as other React companion rules.

## rules/react-typescript-ui-ux-cursorrules-prompt-file/.cursorrules
**Type**: Not read — file missing at the referenced path in this workspace checkout.
**Portable**: N/A.
**Notes**: No matching `react-typescript-ui-ux-cursorrules-prompt-file` directory or `.cursorrules` found under `rules/` in this checkout.

## rules/next-js-cursor-cursorrules-prompt-file/.cursorrules
**Type**: Not read — path missing in this `awesome-cursorrules` checkout.
**Portable**: N/A.
**Notes**: No `rules/next-js-cursor-cursorrules-prompt-file/.cursorrules` under `.references/awesome-cursorrules/`; may be a stale README link or unpulled tree—re-sync submodule or verify upstream folder name.

## rules/nextjs-supabase-shadcn-cursorrules-prompt-file/.cursorrules
**Type**: Not read — path missing in this checkout (closest live neighbor: `nextjs-supabase-shadcn-pwa-cursorrules-prompt-file`).
**Portable**: N/A.
**Notes**: Exact dirname not present; use README or `ls rules/nextjs-supabase*` if you intended the PWA variant.

## rules/nextjs-tailwind-typescript-cursorrules-prompt-file/.cursorrules
**Type**: Not read — path missing (actual folder appears truncated: `nextjs-tailwind-typescript-apps-cursorrules-prompt`).
**Portable**: N/A.
**Notes**: User path likely typo vs `rules/nextjs-tailwind-typescript-apps-cursorrules-prompt/.cursorrules`; audit that file separately if needed.

## rules/nextjs-typescript-tailwind-cursorrules-prompt-file/.cursorrules
**Type**: Autonomys “Astral” block-explorer brief — Next.js + TypeScript + Tailwind product context, scripts, domain lexicon (H+AI, deAI, Autonomys), and lightweight dev/AI interaction bullets.
**Portable**: No — repo-specific URLs, branding, and glossary; only the generic TS/React/Tailwind reminders are reusable.
**Notes**: Folder name suggests generic stack rules but body is a single-project onboarding sheet; thin on actionable procedures beyond “follow ESLint and existing components.”

## rules/nextjs14-zustand-shad-react-query/.cursorrules
**Type**: Not read — path missing in this checkout.
**Portable**: N/A.
**Notes**: No matching `rules/nextjs14-zustand-shad-react-query/.cursorrules`; search `rules/` for zustand/react-query stacks if upstream renamed it.

## rules/node-mongodb-cursorrules-prompt-file/.cursorrules
**Type**: Not read — path missing (related dirs include `nodejs-mongodb-cursorrules-prompt-file-tutorial` and `nodejs-mongodb-jwt-express-react-cursorrules-promp`).
**Portable**: N/A.
**Notes**: “node-mongodb-…” exact path absent; pick the `nodejs-mongodb-*` folder that matches intent.

## rules/node-typescript-cursorrules-prompt-file/.cursorrules
**Type**: Not read — path missing in this checkout.
**Portable**: N/A.
**Notes**: No `node-typescript-cursorrules-prompt-file`; consider `typescript-nodejs-*` or `es-module-nodejs-guidelines-*` folders for Node+TS guidance.

## rules/nuxt-vue-cursorrules-prompt-file/.cursorrules
**Type**: Not read — path missing (Nuxt+Vue rules exist as `vue-3-nuxt-3-development-cursorrules-prompt-file` / `vue-3-nuxt-3-typescript-cursorrules-prompt-file`).
**Portable**: N/A.
**Notes**: User path not present; Nuxt coverage uses the `vue-3-nuxt-3-*` naming convention in this mirror.

## rules/perplexity-api-cursorrules-prompt-file/.cursorrules
**Type**: Not read — path missing in this checkout.
**Portable**: N/A.
**Notes**: No Perplexity-related rule directory under `rules/` in this checkout.

## rules/pinia-vue-cursor-rules/.cursorrules
**Type**: Not read — path missing in this checkout.
**Portable**: N/A.
**Notes**: No `pinia-vue-cursor-rules` folder; Pinia may only appear inside broader Vue rules elsewhere.

## rules/plasmo-browser-extension-cursorrules-prompt-file/.cursorrules
**Type**: Not read — path missing in this checkout.
**Portable**: N/A.
**Notes**: No Plasmo-specific rule folder; closest extension guidance may be `chrome-extension-dev-js-typescript-cursorrules-pro` or similar.

## rules/htmx-basic-cursorrules-prompt-file/.cursorrules
**Type**: HTMX attribute playbook (hx-get/post/trigger/swap/target/indicator), CSRF and progressive enhancement, plus server-side templating—packaged as JS `const` string arrays with a Flask-flavored `src/` layout.
**Portable**: Partial — hx-* guidance travels for HTMX projects; the sample `app.py` tree is stack-specific.
**Notes**: Unusual `.cursorrules` shape (fake JS) but LLM-parseable; shallow depth, fine as a quick markup checklist.

## rules/java-springboot-jpa-cursorrules-prompt-file/.cursorrules
**Type**: Spring Boot 3 + JPA opinionated layering: controllers only at the edge, services + repositories, DTO `record`s, JPQL/`@EntityGraph`, `@Transactional`, `ApiResponse` + `@RestControllerAdvice`—field `@Autowired`, try/catch per controller method, OWASP/SOLID persona framing.
**Portable**: No.
**Notes**: Sample `GlobalExceptionHandler`/`ApiResponse` snippets are internally inconsistent (constructor vs `ApiResponse.error`, missing semicolon)—treat as intent, not paste-ready code.

## rules/javascript-cursorrules-prompt-file/.cursorrules
**Type**: Not read — file missing at referenced path in this `awesome-cursorrules` checkout.
**Portable**: N/A
**Notes**: `/Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-cursorrules/rules/javascript-cursorrules-prompt-file/.cursorrules` does not exist; no same-named folder under `rules/`—confirm upstream path or re-clone the registry.

## rules/jquery-cursorrules-prompt-file/.cursorrules
**Type**: Not read — file missing at referenced path in this checkout.
**Portable**: N/A
**Notes**: Path absent; `rules/` contains no `jquery*` entry—likely renamed, removed, or never present in this mirror.

## rules/kubernetes-mkdocs-cursorrules-prompt-file/.cursorrules
**Type**: Not read at the task-listed path (ENOENT).
**Portable**: N/A
**Notes**: Closest match in checkout: `rules/kubernetes-mkdocs-documentation-cursorrules-prompt/.cursorrules` — cross-cutting **technical writer** persona for Kubernetes + MkDocs with labeled section headers (style, cloud-native expertise, MkDocs, SEO, collaboration) but **no filled-in rules body**, only a “don’t be lazy” closer—low value as an executable SOP without substantive bullets.

## rules/laravel-php-cursorrules-prompt-file/.cursorrules
**Type**: Not read at task path (ENOENT); substantive content read from `rules/laravel-php-83-cursorrules-prompt-file/.cursorrules` — Laravel **package** author brief: PHP 8.3+, Spatie `laravel-package-tools`, Pint, DX/type-safety/docblocks, kebab/Pascal/camel/**SCREAMING** naming table, structure/testing/docs outlines.
**Portable**: No — Composer package workflow and Laravel ecosystem assumptions; property `snake_case` rule conflicts with common Laravel/PHP property conventions—reconcile with PSR/org standards if adopting.
**Notes**: Task path typo vs upstream folder name (`laravel-php-83-...`); file targets package scaffolding, not general Laravel app architecture.

## rules/laravel-tall-stack-cursorrules-prompt-file/.cursorrules
**Type**: Not read at task path (ENOENT); content from `rules/laravel-tall-stack-best-practices-cursorrules-prom/.cursorrules` — end-to-end **TALL** (Laravel, Livewire, Alpine, Tailwind) checklist: PSR-12, strict types, Eloquent vs raw SQL, Livewire lifecycle/validation, Alpine directives, Tailwind responsive/@apply, caching, security, PHPUnit/Dusk.
**Portable**: No.
**Notes**: Mentions Laravel Mix and “Luvi UI” alongside generic TALL deps—verify against current asset pipeline (often Vite) and design system; otherwise a conventional, dense stack SOP.

## rules/meta-prompt-for-ai-agents-cursorrules-prompt-file/.cursorrules
**Type**: Not read — file missing at referenced path in this checkout.
**Portable**: N/A
**Notes**: No `rules/meta-prompt-for-ai-agents-cursorrules-prompt-file/` (or substring match) in this workspace copy of `awesome-cursorrules`.

## rules/micro-saas-development-cursorrules-prompt-file/.cursorrules
**Type**: Not read — file missing at referenced path in this checkout.
**Portable**: N/A
**Notes**: No matching `rules/` directory name; search for `micro-saas` / `saas` rule folders in this checkout returned nothing analogous.

## rules/model-context-protocol-cursorrules-prompt-file/.cursorrules
**Type**: Not read — file missing at referenced path in this checkout.
**Portable**: N/A
**Notes**: No `model-context-protocol*` (or obvious MCP-themed) rule folder under `rules/` in this checkout—content unavailable here without a different registry revision or URL.

## rules/next-js-app-router-cursorrules-prompt-file/.cursorrules
**Type**: Not read at task path (ENOENT); content from `rules/nextjs-app-router-cursorrules-prompt-file/.cursorrules` — App Router essentials (RSC default, selective client components, `app/` layout/page/loading/error, route handlers, TS, metadata, `Image`, env vars) as JS `const` lists plus `app/` tree sketch using `.js` filenames.
**Portable**: Partial — Next 13+ App Router-specific; guidance is high-level and version-sensitive.
**Notes**: Structural twin to the HTMX rules file; mismatch between “Use TypeScript” and `.js` examples—treat as shorthand, not literal filenames.

## rules/drizzle-orm-sqlite-cursor-rules/.cursorrules
**Type**: Missing from local `awesome-cursorrules` mirror (no such directory under `rules/`); only related Drizzle notes found as `drizzle-orm-rules.mdc` inside another pack, not a root `.cursorrules`.
**Portable**: n/a — source file not available here.
**Notes**: Fetch upstream or vendor the rule before SOP extraction; if using the stray `.mdc`, treat as **Drizzle/SQLite** stack-only.

## rules/elixir-phoenix-cursorrules-prompt-file/.cursorrules
**Type**: Path missing locally. Closest match read: `rules/elixir-phoenix-docker-setup-cursorrules-prompt-fil/.cursorrules` — senior Elixir engineer persona, explicit Phoenix/LiveView/Ecto/Docker/Postgres/Tailwind tool list, thinking-before-code, "VV" terse mode, three bold follow-up questions, and a full conventional-commit spec.
**Portable**: no — Elixir/Phoenix/LiveView and listed hex/stack only; the commit-message section is portable process text if lifted alone.
**Notes**: Interaction quirks (Q1–Q3, VV) are persona noise for a neutral SOP unless you want that cadence org-wide.

## rules/expo-react-native-cursorrules-prompt-file/.cursorrules
**Type**: Path missing locally. Assessed `rules/react-native-expo-cursorrules-prompt-file/.cursorrules` instead: short arrays for Expo/RN practices (hooks, Expo Router, assets, push, OTA), sample tree (`assets/`, `src/...`), TypeScript/StyleSheet/SecureStore/offline bullets.
**Portable**: no — Expo/React Native only.
**Notes**: Starter-level; conflicts possible if the app does not use Expo Router or TypeScript.

## rules/fastapi-python-cursorrules-prompt-file/.cursorrules
**Type**: Path missing locally. Assessed `rules/python-fastapi-cursorrules-prompt-file/.cursorrules`: Pydantic/DI/async/decorators/HTTPException/OpenAPI bullet list, example `app/` layout, PEP 8 and testing reminders.
**Portable**: no — FastAPI/Python only.
**Notes**: High-level checklist only—no security/deprecation/version nuance; fine as onboarding stub.

## rules/flask-python-cursorrules-prompt-file/.cursorrules
**Type**: Path missing locally. Assessed `rules/htmx-flask-cursorrules-prompt-file/.cursorrules`: HTMX + Flask SSR (render_template, Flask-WTF, blueprints, SQLAlchemy, Jinja `hx-*`, CSRF, Migrate, factory pattern).
**Portable**: no — Flask + HTMX/Jinja stack only.
**Notes**: Not a generic Flask JSON/API guide; name mismatch vs "flask-python" if you expected plain REST Flask.

## rules/flutter-dart-cursorrules-prompt-file/.cursorrules
**Type**: Path missing locally. Assessed `rules/flutter-app-expert-cursorrules-prompt-file/.cursorrules`: stresses adapting to existing layout; Flutter 3 / M3; clean architecture + BLoC; feature-first `lib/` tree; Either/GoRouter/GetIt; widget/perf/testing sections (contains a typo `testingTestingGuidelines`).
**Portable**: no — Flutter/Dart only.
**Notes**: Opinionated stack (BLoC, GetIt, GoRouter)—strip or swap if the repo uses Riverpod/Provider/etc.

## rules/gatsby-react-cursorrules-prompt-file/.cursorrules
**Type**: Missing from local mirror; no `gatsby*` rule directory with a root `.cursorrules` under `rules/`.
**Portable**: n/a — source file not available here.
**Notes**: Cannot assess Gatsby-specific guidance without vendoring upstream content.

## rules/github-code-quality-cursorrules-prompt-file/.cursorrules
**Type**: Cursor "rules" JSON: regex-gated assistant conduct (verify before claiming; file-by-file pacing; ban apologies/understanding/whitespace tips; no unsolicited summaries or scope creep; preserve unrelated code; single-chunk edits; do not re-ask for confirmations on visible work; odd `x.md` placeholder discipline). Despite the folder name, this is not Git hosting or engineering code-quality (lint/tests/architecture).
**Portable**: Partial — verify evidence, narrow scope, and avoid deleting unrelated code are reusable SOP clauses. Bans on summaries/apologies/sequential phrasing ("first/then") and the `x.md` rules are environment-specific and often clash with org comms or PR norms.
**Notes**: Functionally overlaps other "meta assistant" packs already in this audit log; prefer a short, human-authored policy over importing the whole regex table.

## rules/go-backend-development-cursorrules-prompt-file/.cursorrules
**Type**: Path missing locally. Assessed `rules/go-backend-scalability-cursorrules-prompt-file/.cursorrules`: long "backend expert" briefing; multi-language expertise list (Go, Rust, Java, Python, Node); prescribed response template (analyze, explain, trade-offs, closing summary); includes a long Go gRPC plus Postgres example.
**Portable**: Partial — response structure and generic backend topic list are broadly portable as mentoring prompts; the embedded tutorial is Go plus gRPC plus PostgreSQL specific.
**Notes**: Misleading filename versus content breadth; not a concise Go idiom or style SOP.

## rules/go-fiber-cursorrules-prompt-file/.cursorrules
**Type**: Path missing locally. Assessed `rules/htmx-go-fiber-cursorrules-prompt-file/.cursorrules`: HTMX endpoints via Fiber, templates and static files, middleware, CSRF, logging, standard cmd plus internal layout.
**Portable**: no — Go Fiber plus HTMX only.
**Notes**: Does not cover Fiber REST or JSON APIs without HTMX unless generalized manually.

## rules/go-htmx-templ-cursorrules-prompt-file/.cursorrules
**Type**: Path missing locally. Assessed rules/htmx-go-basic-cursorrules-prompt-file/.cursorrules: stdlib html/template, HandlerFunc, optional gorilla/mux, CSRF, hx-boost; no templ generator in file.
**Portable**: no - Go plus HTMX stdlib templates only.
**Notes**: Not a match for a-h templ; use a templ-specific ruleset if needed.

## rules/deno-integration-techniques-cursorrules-prompt-fil/.cursorrules
**Type**: Stub README for a @findhow fork of Denoland automation—section headers (“When making changes”) are empty; only pointers to repos and “test before merge.”
**Portable**: no — Deno automation / @findhow ecosystem only
**Notes**: Not actionable as a general SOP until filled in; treat as project charter fragment.

## rules/dragonruby-best-practices-cursorrules-prompt-file/.cursorrules
**Type**: Ruby + DragonRuby Game Toolkit style (OOP/functional mix, snake_case, RuboGuide); ends with an erroneous Rails “routing, controllers…” line.
**Portable**: no — DragonRuby only
**Notes**: Copy-paste noise at the end should be stripped if reused.

## rules/drupal-11-cursorrules-prompt-file/.cursorrules
**Type**: Drupal 11 + Symfony DI expert persona—coding standards, hooks, Form/Config APIs, Render/cache metadata, Twig/SDC, security and performance (Batch/Queue, update hooks).
**Portable**: no — Drupal 11 only
**Notes**: Dense, coherent module/theme SOP; assumes core APIs and contrib norms.

## rules/elixir-engineer-guidelines-cursorrules-prompt-file/.cursorrules
**Type**: Incomplete file—Elixir/Phoenix stack list plus a cut-off conventional-commit template (no types list or rules body).
**Portable**: no — Elixir/Phoenix stack framing only (content truncated)
**Notes**: Unusable verbatim; pair with a complete commit guide or fix upstream.

## rules/elixir-phoenix-docker-setup-cursorrules-prompt-fil/.cursorrules
**Type**: Senior Elixir engineer persona (large tool stack), “think first,” bold Q1–Q3 follow-ups, “VV” terse mode, and a full conventional-commit type list with breaking-change footers.
**Portable**: Partial — **Git/workflow**: conventional commits block is portable; **agent behaviour**: Q1–Q3/VV/stack list are team-persona choices.
**Notes**: Lift commit section alone for cross-repo use; drop interaction gimmicks if standardizing agent tone.

## rules/engineering-ticket-template-cursorrules-prompt-file/.cursorrules
**Type**: TPM persona—standard engineering ticket skeleton (description, context, implementation, AC list or GWT, testing, dependencies, resources, estimation, priority, sprint) plus long examples.
**Portable**: Yes — cross-team ticket/process methodology (Scrum/Kanban tooling called out as adaptable).
**Notes**: Strong template for requirements clarity; examples are generic web (JWT, S3, React).

## rules/es-module-nodejs-guidelines-cursorrules-prompt-fil/.cursorrules
**Type**: Agile/task-step habits, ES modules + modern Node, path/filename lead comment, verbosity tiers (V0–V3), no-apologies fix-TODO stance.
**Portable**: Partial — Node ESM focus; planning/DRY/modularity and comment rules generalize.
**Notes**: “Latest Node features” needs pinning in org docs; Vx protocol is agent-specific.

## rules/flutter-app-expert-cursorrules-prompt-file/.cursorrules
**Type**: Flutter 3 / M3, clean architecture + BLoC, GoRouter/GetIt/Either, feature-first `lib/` tree, perf and testing checklists (`testingTestingGuidelines` typo in source).
**Portable**: no — Flutter only
**Notes**: Opinionated stack—swap if the app uses Provider/Riverpod/etc.

## rules/flutter-development-guidelines-cursorrules-prompt-file (standalone file in registry; not `dirname/.cursorrules`)
**Type**: Flutter MVVM + Material + Riverpod; `/lib` layout (models/viewmodels/views/services); 80-col lines; import ordering; inconsistent “snakeCase” wording vs usual Dart `lowercase_with_underscores` for files.
**Portable**: no — Flutter only
**Notes**: Useful baseline; reconcile naming bullet with Dart linter defaults.

## rules/flutter-riverpod-cursorrules-prompt-file/.cursorrules
**Type**: Heavy **agent behaviour** SOP—instruction analysis, duplicate-feature checks, phased execution, QC log format, final report template; hard constraints (no unsolicited UI changes, no version bumps); stack Flutter ^3.22 + Riverpod + Firebase + prescribed feature folder layout.
**Portable**: Partial — process/duplicate-check/report structure portable; Flutter/Firebase/version locks are not.
**Notes**: Mines well for “controlled agent execution” playbooks separate from mobile stack.

## rules/gherkin-style-testing-cursorrules-prompt-file/.cursorrules
**Type**: QA persona—Gherkin scenarios for stakeholders, best practices (clear feature, Given/When/Then, Examples), conversion flow from Playwright-style scripts to business language.
**Portable**: Yes — **testing methodology** / BDD documentation across web/mobile.
**Notes**: “Avoid API/selector jargon” supports comms-heavy acceptance tests.

## rules/git-conventional-commit-messages/.cursorrules
**Type**: Near-verbatim **Conventional Commits** spec (structure, types, scopes, body/footers, BREAKING CHANGE / `!`, RFC 2119 keywords).
**Portable**: Yes — **git commit message** standard for any repo adopting the spec.
**Notes**: Good reference slice; trim if you use commitlint with different allowed types.

## rules/github-cursorrules-prompt-file-instructions/.cursorrules
**Type**: Long-form **clean code** explainer (named constants, naming, comments, SRP/short functions, DRY, language style tables, encapsulate conditionals, refactor, VCS mention).
**Portable**: Yes — **code quality** essay usable across stacks (Python/JS/Java examples).
**Notes**: Article-length; pair with your actual formatter/linter rules to avoid contradictions.

## rules/go-backend-scalability-cursorrules-prompt-file/.cursorrules
**Type**: Backend pair-programmer persona spanning DBs, APIs, perf, scaling, security, messaging, K8s, CI/CD; prescribes analyze→explain→trade-offs→summarize response shape; Go gRPC+Postgres example.
**Portable**: Yes — cross-cutting **backend architecture** guidance; Go is illustrative not exclusive.
**Notes**: Good generic mentor prompt; trim the fixed response outline if it fights team comms norms.

## rules/go-servemux-rest-api-cursorrules-prompt-file/.cursorrules
**Type**: Go 1.22+ `net/http` + new ServeMux REST API assistant—plan in pseudocode, validation, JSON, middleware, logging, security/scalability notes.
**Portable**: no — Go stdlib HTTP only
**Notes**: Explicit “no TODOs” output contract for APIs.

## rules/go-temporal-dsl-prompt-file/.cursorrules
**Type**: YAML frontmatter only—`rules:` references sibling `.mdc` shards (`index`, `guide`, `workflow`, `activities`, `example-usage`) for Go Temporal DSL; no prose rules in `.cursorrules` itself.
**Portable**: no — Temporal Go rules pack index only
**Notes**: Read referenced `.mdc` files for substance; this root file is a manifest.

## rules/graphical-apps-development-cursorrules-prompt-file/.cursorrules
**Type**: **Pyllments** framework synopsis—Elements/Payloads/Ports/observer pattern, Panel+Param+LangChain stack, NumPy-style docstrings, per-element file layout.
**Portable**: no — Pyllments / Panel LLM UI only
**Notes**: Project-specific design doc, not generic “graphical apps.”

## rules/how-to-documentation-cursorrules-prompt-file/.cursorrules
**Type**: Technical writer persona for **end-user how-to** docs—numbered steps, troubleshooting, platform notes, converting automation scripts to user language.
**Portable**: Yes — **documentation methodology** for non-technical audiences.
**Notes**: Complements Gherkin file (stakeholder-friendly language).

## rules/html-tailwind-css-javascript-cursorrules-prompt-fi/.cursorrules
**Type**: Expert assistant for latest HTML, Tailwind, vanilla JS—“confirm then code,” terse diffs on edits, security/perf claims, allow contrarian options.
**Portable**: no — HTML + Tailwind + vanilla JS only
**Notes**: Opinionated interaction style; no component framework.

## rules/htmx-django-cursorrules-prompt-file/.cursorrules
**Type**: JS `const` checklist—Django templates/forms/CBV/ORM/middleware with HTMX; sample Django project tree.
**Portable**: no — Django + HTMX only
**Notes**: Shallow but scaffolds SSR+HTMX conventions.

## rules/htmx-flask-cursorrules-prompt-file/.cursorrules
**Type**: JS `const` checklist—Flask render_template, Flask-WTF, blueprints, SQLAlchemy, Jinja `hx-*`, factory pattern.
**Portable**: no — Flask + HTMX only
**Notes**: Same pattern family as django/htmx-basic.

## rules/htmx-go-basic-cursorrules-prompt-file/.cursorrules
**Type**: JS `const` checklist—`html/template`, HandlerFunc, optional gorilla/mux, JSON, context, CSRF, hx-boost; standard Go layout.
**Portable**: no — Go + HTMX only
**Notes**: Mentions optional router; still stdlib-first SSR framing.

## rules/htmx-go-fiber-cursorrules-prompt-file/.cursorrules
**Type**: JS `const` checklist—Fiber routing, middleware, templates, static files, CSRF via middleware.
**Portable**: no — Go Fiber + HTMX only
**Notes**: Parallel to htmx-go-basic with framework swap.

## rules/java-general-purpose-cursorrules-prompt-file/.cursorrules
**Type**: YAML structured “Senior Java Developer” profile—`effective_java_notes` chapter bullets (items 1–12), Eclipse Collections/Guava/VAVR/JUnit5/JQwik/JMH, Maven, Java 24, DOP/FP concurrency guidance.
**Portable**: no — Java/JVM standard-library-centric only
**Notes**: Massive Effective Java checklist; frontmatter models a machine-readable rules doc.

## rules/javascript-astro-tailwind-css-cursorrules-prompt-f/.cursorrules
**Type**: Astro + TS + Tailwind integration—project tree, partial hydration (`client:*`), content collections, scoped CSS, `@astrojs/tailwind`, **“Never use @apply”** (strict utility stance), SEO and CWV.
**Portable**: no — Astro + Tailwind only
**Notes**: `@apply` ban may clash with teams that use component abstraction—call out as opinion.

## rules/javascript-chrome-apis-cursorrules-prompt-file/.cursorrules
**Type**: Outline-only TOC (sections listed by title) for Chrome extension MV3-adjacent topics—no filled rules body.
**Portable**: no — Chrome extension only
**Notes**: Needs expansion to be usable; currently a skeleton index.

## rules/javascript-typescript-code-quality-cursorrules-pro/.cursorrules
**Type**: Senior full-stack **code quality** mindset (simplicity, readability, early returns, immutable/functional bias, minimal unrelated diffs), JSDoc expectations, function ordering, pseudocode-then-code workflow, TODO-on-bugs policy.
**Portable**: Yes — **agent behaviour** + JS/TS craft patterns; not framework-locked.
**Notes**: “Constants over functions” is debatable—tune for language idioms.

## rules/jest-unit-testing-cursorrules-prompt-file/.cursorrules
**Type**: Jest + TS **unit testing** persona—mock-before-import, describe/it structure, edge cases, “3–5 tests per file,” Arrange-Act-Assert examples.
**Portable**: Partial — **testing methodology** (AAA, mocking discipline) generalizes; APIs are Jest-specific.
**Notes**: Auto-detect TS note is practical for brownfield repos.

## rules/knative-istio-typesense-gpu-cursorrules-prompt-fil/.cursorrules
**Type**: Composite solution assistant—Knative services, Istio mesh, Typesense search, HTMX frontend, GPU/serverless framing, testing/monitoring reminders.
**Portable**: no — Knative + Istio + Typesense + HTMX reference architecture only
**Notes**: “GPU” in title barely reflected in body—mostly cloud-native search app guidance.

## rules/kotlin-ktor-development-cursorrules-prompt-file/.cursorrules
**Type**: Ktor 3 feature-sliced layout with Exposed/Hikari/Koin; repository/service/route examples; StatusPages; **coverage targets** (80% overall, 90% critical); Kotest + `testApplication` samples; security headers and Micrometer/Prometheus hooks.
**Portable**: no — Kotlin K only
**Notes**: Unusually concrete for testing/observability vs other rule stubs.

## rules/kotlin-springboot-best-practices-cursorrules-prompt-file/.cursorrules
**Type**: Idiomatic Kotlin for Spring—packages mirror FS, `val` by default, data classes, sealed classes/results over exceptions, constructor injection, coroutines, JPA-friendly immutability notes.
**Portable**: no — Kotlin + Spring Boot only
**Notes**: Depth on language style; less on Spring-specific annotations beyond DI.

## rules/kubernetes-mkdocs-documentation-cursorrules-prompt/.cursorrules
**Type**: Technical writer persona for Kubernetes + MkDocs—section headings only (style, cloud-native, MkDocs, SEO, collaboration) plus “don’t be lazy.”
**Portable**: Partial — intent is cross-cutting **documentation**; body is empty shell.
**Notes**: Low signal until someone fills bullet content under each heading.

## rules/laravel-php-83-cursorrules-prompt-file/.cursorrules
**Type**: Laravel **package** author brief—PHP 8.3+, Spatie `laravel-package-tools`, Pint, kebab/Pascal/camel/**SCREAMING** naming (properties `snake_case` is atypical for PHP—verify against PSR/org).
**Portable**: no — Laravel package ecosystem only
**Notes**: Targets library DX, not general Laravel app architecture.

## rules/laravel-tall-stack-best-practices-cursorrules-prom/.cursorrules
**Type**: TALL stack (Laravel, Livewire, Alpine, Tailwind)—PSR-12, strict types, Eloquent vs query builder, Livewire lifecycle, Tailwind `@apply` + purge framing, security, PHPUnit/Dusk; deps list includes Luvi UI and **Laravel Mix** (often outdated vs Vite).
**Portable**: no — TALL stack only
**Notes**: Modernize asset pipeline mentions if adopting verbatim.

## rules/linux-nvidia-cuda-python-cursorrules-prompt-file/.cursorrules
**Type**: **Misnamed in practice**—project brief for `srt-model-quantizing` (HF download/quantize/upload, Linux, CUDA/ROCm), simplicity/robustness/docs principles, agent alignment via progress markdown.
**Portable**: no — that GPU quant pipeline product only
**Notes**: Folder name promises generic CUDA Python; content is repo-specific.

## rules/manifest-yaml-cursorrules-prompt-file/.cursorrules
**Type**: Cursor frontmatter + **Manifest.build** demo-backend playbook—npm install, watch/seed scripts, VS Code YAML schema wiring, strict rules for small `manifest/backend.yml` (entities, properties, policies, no admin/authenticable, emoji entity names).
**Portable**: no — Manifest vendor schema/tooling only
**Notes**: Typo `pacakge.json` mirrored from source; fix if scripting.

## rules/medusa-cursorrules/.cursorrules
**Type**: Medusa v2 expert—Workflow SDK rules (transform/when, no async workflow fn, no await on steps), `MedusaError`, Query for reads, `model` utility naming, `MedusaService`, admin uses JS SDK + Tailwind.
**Portable**: no — Medusa only
**Notes**: Tight commerce-framework checklist; keep out of generic corpora except as vendor SOP.


## rules/react-redux-typescript-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (React + Redux Toolkit + TypeScript). **Portable**: Partial — only high-level bullets encoded as fake JS `const` arrays; no project paths. **Notes**: Thin checklist (RTK, slices, `createAsyncThunk`, typed hooks); fine as seed list, not self-enforcing.

## rules/react-styled-components-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (React + styled-components). **Portable**: Partial. **Notes**: ThemeProvider, macro, naming `Styled*` — same templated “const checklist” style as sibling React rules; shallow.

## rules/react-typescript-nextjs-nodejs-cursorrules-prompt-/.cursorrules
**Type**: Stack-specific (Next.js 14 App Router + Wagmi/Viem + Shadcn + Tailwind; **not** the folder-name stack). **Portable**: Low — `next-safe-action`, Zod, RSC patterns are template-bound. **Notes**: **Content/folder mismatch**: body is Web3 + App Router + server actions, not generic React/Node; otherwise dense and actionable for that template.

## rules/react-typescript-symfony-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (React, TypeScript, PHP, Symfony, Docker). **Portable**: Partial — only a short expert persona, zero concrete conventions. **Notes**: Placeholder-level; unusable as an SOP without expansion.

## rules/salesforce-apex-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Salesforce Apex). **Portable**: Partial. **Notes**: **No `.cursorrules` in tree — used `.cursorrules.txt`.** Substantive Apex guidance: Queueable + `System.Finalizer`, null-object/repository patterns, naming, newspaper method order; strong for Apex teams.

## rules/scala-kafka-cursorrules-prompt-file/.cursorrules
**Type**: Cross-cutting Scala 3 + Kafka Streams engineering (split across `.mdc` rules). **Portable**: Partial — FP/ScalaTest/SLF4J travel; Kafka `TopologyTestDriver` + topic naming assume Streams. **Notes**: **No `.cursorrules` — reviewed `general-scala-clean-code.mdc`, `general-scala-development-practices.mdc`, `kafka-development-practices.mdc`, `linting-formatting.mdc` (YAML frontmatter is Cursor-specific).

## rules/solidity-foundry-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Solidity + Foundry + OpenZeppelin/Solady). **Portable**: Low. **Notes**: Long security/gas checklist plus informal “general rules” (tone/casual) that conflict with enterprise SOP tone; Foundry specifics (`forge`, fuzz, invariants, `foundry.toml` snippets) are the core value.

## rules/solidity-hardhat-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Solidity + Hardhat). **Portable**: Low. **Notes**: Same “casual expert” preamble as Foundry sibling; body is shorter generic Solidity + Hardhat workflow — overlaps heavily with Foundry file minus Foundry depth.

## rules/solidity-react-blockchain-apps-cursorrules-prompt-/.cursorrules
**Type**: Corrupt / unusable. **Portable**: N/A. **Notes**: Only a “corrupted file” placeholder from the model — no rules.

## rules/solidjs-basic-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (SolidJS). **Portable**: Partial. **Notes**: Minimal signals/effects/router checklist in JS-const template form.

## rules/solidjs-tailwind-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (SolidJS + Tailwind). **Portable**: Partial. **Notes**: Utility-first + JIT/`@apply` reminders; thin.

## rules/solidjs-typescript-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (SolidJS + TypeScript). **Portable**: Partial. **Notes**: Strict TS + typed signals; same shallow pattern as other Solid entries.

## rules/svelte-5-vs-svelte-4-cursorrules-prompt-file/.cursorrules
**Type**: Cross-cutting **migration reference** (Svelte 4 → 5). **Portable**: Yes for Svelte teams. **Notes**: Clear runes (`$state`, `$derived`, `$effect`), event syntax `on:click` → `onclick`, import runes, loss of event modifiers — high-signal and concise.

## rules/sveltekit-restful-api-tailwind-css-cursorrules-pro/.cursorrules
**Type**: Stack-specific (SvelteKit + Supabase + Tailwind + Vitest) but **heavily repo-specific**. **Portable**: No — hard-coded Windows paths (`E:\...`), “Stojanovic-One”, `AI.MD`, Musk “algorithm,” PowerShell-only guidance. **Notes**: Mixes process (TDD 80% coverage) with brittle path rules; strip for reuse.

## rules/sveltekit-tailwindcss-typescript-cursorrules-promp/.cursorrules
**Type**: Stack-specific (SvelteKit 2 / Svelte 4 + Tailwind + TS). **Portable**: Partial. **Notes**: “Modible” typo; requires chain-of-thought before code; long SvelteKit stores/load/accessibility/Tailwind patterns — useful but verbose and Svelte-4-centric (not runes).

## rules/sveltekit-typescript-guide-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Svelte 5 + SvelteKit + Supabase + Drizzle) **incomplete**. **Portable**: Low. **Notes**: Truncated: section headings plus one `Counter` class rune example only; broken markup/unfinished doc.

## rules/swift-uikit-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (UIKit + MVVM + RxSwift). **Portable**: Partial. **Notes**: **No `.cursorrules` — reviewed `.cursorrules-mvvm-rxswift`.** Detailed folder layout, binding examples, Rx patterns; substantive for that stack.

## rules/swiftui-guidelines-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (SwiftUI). **Portable**: Partial. **Notes**: Short folder structure + UI guidance; pins “Aug/Sep 2024” docs; “don’t remove comments” meta-rule.

## rules/tailwind-css-nextjs-guide-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific hybrid (Next + DaisyUI + Biome + **Starknet React + Cairo**). **Portable**: Low. **Notes**: Inconsistent eras (Pages `getServerSideProps` vs modern App Router elsewhere); many concerns in one file — hard to adopt wholesale.

## rules/tailwind-react-firebase-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Tailwind + React + Firebase) with **product-specific** prompts. **Portable**: Partial — mobile-first/a11y/firebase rules OK; mockups/pill-app feature spec is noise. **Notes**: Shouts about mockups folder and `.tsx` vs `.jsx` conflicts.

## rules/tailwind-shadcn-ui-integration-cursorrules-prompt-/.cursorrules
**Type**: Stack-specific (TypeScript + Next + Shadcn) — **very short**. **Portable**: Partial. **Notes**: Generic “expert assistant” + pseudocode-then-code + `src/` location only (~30 lines); looks truncated versus typical shadcn templates.

## rules/tauri-svelte-typescript-guide-cursorrules-prompt-f/.cursorrules
**Type**: Stack-specific (Tauri + Svelte + TypeScript + Vite + Axios). **Portable**: Partial. **Notes**: IPC/security, HTTP to Python backend, testing (Jest vs Svelte norm skewed); coherent desktop SOP.

## rules/temporal-python-cursorrules/.cursorrules
**Type**: Cross-cutting **Temporal Python SDK** SOP. **Portable**: Yes within Temporal+pytest shops. **Notes**: File is markdown wrapped in an outer ``` fence (redundant meta); solid naming (`*_workflow`/`*_activity`), layout, flake8/mypy/pytest, no Celery — lift content, fix formatting.

## rules/testrail-test-case-cursorrules-prompt-file/.cursorrules
**Type**: Cross-cutting **QA / TestRail authoring**. **Portable**: Yes. **Notes**: Persona + CSV/examples + manual structure + automation conversion — extensive, tool-specific but not codebase-specific.

## rules/typescript-axios-cursorrules-prompt-file/.cursorrules
**Type**: Broken stub. **Portable**: N/A. **Notes**: Two-line unfinished “elite PM” intro — no usable rules.

## rules/typescript-clasp-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (TypeScript + Google Apps Script + clasp). **Portable**: Partial. **Notes**: Solid GAS services, quotas, triggers, clasp deployment — good GAS checklist.

## rules/typescript-code-convention-cursorrules-prompt-file/.cursorrules
**Type**: Broken outline. **Portable**: N/A. **Notes**: Section headings only (Next/Expo/tRPC/Shadcn) with no body — corrupted or unfinished.

## rules/typescript-expo-jest-detox-cursorrules-prompt-file/.cursorrules
**Type**: Broken outline (Expo/React Native). **Portable**: N/A. **Notes**: Heading list only, no substantive bullets.

## rules/typescript-llm-tech-stack-cursorrules-prompt-file/.cursorrules
**Type**: Cross-cutting TypeScript **library/product** conventions + multi-provider LLM mindset. **Portable**: Partial — naming/FP/strict TS general; pinned versions (axios, zod, etc.) age out. **Notes**: “Prefer types over interfaces” etc.; good merge candidate for generic TS SOP minus version pins.

## rules/typescript-nestjs-best-practices-cursorrules-promp/.cursorrules
**Type**: Stack-specific (NestJS + strict TypeScript). **Portable**: Partial — TS function/class rules are broadly useful; module/DTO/service layout is Nest-specific. **Notes**: Long, opinionated (no blank lines in functions, 20-line functions) — align with team tolerance.

## rules/typescript-nextjs-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Next App Router + Drizzle + DaisyUI + Tailwind + **bun**). **Portable**: Low. **Notes**: “Always run bun” is policy-like; standard RSC/nuqs/Web Vitals bullets.

## rules/typescript-nextjs-react-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Next + Tailwind + Vercel AI SDK). **Portable**: Low. **Notes**: Truncated mid-sentence after “pre-configured APIs…” — incomplete file.

## rules/typescript-nextjs-react-tailwind-supabase-cursorru/.cursorrules
**Type**: Corrupt / typo garbage. **Portable**: N/A. **Notes**: Gibberish stack line (“Nose-Js”, “Shaden UE”); effectively empty template.

## rules/typescript-nextjs-supabase-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Next App Router + Shadcn + Supabase + Vercel AI SDK). **Portable**: Low. **Notes**: Coherent popular stack; duplicates patterns seen in other awesome-list Next rules.

## rules/typescript-nodejs-nextjs-ai-cursorrules-prompt-fil/.cursorrules
**Type**: Cross-cutting **assistant behavior** (tone/verbosity). **Portable**: Yes as persona fragment. **Notes**: Demands concrete code not high-level; minimal stack — embeddable as a short global clause.

## rules/typescript-nodejs-nextjs-app-cursorrules-prompt-fi/.cursorrules
**Type**: Stack-specific Next+Shadcn **plus embedded product spec** (notes app CRUD). **Portable**: Low. **Notes**: Second half is a full app brief (pagination, DnD, etc.) — conflates rules with one-off prompt; messy for a general SOP.

## rules/typescript-nodejs-nextjs-react-ui-css-cursorrules-/.cursorrules
**Type**: Stack-specific (Next App Router + Shadcn + Tailwind). **Portable**: Low. **Notes**: Near-duplicate of other Shadcn RSC boilerplate entries.

## rules/typescript-nodejs-react-vite-cursorrules-prompt-fi/.cursorrules
**Type**: Stack-specific (Vite + React + TanStack Query/Router + Tailwind). **Portable**: Partial. **Notes**: Useful “don’t reformat imports/comments” constraints; curly-brace rule contradicts some sibling rules — intentional for this template.

## rules/typescript-react-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (React + TypeScript). **Portable**: Partial. **Notes**: Generic hooks/strict mode/FC checklist in const-template form; thin.

## rules/typescript-react-nextjs-cloudflare-cursorrules-pro/.cursorrules
**Type**: Stack-specific (Next + Shadcn + Drizzle + **Cloudflare** D1/KV/R2/AI + wrangler). **Portable**: Low. **Notes**: Adds CF primitives + CLI expertise on top of usual RSC/Shadcn block — good when targeting Workers ecosystem.

## rules/typescript-react-nextui-supabase-cursorrules-promp/.cursorrules
**Type**: **README-style codebase description**, not agent rules. **Portable**: No — references specific paths (`frontend/app/...`). **Notes**: Auth/routing narrative for one app; weak as reusable `.cursorrules`.

## rules/typescript-shadcn-ui-nextjs-cursorrules-prompt-fil/.cursorrules
**Type**: Stack-specific (Next + Shadcn + Radix + Zod + RSC patterns). **Portable**: Low. **Notes**: Standard shadcn-next error-boundary/server-action guidance; solid but redundant with siblings.

## rules/typescript-vite-tailwind-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (**Vue 3** + Vite + Pinia + DaisyUI + Tailwind + VueUse). **Portable**: Low. **Notes**: **Filename says “typescript-vite-tailwind” but content is Vue** — label mismatch; repetitive “optimize chunking” bullets.

## rules/typescript-vuejs-cursorrules-prompt-file/.cursorrules
**Type**: Broken outline (Vue). **Portable**: N/A. **Notes**: Empty section headings only.

## rules/typescript-zod-tailwind-nextjs-cursorrules-prompt-/.cursorrules
**Type**: Stack-specific (intended Next + Shadcn + Zod + RSC). **Portable**: Low. **Notes**: **Sloppy errors**: “React Remix Components (RSC)”, desktop-first contradicts siblings, “Follow React Remix docs” — copy-paste risk; needs cleanup before use.

## rules/typo3cms-extension-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (TYPO3 extensions, PHP 8.3+). **Portable**: Partial — PSR-12, DI, extension layout, PHPUnit/testing-framework are CMS-specific but well-structured. **Notes**: Strong scaffold doc for EXT builders.

## rules/uikit-guidelines-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (UIKit programmatic + SnapKit). **Portable**: Partial. **Notes**: MVC/MVVM hygiene, no storyboards, closure events with `self` — concise iOS UI constraints.

## rules/unity-cursor-ai-c-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific stub (Unity + C#, Ringcon tower defense). **Portable**: No. **Notes**: Comment-styled context only (~20 lines) — not an actionable ruleset.

## rules/vitest-unit-testing-cursorrules-prompt-file/.cursorrules
**Type**: Cross-cutting **unit testing with Vitest**. **Portable**: Yes for TS/JS tests. **Notes**: vi.mock before imports, 3–5 tests/file guidance, examples — practical; TS example uses `any` on mocks (common but note for strict shops).

## rules/vscode-extension-dev-typescript-cursorrules-prompt-file/.cursorrules
**Type**: Cross-cutting **VS Code extension** engineering. **Portable**: Yes in extension repos. **Notes**: Manifest, activation, webviews, security, cross-platform, testing — comprehensive and professional.

## rules/vue-3-nuxt-3-development-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Vue 3 + Nuxt 3 + Tailwind). **Portable**: Partial. **Notes**: Pseudocode-first, Tailwind-only styling, `handle*` events, a11y — concrete; Vue 3 `<script setup>` implied via “composition api”.

## rules/vue-3-nuxt-3-typescript-cursorrules-prompt-file/.cursorrules
**Type**: Corrupt placeholder. **Portable**: N/A. **Notes**: “Forgot to include content of corrupted file” — no rules.

## rules/vue3-composition-api-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Vue 3 Composition API). **Portable**: Partial. **Notes**: Const-template checklist (ref/reactive/computed/watch) + folder layout; thin.

## rules/web-app-optimization-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (**Svelte 5 + SvelteKit** performance/i18n) despite generic folder name. **Portable**: Partial. **Notes**: **Misleading name**: large rune/shadcn/Tailwind/Paraglide/SSR-SSG guide — valuable for SvelteKit, not general “web app optimization.”

## rules/webassembly-z80-cellular-automata-cursorrules-prom/.cursorrules
**Type**: Cross-cutting **niche simulation architecture** (Z80 CA + WASM + shaders + UI). **Portable**: Low — domain-specific design spec. **Notes**: Long implementation plan (region grid, soup cells, WASM boundary, shaders) — excellent for that project, odd for general repos.

## rules/wordpress-php-guzzle-gutenberg-cursorrules-prompt-/.cursorrules
**Type**: Stack-specific (WordPress plugin + Guzzle + Gutenberg + typed PHP). **Portable**: Partial. **Notes**: Very short; emphasizes WPCS, TS over JS, functional bias — needs expansion for real plugins.

## rules/xian-smart-contracts-cursor-rules-prompt-file/.cursorrules
**Type**: Stack-specific (**Xian / contracting** Python contracts). **Portable**: No outside chain. **Notes**: Massive authoritative reference (exports, Hash/Variable, ctx.*, tests, security tests) — high quality **for Xian only**; includes branding “never mention TAU/Lamden.”

## rules/xray-test-case-cursorrules-prompt-file/.cursorrules
**Type**: Cross-cutting **Xray/Jira test authoring**. **Portable**: Yes. **Notes**: Parallel to TestRail entry: structure, examples, automation conversion; “avoid technical jargon” rule conflicts with many real apps — tune per audience.

## rules/react-redux-typescript-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (React + Redux Toolkit + TypeScript). **Portable**: Partial — only high-level bullets encoded as fake JS `const` arrays; no project paths. **Notes**: Thin checklist (RTK, slices, `createAsyncThunk`, typed hooks); fine as seed list, not self-enforcing.

## rules/react-styled-components-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (React + styled-components). **Portable**: Partial. **Notes**: ThemeProvider, macro, naming `Styled*` — same templated “const checklist” style as sibling React rules; shallow.

## rules/react-typescript-nextjs-nodejs-cursorrules-prompt-/.cursorrules
**Type**: Stack-specific (Next.js 14 App Router + Wagmi/Viem + Shadcn + Tailwind; **not** the folder-name stack). **Portable**: Low — `next-safe-action`, Zod, RSC patterns are template-bound. **Notes**: **Content/folder mismatch**: body is Web3 + App Router + server actions, not generic React/Node; otherwise dense and actionable for that template.

## rules/react-typescript-symfony-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (React, TypeScript, PHP, Symfony, Docker). **Portable**: Partial — only a short expert persona, zero concrete conventions. **Notes**: Placeholder-level; unusable as an SOP without expansion.

## rules/salesforce-apex-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Salesforce Apex). **Portable**: Partial. **Notes**: **No `.cursorrules` in tree — used `.cursorrules.txt`.** Substantive Apex guidance: Queueable + `System.Finalizer`, null-object/repository patterns, naming, newspaper method order; strong for Apex teams.

## rules/scala-kafka-cursorrules-prompt-file/.cursorrules
**Type**: Cross-cutting Scala 3 + Kafka Streams engineering (split across `.mdc` rules). **Portable**: Partial — FP/ScalaTest/SLF4J travel; Kafka `TopologyTestDriver` + topic naming assume Streams. **Notes**: **No `.cursorrules` — reviewed `general-scala-clean-code.mdc`, `general-scala-development-practices.mdc`, `kafka-development-practices.mdc`, `linting-formatting.mdc` (YAML frontmatter is Cursor-specific).

## rules/solidity-foundry-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Solidity + Foundry + OpenZeppelin/Solady). **Portable**: Low. **Notes**: Long security/gas checklist plus informal “general rules” (tone/casual) that conflict with enterprise SOP tone; Foundry specifics (`forge`, fuzz, invariants, `foundry.toml` snippets) are the core value.

## rules/solidity-hardhat-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Solidity + Hardhat). **Portable**: Low. **Notes**: Same “casual expert” preamble as Foundry sibling; body is shorter generic Solidity + Hardhat workflow — overlaps heavily with Foundry file minus Foundry depth.

## rules/solidity-react-blockchain-apps-cursorrules-prompt-/.cursorrules
**Type**: Corrupt / unusable. **Portable**: N/A. **Notes**: Only a “corrupted file” placeholder from the model — no rules.

## rules/solidjs-basic-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (SolidJS). **Portable**: Partial. **Notes**: Minimal signals/effects/router checklist in JS-const template form.

## rules/solidjs-tailwind-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (SolidJS + Tailwind). **Portable**: Partial. **Notes**: Utility-first + JIT/`@apply` reminders; thin.

## rules/solidjs-typescript-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (SolidJS + TypeScript). **Portable**: Partial. **Notes**: Strict TS + typed signals; same shallow pattern as other Solid entries.

## rules/svelte-5-vs-svelte-4-cursorrules-prompt-file/.cursorrules
**Type**: Cross-cutting **migration reference** (Svelte 4 → 5). **Portable**: Yes for Svelte teams. **Notes**: Clear runes (`$state`, `$derived`, `$effect`), event syntax `on:click` → `onclick`, import runes, loss of event modifiers — high-signal and concise.

## rules/sveltekit-restful-api-tailwind-css-cursorrules-pro/.cursorrules
**Type**: Stack-specific (SvelteKit + Supabase + Tailwind + Vitest) but **heavily repo-specific**. **Portable**: No — hard-coded Windows paths (`E:\...`), “Stojanovic-One”, `AI.MD`, Musk “algorithm,” PowerShell-only guidance. **Notes**: Mixes process (TDD 80% coverage) with brittle path rules; strip for reuse.

## rules/sveltekit-tailwindcss-typescript-cursorrules-promp/.cursorrules
**Type**: Stack-specific (SvelteKit 2 / Svelte 4 + Tailwind + TS). **Portable**: Partial. **Notes**: “Modible” typo; requires chain-of-thought before code; long SvelteKit stores/load/accessibility/Tailwind patterns — useful but verbose and Svelte-4-centric (not runes).

## rules/sveltekit-typescript-guide-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Svelte 5 + SvelteKit + Supabase + Drizzle) **incomplete**. **Portable**: Low. **Notes**: Truncated: section headings plus one `Counter` class rune example only; broken markup/unfinished doc.

## rules/swift-uikit-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (UIKit + MVVM + RxSwift). **Portable**: Partial. **Notes**: **No `.cursorrules` — reviewed `.cursorrules-mvvm-rxswift`.** Detailed folder layout, binding examples, Rx patterns; substantive for that stack.

## rules/swiftui-guidelines-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (SwiftUI). **Portable**: Partial. **Notes**: Short folder structure + UI guidance; pins “Aug/Sep 2024” docs; “don’t remove comments” meta-rule.

## rules/tailwind-css-nextjs-guide-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific hybrid (Next + DaisyUI + Biome + **Starknet React + Cairo**). **Portable**: Low. **Notes**: Inconsistent eras (Pages `getServerSideProps` vs modern App Router elsewhere); many concerns in one file — hard to adopt wholesale.

## rules/tailwind-react-firebase-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Tailwind + React + Firebase) with **product-specific** prompts. **Portable**: Partial — mobile-first/a11y/firebase rules OK; mockups/pill-app feature spec is noise. **Notes**: Shouts about mockups folder and `.tsx` vs `.jsx` conflicts.

## rules/tailwind-shadcn-ui-integration-cursorrules-prompt-/.cursorrules
**Type**: Stack-specific (TypeScript + Next + Shadcn) — **very short**. **Portable**: Partial. **Notes**: Generic “expert assistant” + pseudocode-then-code + `src/` location only (~30 lines); looks truncated versus typical shadcn templates.

## rules/tauri-svelte-typescript-guide-cursorrules-prompt-f/.cursorrules
**Type**: Stack-specific (Tauri + Svelte + TypeScript + Vite + Axios). **Portable**: Partial. **Notes**: IPC/security, HTTP to Python backend, testing (Jest vs Svelte norm skewed); coherent desktop SOP.

## rules/temporal-python-cursorrules/.cursorrules
**Type**: Cross-cutting **Temporal Python SDK** SOP. **Portable**: Yes within Temporal+pytest shops. **Notes**: File is markdown wrapped in an outer code fence (redundant meta); solid naming (`*_workflow`/`*_activity`), layout, flake8/mypy/pytest, no Celery — lift content, fix formatting.

## rules/testrail-test-case-cursorrules-prompt-file/.cursorrules
**Type**: Cross-cutting **QA / TestRail authoring**. **Portable**: Yes. **Notes**: Persona + CSV/examples + manual structure + automation conversion — extensive, tool-specific but not codebase-specific.

## rules/typescript-axios-cursorrules-prompt-file/.cursorrules
**Type**: Broken stub. **Portable**: N/A. **Notes**: Two-line unfinished “elite PM” intro — no usable rules.

## rules/typescript-clasp-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (TypeScript + Google Apps Script + clasp). **Portable**: Partial. **Notes**: Solid GAS services, quotas, triggers, clasp deployment — good GAS checklist.

## rules/typescript-code-convention-cursorrules-prompt-file/.cursorrules
**Type**: Broken outline. **Portable**: N/A. **Notes**: Section headings only (Next/Expo/tRPC/Shadcn) with no body — corrupted or unfinished.

## rules/typescript-expo-jest-detox-cursorrules-prompt-file/.cursorrules
**Type**: Broken outline (Expo/React Native). **Portable**: N/A. **Notes**: Heading list only, no substantive bullets.

## rules/typescript-llm-tech-stack-cursorrules-prompt-file/.cursorrules
**Type**: Cross-cutting TypeScript **library/product** conventions + multi-provider LLM mindset. **Portable**: Partial — naming/FP/strict TS general; pinned versions (axios, zod, etc.) age out. **Notes**: “Prefer types over interfaces” etc.; good merge candidate for generic TS SOP minus version pins.

## rules/typescript-nestjs-best-practices-cursorrules-promp/.cursorrules
**Type**: Stack-specific (NestJS + strict TypeScript). **Portable**: Partial — TS function/class rules are broadly useful; module/DTO/service layout is Nest-specific. **Notes**: Long, opinionated (no blank lines in functions, 20-line functions) — align with team tolerance.

## rules/typescript-nextjs-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Next App Router + Drizzle + DaisyUI + Tailwind + **bun**). **Portable**: Low. **Notes**: “Always run bun” is policy-like; standard RSC/nuqs/Web Vitals bullets.

## rules/typescript-nextjs-react-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Next + Tailwind + Vercel AI SDK). **Portable**: Low. **Notes**: Truncated mid-sentence after “pre-configured APIs…” — incomplete file.

## rules/typescript-nextjs-react-tailwind-supabase-cursorru/.cursorrules
**Type**: Corrupt / typo garbage. **Portable**: N/A. **Notes**: Gibberish stack line (“Nose-Js”, “Shaden UE”); effectively empty template.

## rules/typescript-nextjs-supabase-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Next App Router + Shadcn + Supabase + Vercel AI SDK). **Portable**: Low. **Notes**: Coherent popular stack; duplicates patterns seen in other awesome-list Next rules.

## rules/typescript-nodejs-nextjs-ai-cursorrules-prompt-fil/.cursorrules
**Type**: Cross-cutting **assistant behavior** (tone/verbosity). **Portable**: Yes as persona fragment. **Notes**: Demands concrete code not high-level; minimal stack — embeddable as a short global clause.

## rules/typescript-nodejs-nextjs-app-cursorrules-prompt-fi/.cursorrules
**Type**: Stack-specific Next+Shadcn **plus embedded product spec** (notes app CRUD). **Portable**: Low. **Notes**: Second half is a full app brief (pagination, DnD, etc.) — conflates rules with one-off prompt; messy for a general SOP.

## rules/typescript-nodejs-nextjs-react-ui-css-cursorrules-/.cursorrules
**Type**: Stack-specific (Next App Router + Shadcn + Tailwind). **Portable**: Low. **Notes**: Near-duplicate of other Shadcn RSC boilerplate entries.

## rules/typescript-nodejs-react-vite-cursorrules-prompt-fi/.cursorrules
**Type**: Stack-specific (Vite + React + TanStack Query/Router + Tailwind). **Portable**: Partial. **Notes**: Useful “don’t reformat imports/comments” constraints; curly-brace rule contradicts some sibling rules — intentional for this template.

## rules/typescript-react-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (React + TypeScript). **Portable**: Partial. **Notes**: Generic hooks/strict mode/FC checklist in const-template form; thin.

## rules/typescript-react-nextjs-cloudflare-cursorrules-pro/.cursorrules
**Type**: Stack-specific (Next + Shadcn + Drizzle + **Cloudflare** D1/KV/R2/AI + wrangler). **Portable**: Low. **Notes**: Adds CF primitives + CLI expertise on top of usual RSC/Shadcn block — good when targeting Workers ecosystem.

## rules/typescript-react-nextui-supabase-cursorrules-promp/.cursorrules
**Type**: **README-style codebase description**, not agent rules. **Portable**: No — references specific paths (`frontend/app/...`). **Notes**: Auth/routing narrative for one app; weak as reusable `.cursorrules`.

## rules/typescript-shadcn-ui-nextjs-cursorrules-prompt-fil/.cursorrules
**Type**: Stack-specific (Next + Shadcn + Radix + Zod + RSC patterns). **Portable**: Low. **Notes**: Standard shadcn-next error-boundary/server-action guidance; solid but redundant with siblings.

## rules/typescript-vite-tailwind-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (**Vue 3** + Vite + Pinia + DaisyUI + Tailwind + VueUse). **Portable**: Low. **Notes**: **Filename says “typescript-vite-tailwind” but content is Vue** — label mismatch; repetitive “optimize chunking” bullets.

## rules/typescript-vuejs-cursorrules-prompt-file/.cursorrules
**Type**: Broken outline (Vue). **Portable**: N/A. **Notes**: Empty section headings only.

## rules/typescript-zod-tailwind-nextjs-cursorrules-prompt-/.cursorrules
**Type**: Stack-specific (intended Next + Shadcn + Zod + RSC). **Portable**: Low. **Notes**: **Sloppy errors**: “React Remix Components (RSC)”, desktop-first contradicts siblings, “Follow React Remix docs” — copy-paste risk; needs cleanup before use.

## rules/typo3cms-extension-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (TYPO3 extensions, PHP 8.3+). **Portable**: Partial — PSR-12, DI, extension layout, PHPUnit/testing-framework are CMS-specific but well-structured. **Notes**: Strong scaffold doc for EXT builders.

## rules/uikit-guidelines-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (UIKit programmatic + SnapKit). **Portable**: Partial. **Notes**: MVC/MVVM hygiene, no storyboards, closure events with `self` — concise iOS UI constraints.

## rules/unity-cursor-ai-c-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific stub (Unity + C#, Ringcon tower defense). **Portable**: No. **Notes**: Comment-styled context only (~20 lines) — not an actionable ruleset.

## rules/vitest-unit-testing-cursorrules-prompt-file/.cursorrules
**Type**: Cross-cutting **unit testing with Vitest**. **Portable**: Yes for TS/JS tests. **Notes**: vi.mock before imports, 3–5 tests/file guidance, examples — practical; TS example uses `any` on mocks (common but note for strict shops).

## rules/vscode-extension-dev-typescript-cursorrules-prompt-file/.cursorrules
**Type**: Cross-cutting **VS Code extension** engineering. **Portable**: Yes in extension repos. **Notes**: Manifest, activation, webviews, security, cross-platform, testing — comprehensive and professional.

## rules/vue-3-nuxt-3-development-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Vue 3 + Nuxt 3 + Tailwind). **Portable**: Partial. **Notes**: Pseudocode-first, Tailwind-only styling, `handle*` events, a11y — concrete; Vue 3 `<script setup>` implied via “composition api”.

## rules/vue-3-nuxt-3-typescript-cursorrules-prompt-file/.cursorrules
**Type**: Corrupt placeholder. **Portable**: N/A. **Notes**: “Forgot to include content of corrupted file” — no rules.

## rules/vue3-composition-api-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (Vue 3 Composition API). **Portable**: Partial. **Notes**: Const-template checklist (ref/reactive/computed/watch) + folder layout; thin.

## rules/web-app-optimization-cursorrules-prompt-file/.cursorrules
**Type**: Stack-specific (**Svelte 5 + SvelteKit** performance/i18n) despite generic folder name. **Portable**: Partial. **Notes**: **Misleading name**: large rune/shadcn/Tailwind/Paraglide/SSR-SSG guide — valuable for SvelteKit, not general “web app optimization.”

## rules/webassembly-z80-cellular-automata-cursorrules-prom/.cursorrules
**Type**: Cross-cutting **niche simulation architecture** (Z80 CA + WASM + shaders + UI). **Portable**: Low — domain-specific design spec. **Notes**: Long implementation plan (region grid, soup cells, WASM boundary, shaders) — excellent for that project, odd for general repos.

## rules/wordpress-php-guzzle-gutenberg-cursorrules-prompt-/.cursorrules
**Type**: Stack-specific (WordPress plugin + Guzzle + Gutenberg + typed PHP). **Portable**: Partial. **Notes**: Very short; emphasizes WPCS, TS over JS, functional bias — needs expansion for real plugins.

## rules/xian-smart-contracts-cursor-rules-prompt-file/.cursorrules
**Type**: Stack-specific (**Xian / contracting** Python contracts). **Portable**: No outside chain. **Notes**: Massive authoritative reference (exports, Hash/Variable, ctx.*, tests, security tests) — high quality **for Xian only**; includes branding “never mention TAU/Lamden.”

## rules/xray-test-case-cursorrules-prompt-file/.cursorrules
**Type**: Cross-cutting **Xray/Jira test authoring**. **Portable**: Yes. **Notes**: Parallel to TestRail entry: structure, examples, automation conversion; “avoid technical jargon” rule conflicts with many real apps — tune per audience.

## rules/nativescript-cursorrules-prompt-file/.cursorrules
**Type**: NativeScript starter checklist (core APIs, navigation, assets/fonts, TypeScript, secure storage, biometrics, nativescript-fonticon, performance) plus a minimal `src/` tree sketch. **Portable**: No. **Notes**: Same `const` string-array `.cursorrules` pattern as other rules in this registry; depth is shallow but stack-appropriate.

## rules/netlify-official-cursorrules-prompt-file/.cursorrules
**Type**: Netlify-first deployment and compute playbook—YAML frontmatter, override block, functions vs edge vs background vs scheduled, Deno edge constraints, Blobs API surface (typed `Store` contract), Image CDN, env vars/CLI, site init/linking, `.netlify` hygiene, and strong “no CORS unless asked” guardrails. **Portable**: Partial — most content is **Netlify-specific** (CLI, `netlify.toml`, `@netlify/*` packages); a few ideas (don’t version-pin imports in examples, avoid broad CORS) are broadly applicable only in spirit. **Notes**: Very high reference value for Netlify projects; includes API typings and operational limits; minor encoding/typo artifacts in upstream text; `ProviderContext` wrapper is vendor-schema-ish—expect tooling that reads plain Markdown rules.

## rules/next-type-llm/.cursorrules
**Type**: Cross-cutting **assistant operating procedure**: fixed stack block (Next.js + shadcn + Tailwind + Lucide, API routes, Python LLM bridge), coding style (path/filename lead comment, modularity), process (step reasoning, one file at a time, TODOs, verbosity V0–V3), and a **rigid response envelope** (opening “Language > Specialist…” block + closing History/Source Tree/Next Task block). **Portable**: Partial — process and comment discipline travel; stack and verbose template are project/persona-specific. **Notes**: Duplicates the same prose pattern as `nextjs-typescript-cursorrules-prompt-file`; emoji legend in template may annoy teams with plain-PR norms.

## rules/nextjs-app-router-cursorrules-prompt-file/.cursorrules
**Type**: Minimal Next.js App Router reminder list (RSC default, `app/` special files, route handlers) plus `app/` tree using `.js` examples while urging TypeScript. **Portable**: No — Next App Router only. **Notes**: Inconsistent TS vs `.js` sketch; fine as a one-screen checklist, not an executable SOP.

## rules/nextjs-material-ui-tailwind-css-cursorrules-prompt/.cursorrules
**Type**: **Not engineering rules** — French/English scaffold notes and a **pinned `package.json` dependency snapshot** for a personal “Portfolio2” app (MUI, shadcn-ui package name, Prisma, CKEditor, styled-components, Next 14). **Portable**: No. **Notes**: Misleading folder name vs content; treat as project bootstrap context, not portable standards.

## rules/nextjs-react-tailwind-cursorrules-prompt-file/.cursorrules
**Type**: Next.js App Router + TypeScript + Shadcn + Tailwind (+ Framer Motion, `nuqs`) expert persona—functional style, naming, RSC-first, performance, component organization under `src/`. **Portable**: No — Next/React/Tailwind ecosystem. **Notes**: Opinionated but coherent; `placekitten.com` placeholder guidance is dated/optional.

## rules/nextjs-react-typescript-cursorrules-prompt-file/.cursorrules
**Type**: **Web3-weighted** Next 14 stack brief—Solidity/Viem/Wagmi listed alongside TypeScript, RSC, Shadcn/Radix/Tailwind Aria, Zod, `next-safe-action`, TanStack Query service errors, `useActionState` + RHF. **Portable**: No. **Notes**: Strong checklist density; “Tailwind Aria” may be imprecise wording; verify `next-safe-action` + `ActionResponse` paths match your repo.

## rules/nextjs-seo-dev-cursorrules-prompt-file/.cursorrules
**Type**: Repo-local **`package.json` embed** for `@se-2/nextjs` (RainbowKit/Wagmi/Viem/DaisyUI) plus comment preservation rules (“Do not touch this line Cursor”) and Prettier scope. **Portable**: No. **Notes**: SEO folder name mismatches body—this is a **Scaffold-ETH–style** dependency lock-in sheet, not generic SEO guidance.

## rules/nextjs-supabase-shadcn-pwa-cursorrules-prompt-file/.cursorrules
**Type**: **Hybrid**: strict engineering habits (150-line file cap, RORO, Zustand, PWA, Next 15+ RSC-first, shadcn add workflow) **and** **process SOP** for `/ProjectDocs/Build_Notes/` and `/ProjectDocs/contexts/projectContext.md` (naming, no task deletion, archive flows) plus monorepo/Taskfile mentions. **Portable**: Partial — doc/process halves transfer to any team willing to adopt that taxonomy; stack half is Next/Supabase/shadcn/PWA-shaped. **Notes**: Cross-cutting **project governance** content is the distinctive asset; keep or strip the `ProjectDocs` contract to match your repo.

## rules/nextjs-supabase-todo-app-cursorrules-prompt-file/.cursorrules
**Type**: **Stub** — headline “build the Todo app” with empty rule list under “Follow these rules:”. **Portable**: N/A. **Notes**: Incomplete placeholder; no substantive `.cursorrules` body to audit.

## rules/nextjs-tailwind-typescript-apps-cursorrules-prompt/.cursorrules
**Type**: Generic “expert assistant” brief: latest Next + Tailwind + TypeScript + Supabase integration + light mode/dark palette + LangChain/RAG awareness + strict pseudocode-then-code / no-TODOs workflow. **Portable**: Partial — workflow bullets are cross-cutting; stack list narrows portability. **Notes**: “Readability over performant” typo in source; breadth (LangChain) may be noise for non-RAG apps.

## rules/nextjs-typescript-app-cursorrules-prompt-file/.cursorrules
**Type**: **Two-line project blurb** only (“Astral” block explorer, lists libraries in prose). **Portable**: No. **Notes**: Not actionable rules—onboarding fragment only.

## rules/nextjs-typescript-cursorrules-prompt-file/.cursorrules
**Type**: Same **LLM bridge + assistant-response template** content as `next-type-llm` (Next + shadcn + Tailwind + Python wrapper, path comment rule, V0–V3, History/Source Tree closer). **Portable**: Partial — duplicate of `next-type-llm`; same portability split. **Notes**: Maintainers should dedupe in any merged SOP corpus.

## rules/nextjs-typescript-tailwind-cursorrules-prompt-file/.cursorrules
**Type**: **Product onboarding** for Astral (Autonomys block explorer)—URLs, structure, scripts, AI interaction bullets, branding glossary (H+AI, deAI, etc.). **Portable**: No — org/product URLs and lexicon lock scope. **Notes**: Folder name promises generic stack rules; body is single-product context; still useful as a **domain glossary** for that codebase.

## rules/nextjs-vercel-supabase-cursorrules-prompt-file/.cursorrules
**Type**: **BA Copilot product specification** (BPMN chat + bpmn-js, vision narrative) plus chosen stack (Next App Router, Vercel AI, Supabase, TanStack Query, MUI, Orval) and constraints (`src/app` only, teach Next.js, Devias template bleed-in). **Portable**: No. **Notes**: Valuable as **PRD/agent context**, weak as generic Vercel+Supabase coding standards; filename overpromises portability.

## rules/nextjs-vercel-typescript-cursorrules-prompt-file/.cursorrules
**Type**: Extended Next + Shadcn + Tailwind checklist merged with **AI SDK RSC + Vercel KV + middleware** guidance (install `ai-sdk-rsc`, session cookies, examples). **Portable**: No. **Notes**: **Quality issues**: references **Pages-era** `getServerSideProps`/`getStaticProps` alongside App Router; sample `Chat` component uses hook-like patterns in a way that doesn't match real RSC/AI SDK APIs—treat as **aspirational draft**, verify against current `@ai-sdk/*` docs before reuse.

## rules/nextjs15-react19-vercelai-tailwind-cursorrules-prompt-file/.cursorrules
**Type**: Next 15 + React 19 + Vercel AI + Shadcn/Radix/Tailwind senior-engineer playbook (analysis steps, TS style, RSC-first, `useActionState`, async `cookies`/`headers`/`draftMode`, async route params). **Portable**: No — pinned modern Next/React/Vercel AI stack. **Notes**: File **truncates mid-snippet** in this checkout (ends inside async-runtime example)—incomplete upstream copy.

## rules/nodejs-mongodb-cursorrules-prompt-file-tutorial/.cursorrules
**Type**: **Domain requirements doc** for a pools/picks game on Express + Mongo/Mongoose + JWT (+ optional React admin, Docker)—user flows, entry numbering, admin approval, scoring, REST/pseudocode-first process. **Portable**: No. **Notes**: Excellent **product+API design brief** for that app; not reusable Node/Mongo style guidance outside the described domain.

## rules/python-django-best-practices-cursorrules-prompt-fi/.cursorrules
**Type**: Django/DRF-oriented best-practices persona (MVT, CBV vs FBV, ORM, forms, security, caching, Celery/Redis/Postgres stack list, testing). **Portable**: No — Django ecosystem. **Notes**: Conventional, readable checklist; some stacks async—validate against your Django version and async view policy.

## rules/python-fastapi-best-practices-cursorrules-prompt-f/.cursorrules
**Type**: Dense FastAPI scalable-API brief (RORO, type hints, Pydantic v2, async DB libs, SQLAlchemy 2.0, lifespan over deprecated events, middleware, caching). **Portable**: No. **Notes**: Good compression; a few bullets echo React-era phrasing (“functional components”) as copy-paste noise—ignore for Python.

## rules/python-fastapi-cursorrules-prompt-file/.cursorrules
**Type**: Short Python list + folder tree (`routers/schemas/services`) — classic “awesome-cursorrules” template style. **Portable**: No. **Notes**: Starter-level; overlaps other FastAPI entries but lowest detail.

## rules/python-fastapi-scalable-api-cursorrules-prompt-fil/.cursorrules
**Type**: **Full-stack monorepo sketch** (FastAPI + Postgres backend with Alembic/Docker; Vite React + Tailwind/Shadcn frontend) plus shared style/error/perf rules and a questionable “no auth required” platform note. **Portable**: Partial — separate **backend** and **frontend** slices are each stack-bound; only generic hygiene overlaps. **Notes**: Flag the **no authentication** line before any reuse; frontend section mixes Next-isms (`use client`) into Vite/React without clarifying framework.

## rules/python-flask-json-guide-cursorrules-prompt-file/.cursorrules
**Type**: **Vendor/sample code** for a custom `drawscape_factorio` module (JSON import + SVG output) — not Flask or JSON API guidance despite the folder name. **Portable**: No. **Notes**: Entirely mismatched title vs content; only useful if that proprietary module exists in-repo.

## rules/python-llm-ml-workflow-cursorrules-prompt-file/.cursorrules
**Type**: **Cross-cutting Python ML/LLM engineering handbook**—Poetry/Rye, Ruff strict typing, pytest coverage targets, Hydra/DVC/MLflow notes, FastAPI section, security and anti–over-engineering guardrails, broad optional toolchain list. **Portable**: Yes within **Python ML services**; not language-agnostic. **Notes**: Strong generic corpus for data/ML repos; many pinned ecosystem names—update periodically; 90% coverage mandate may conflict with org policy.

## rules/python-projects-guide-cursorrules-prompt-file/.cursorrules
**Type**: Ten-bullet Python “healthy repo” summary (layout, modular layers, env config, tests, Ruff, Rye, CI, AI-friendly naming/types/comments). **Portable**: Partial — Python/org-process flavored, not framework-specific. **Notes**: Compact **cross-cutting** baseline; pairs well with linter/CI reality in the target repo.

## rules/qa-bug-report-cursorrules-prompt-file/.cursorrules
**Type**: **Cross-cutting QA bug-report SOP** — persona, severity rubric, Markdown template (environment, repro, expected/actual, logs, optional fix), example report, writing best practices, tracker adaptation notes. **Portable**: Yes for software QA workflows. **Notes**: High-value, stack-agnostic; trim example domain (`example.com`) when templating internally.

## rules/qwik-basic-cursorrules-prompt-file/.cursorrules
**Type**: Qwik + Vite + TS checklist (`$` lazy boundaries, signals/store/resource/task/visible-task, Qwik City, `server$`). **Portable**: No — Qwik-specific. **Notes**: Standard short template file; mentions Tailwind purge wording that may age with tooling.

## rules/qwik-tailwind-cursorrules-prompt-file/.cursorrules
**Type**: Qwik + Tailwind checklist (responsive utilities, `@apply`, dark mode, purge, `server$`). **Portable**: No — Qwik + Tailwind only. **Notes**: Companion to basic Qwik file; same structural strengths/limitations.

## rules/r-cursorrules-prompt-file-best-practices/.cursorrules
**Type**: **Cross-cutting R ecosystem handbook**—project/package layout, `renv`, tidyverse style, naming, vectorization vs loops, data.table/duckdb guidance, `testthat`, Quarto/RMarkdown reproducibility, Shiny modules, CI/Docker, preferred package shortlist. **Portable**: Yes **within R**; not outside. **Notes**: Unusually comprehensive for this registry; a few opinions (always `glue`, always `package::`) should be reconciled with house style.

## rules/rails-cursorrules-prompt-file/.cursorrules
**Type**: **Empty file** — no rules text. **Portable**: N/A. **Notes**: Placeholder or upstream error; no assessable content beyond presence of path.

## rules/react-chakra-ui-cursorrules-prompt-file/.cursorrules
**Type**: Chakra UI starter (Provider, theme, responsive hooks, a11y, color mode) + sample tree with `theme/` layer folders. **Portable**: No — Chakra stack. **Notes**: Thin checklist; fine as a reminder list for Chakra apps.

## rules/react-components-creation-cursorrules-prompt-file/.cursorrules
**Type**: **Monorepo workflow** to prefer v0.dev links — search `packages/ui` and `apps/spa`, URL-encode a Tailwind+TS prompt, then adapt imports to `@repo/ui` shadcn paths. **Portable**: Partial — **process** (check for existing components first) is portable; v0 link contract and path literals are repo-specific. **Notes**: Unusually operational; useless without that monorepo layout and v0 usage policy.

## rules/react-graphql-apollo-client-cursorrules-prompt-file/.cursorrules
**Type**: Apollo Client GraphQL checklist (Provider, queries/mutations/fragments, hooks, cache, DevTools) + `src/graphql/` tree. **Portable**: No — Apollo GraphQL client stack. **Notes**: Starter depth; “query components” wording is slightly dated vs hooks-first Apollo.

## rules/react-mobx-cursorrules-prompt-file/.cursorrules
**Type**: MobX + mobx-react-lite checklist (stores, computed, actions, strict mode, observers, DevTools) + `stores/` tree. **Portable**: No — MobX React stack. **Notes**: Mention of `useObserver`—verify against current mobx-react-lite API preferences (`observer` HOC usually).

## rules/react-native-expo-cursorrules-prompt-file/.cursorrules
**Type**: Expo/RN basics (hooks, Router, assets, push, OTA, StyleSheet, SecureStore, offline, performance) + classic `src/` tree. **Portable**: No — Expo. **Notes**: `App.js` vs Router layouts may not match modern `expo-router`-only apps—pair with router-specific rule if needed.

## rules/react-native-expo-router-typescript-windows-cursorrules-prompt-file/.cursorrules
**Type**: Expo Router variant of RN rules plus **NativeWind** version pins (nativewind@2.0.11 + tailwindcss@3.3.2), Babel ordering notes, and **Windows PowerShell-specific** terminal workflows (`Get-ChildItem`, `Move-Item`). **Portable**: No — Expo + Windows + NativeWind coupling. **Notes**: The version pin block is high-signal for avoiding known CSS pipeline errors; PowerShell section is environment-specific noise for macOS/Linux teams.

## rules/react-nextjs-ui-development-cursorrules-prompt-fil/.cursorrules
**Type**: Browser/JS assistant brief mandating **App Router only** (no Pages router), pseudocode-then-code, no TODOs, Vercel **and Replit** hosting compatibility. **Portable**: Partial — workflow is generic; dual-host constraint is situational. **Notes**: Short and actionable; “JavaScript for the browser” header slightly conflicts with typical Next TS stacks unless intentional.

## rules/react-query-cursorrules-prompt-file/.cursorrules
**Type**: TanStack Query checklist (QueryClient/provider, keys, prefetch, hooks folders, DevTools, SWR strategy, optimistic updates, invalidation). **Portable**: No — React Query client stack. **Notes**: Folder naming (`useQueries/`) is opinionated; aligns with other registry mini-templates.

## rules/react-redux-typescript-cursorrules-prompt-file/.cursorrules
**Type**: Redux Toolkit + TypeScript checklist (slices, `createAsyncThunk`, selectors, typed hooks, feature folders). **Portable**: No — RTK/React stack. **Notes**: Suggests `React.FC`—many teams now avoid it; otherwise standard.

## rules/react-styled-components-cursorrules-prompt-file/.cursorrules
**Type**: styled-components/theming checklist (`macro`, ThemeProvider, `Styled*` naming, `attrs`, TS) + `components/styled` tree. **Portable**: No — styled-components stack. **Notes**: Macro requires build setup; mention in mergers with Babel/Next config reality.
