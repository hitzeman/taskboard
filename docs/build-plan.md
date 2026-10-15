# TaskBoard Build Plan

Oct 13, 2026 · @Todd

## How we work

Over 12 one-hour sessions, you build TaskBoard, a small ClickUp-style task app, and type every line yourself. By the end, each requirement in the ClickUp Senior Frontend posting maps to something you built and can explain out loud.

**Ground rules**

- You type the code. No AI writes code for this project. I explain concepts, answer questions, and review what you wrote.
- Paste your code or a diff into our chat after each step. I review it like a senior teammate would: what works, what I'd change, and why.
- If a concept doesn't click, stop and ask. Understanding beats finishing the session's list.
- Angular only. React is part of the job but not a requirement, so it's out of scope.

**Component-first flow (every feature)**

1. **Sketch it.** What does the user see? Draw the boxes on paper or describe them in a comment.
2. **Write down the data it needs.** Before any code, write the shape the component needs as a TypeScript type or a JSON sample. Each session below gives you this shape to start from.
3. **Build the component with hard-coded data.** Template, Tailwind, semantic HTML, inputs and outputs.
4. **Pull the data out.** Only now add the model, service, or store the component needs, and swap the hard-coded data for the real source.
5. **Explain it out loud.** Answer the session's interview questions as if I'm the interviewer.

**Session format (60 minutes)**

| Minutes | What                                                               |
| ------- | ------------------------------------------------------------------ |
| 0–5     | Warm-up: rebuild one small piece from the last session from memory |
| 5–45    | Build the session's feature, component first                       |
| 45–60   | Interview questions out loud, then tick off checklist items        |

Tick items off in your ClickUp Interview Prep checklist as you go. Each session lists the items it covers by their checklist ID.

## The app: TaskBoard

TaskBoard is one workspace of tasks shown two ways, as a board and as a list, with every view reading the same data. That's ClickUp's core frontend problem, scaled down.

**What a user can do**

- See tasks as a **board**: one column per status (To do, In progress, In review, Done). Drag a card between columns to change its status.
- See the same tasks as a **list**: a sortable, filterable table. Filters and sort live in the URL, so a link reopens the same view.
- Open a **task panel** beside the view to edit the title, status, priority, assignee, and due date, and read a live comment and activity feed.
- Press **⌘K** (Ctrl+K on Windows) to search tasks by name from anywhere.
- Watch **other people's changes** appear live: cards move, titles change, and a few avatars show who else is viewing.

**What's simulated**

There's no real backend. Everything runs in the browser behind two interfaces, so a real server could replace them later by changing one provider:

- **TaskApi**: a mock API with 200–600 ms latency and a switch that makes about 10% of writes fail, so you can test rollbacks on purpose.
- **RealtimeService**: an RxJS stream that acts like a websocket and pushes "other user" events every few seconds.
- **Seed generator**: creates 200 tasks for normal work, or 50,000 to prove the app holds up at scale.

**Out of scope:** login, a real database, deployment, React, mobile, and pixel-perfect visual design.

## Architecture and the 20M-user story

Every view reads one normalized store through selectors, and every change goes through an action. That one rule is what makes the app hold up as workspaces and teams grow.

&#91;embedded content: TaskBoard architecture · read path left, write path right\]

Components never call the API. They read view models as signals and dispatch actions. Effects do the saving, retrying, and rolling back, and only they touch TaskApi and the real-time stream.

**What "handles 20 million users" means for a frontend**

A browser serves one user, so frontend scale means three things. The honest interview line: _the client is built for the largest single workspace and live collaboration, and it does nothing that stops the backend from scaling out._

| Scale concern               | What TaskBoard does                                               | How you'll show it                                      |
| --------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------- |
| One huge workspace          | Normalized entities, memoized selectors, virtual scroll, paging   | Seed 50,000 tasks; before and after numbers (session 7) |
| Many people editing at once | Optimistic updates, version numbers, rollback, merged live events | Two "users" moving the same card (session 8)            |
| Fast load for every user    | Lazy routes, `@defer`, small bundles, static files on a CDN       | Bundle size and Lighthouse report (session 11)          |
| Backend can scale out       | Stateless API calls behind `TaskApi`; real-time per workspace     | The diagram above, explained in session 12              |

## Stack and setup

Use the latest stable release of everything. Confirm versions on day 1 with `npm view @angular/cli version` rather than trusting this doc.

| Piece                                           | Used for                                     | Posting requirement              |
| ----------------------------------------------- | -------------------------------------------- | -------------------------------- |
| Angular (latest), standalone, zoneless, signals | App, components, routing, forms              | Angular required                 |
| TypeScript, strict mode                         | All code                                     | Strong TypeScript                |
| RxJS                                            | Effects, real-time stream, typeahead         | Strong RxJS                      |
| NgRx Store, Effects, Entity, Router Store       | App state, normalized tasks, URL sync        | NgRx or Redux-style state        |
| Angular CDK                                     | Drag-and-drop, virtual scroll, overlay, a11y | Reusable components, performance |
| Tailwind CSS v4                                 | Styling, theming                             | HTML/CSS, maintainable styling   |
| Vitest                                          | Unit and component tests                     | Unit and integration testing     |
| Playwright                                      | End-to-end tests                             | End-to-end testing               |

**Day-1 setup checklist**

- [x] Create the app with the Angular CLI: standalone, zoneless, strict, routing, SCSS off (plain CSS with Tailwind).
- [x] Install Tailwind v4 by following the official Angular guide on tailwindcss.com: the `tailwindcss` and `@tailwindcss/postcss` packages, a `.postcssrc.json`, and `@import "tailwindcss";` in `styles.css`.
- [x] Install NgRx with `ng add` for store, effects, entity, router-store, and store-devtools.
- [x] Install `@angular/cdk`.
- [x] Confirm Vitest runs with `ng test`, and add Playwright with its init command.
- [x] Commit to a new Git repo so every session is a commit you can show.

**Claude Code setup (review-only)**

- [x] Add `.claude/settings.json` that denies `Edit`, `Write`, `MultiEdit`, and `NotebookEdit`, and allows `ng build`, `ng test`, Playwright, `git diff`, and `git status`.
- [x] Export this doc as Markdown to `docs/build-plan.md`.
- [x] Add `CLAUDE.md`: reviewer and tutor only, never write or edit code or config; markdown in docs/ may be edited when I ask, for example to tick checklist items.; review `git diff` when asked; validate with build and tests; quiz the session's questions at the end; latest Angular, NgRx, Tailwind v4; Angular only.
- [x] Commit at the end of every session as `session-01`, `session-02`, and so on.

## Sessions at a glance

Twelve sessions build the app in order, and two buffer days catch up or run timed drills. CSS gets real time in sessions 1, 2, 4, and 11, not just at the end.

| #     | Build                           | Main concepts                                         | CSS and HTML focus                                             |
| ----- | ------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| 1     | App shell and static board      | Standalone components, signals, @for                  | Semantic layout, Grid vs Flexbox, Tailwind v4 basics           |
| 2     | Task card and column components | Signal inputs/outputs, content projection, TS models  | Component styling, states, focus rings                         |
| 3     | NgRx store for tasks            | Entity adapter, actions, reducer, selectors, effects  | None                                                           |
| 4     | List view over the same store   | Derived selectors, URL and localStorage sync          | Semantic tables, sticky headers                                |
| 5     | Drag-and-drop between columns   | CDK drag-drop, optimistic update, rollback, concatMap | Keyboard alternative, aria-live                                |
| 6     | Task panel and edit form        | Routed panel, typed forms, ControlValueAccessor       | Drawer layout, focus management                                |
| 7     | Scale to 50,000 tasks           | Virtual scroll, profiling, memoization                | content-visibility, layout cost                                |
| 8     | Real-time updates and presence  | RxJS stream, conflicts, reconnect with backoff        | Presence avatars                                               |
| 9     | ⌘K command palette              | Debounced typeahead, switchMap, CDK overlay           | Listbox ARIA, focus trap                                       |
| 10    | Tests                           | Vitest, harnesses, mock store, Playwright             | Testing accessibility                                          |
| 11    | Responsive, theming, a11y audit | Signal-driven theme                                   | Container queries, custom properties, dark mode, cross-browser |
| 12    | System design rehearsal         | The 20M-user story on your own app                    | None                                                           |
| B1–B2 | Buffer and timed drills         | Rebuild from scratch on a clock                       | Board layout from memory                                       |

## Sessions 1–6: from a static board to a working app

### Session 1: App shell and static board

Goal: a page that looks like a board, built with semantic HTML and Tailwind, using hard-coded data in one component.

**Sketch:** a top bar (workspace name, view switcher, search button), a left nav (lists), and a main area with four status columns side by side.

**Data the component needs**

```ts
// BoardPage, hard-coded for now
columns = [
  { status: 'todo', label: 'To do', tasks: [{ id: 't1', title: 'Write release notes' }] },
  { status: 'in_progress', label: 'In progress', tasks: [] },
  // ...in_review, done
];
```

**Build**

1. Do the day-1 setup checklist.
2. Build `AppShell` with `<header>`, `<nav>`, `<main>`, and room for an `<aside>`. Lay out the shell with **CSS Grid** (`grid-template-columns` for nav and main, `grid-template-rows` for header and body).
3. Build `BoardPage` with columns in a horizontal **Flexbox** row that scrolls sideways, each column a vertical flex stack.
4. Render with `@for (col of columns; track col.status)`.
5. Get the full shell working with plain CSS for one rule first, then rewrite it in Tailwind utilities so you know what each class compiles to.

**Concepts:** when Grid vs Flexbox, semantic landmarks, Tailwind v4's CSS-first setup (`@import`, `@theme`), why `track` matters.

**Done when:** the board renders four columns, scrolls sideways on a narrow window, and the page has one `<h1>` and correct landmarks.

**Say it out loud:** Why Grid for the shell but Flexbox for the columns? What does `track` do and what breaks without it?

**Checklist:** h1, h2, a6, a7

### Session 2: Task card and column components

Goal: split the board into reusable presentational components with a clean API, then write the TypeScript models they imply.

**Sketch:** a card showing title, priority badge, assignee initials, and due date. A column with a header (name, count) and a slot for cards.

**Data the component needs**

```ts
// TaskCard only needs this, not the whole Task
type TaskCardVm = {
  id: string;
  title: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  assigneeInitials: string | null;
  dueLabel: string | null; // 'Oct 20', 'Overdue'
};
```

**Build**

1. `TaskCard`: `task = input.required<TaskCardVm>()`, `opened = output<string>()`. Make the card a `<button>` or an `<article>` with a button inside, never a clickable `<div>`.
2. `BoardColumn`: header plus `<ng-content>` for the cards, so the column doesn't know what a card is.
3. Style states with Tailwind: hover, `focus-visible` ring, overdue. Use one shared class pattern for badges.
4. Now write the real models: `Task`, `TaskStatus`, `Priority`, `User`. Use a union type for status and priority.
5. Write a small `toCardVm(task, users)` mapper. Notice the card never sees fields it doesn't use.

**Concepts:** container vs presentational components, signal inputs and outputs, content projection, view models, union types.

**Done when:** the board renders from `Task[]` through `toCardVm`, and every card is reachable with Tab and shows a focus ring.

**Say it out loud:** Why does the card take a view model instead of a `Task`? When would you use `ng-content` vs an `ngTemplateOutlet`?

**Checklist:** c1, c2, c6, a2, t3, t7, h6

### Session 3: NgRx store for tasks

Goal: move tasks into a normalized NgRx store and build the board's columns with a selector.

**Data the component needs**

```ts
// What the store holds (normalized)
tasks: { ids: ['t1', 't2'], entities: { t1: {...}, t2: {...} }, loading: false, error: null }

// What BoardPage reads (derived by a selector)
selectBoardColumns: { status, label, cards: TaskCardVm[] }[]
```

**Build**

1. Draw the nested shape (columns containing tasks) next to the normalized shape. Write down why normalized wins when a task appears in several views.
2. `TaskApi` interface plus `MockTaskApi` with 200–600 ms latency.
3. `TasksActions` with `createActionGroup`: load, loadSuccess, loadFailure.
4. Reducer with `createEntityAdapter<Task>()`.
5. Effect: load tasks with `switchMap`, and `catchError` inside the inner stream.
6. Selectors: `selectAllTasks`, then `selectBoardColumns` composed from it. Swap `BoardPage` to `store.selectSignal(selectBoardColumns)`.

**Concepts:** normalization, entity adapter, memoized selectors, effects, why `catchError` goes inside `switchMap`.

**Done when:** the board loads from the store with a loading state, and Redux DevTools shows the actions.

**Say it out loud:** Why normalize? What happens to the effect if `catchError` sits outside `switchMap`? How does `createSelector` avoid recomputing?

**Checklist:** n1, n3, n4, n5, r1, r6, j7

### Session 4: List view over the same store

Goal: a second view of the same tasks, with filters and sort that live in the URL and remembered preferences.

**Sketch:** a table with columns Title, Status, Priority, Assignee, Due. A filter bar above it with status chips and an assignee dropdown.

**Data the component needs**

```ts
type ListQuery = {
  status: TaskStatus[];
  assignee: string | null;
  sort: 'due' | 'priority' | 'title';
  dir: 'asc' | 'desc';
};
// ListPage reads: rows: TaskRowVm[], query: ListQuery
```

**Build**

1. `ListPage` with a real `<table>`: `<thead>`, `<th scope="col">`, a sticky header inside a scroll container.
2. Sort by clicking a header; show sort direction with `aria-sort`.
3. Read the query from the URL with Router Store selectors. Update it with `router.navigate` and `queryParamsHandling: 'merge'`.
4. `selectFilteredRows` combines tasks with the query. The board and the list now share one store.
5. Remember the last view (board or list) with a meta-reducer that writes to localStorage.

**Concepts:** derived state, URL as state, meta-reducers, semantic tables.

**Done when:** a copied URL reopens the same filters, switching views keeps the data, and refresh remembers the last view.

**Say it out loud:** Your loanDepot story: preserving loan-officer context and attribution with NgRx across navigation. What belongs in the URL vs the store vs localStorage?

**Checklist:** n7, n9, h2, j8, r5, a9

### Session 5: Drag-and-drop with optimistic updates

Goal: move a card between columns instantly, save in the background, and roll back cleanly when the save fails.

**Data the component needs**

```ts
// Dropping a card produces one action
moveTask({ id: 't1', from: 'todo', to: 'in_progress', index: 0 });
// Failure needs what to restore
moveTaskFailure({ id: 't1', previousStatus: 'todo', previousIndex: 2 });
```

**Build**

1. Add CDK `cdkDropListGroup`, `cdkDropList` per column, `cdkDrag` per card.
2. On drop, dispatch `moveTask`. The reducer updates status right away (optimistic).
3. The effect calls the API with `concatMap`, so two quick moves save in order.
4. Turn on the 10% failure switch. On failure, dispatch `moveTaskFailure` and restore the previous status and position.
5. Keyboard alternative: a "Move to" menu on each card, plus an `aria-live` message such as "Moved to In progress".

**Concepts:** optimistic UI, rollback, ordering with `concatMap` vs `mergeMap`, accessible drag-and-drop.

**Done when:** drags feel instant, failures snap back with a message, and you can move a card using only the keyboard.

**Say it out loud:** Why `concatMap` here and `switchMap` for loading? What if two people move the same card at once?

**Checklist:** n6, c5, h7, r1, k3

### Session 6: Task panel and edit form

Goal: open a task in a side panel from either view, edit it with a typed form, and manage focus correctly.

**Data the component needs**

```ts
// Route: /board/task/:taskId (panel renders over the current view)
type TaskForm = {
  title: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string | null;
  due: string | null;
};
```

**Build**

1. A child route renders `TaskPanel` in the `<aside>`. Read `taskId` with component input binding.
2. Typed reactive form, `nonNullable` controls, validation on the title.
3. A `StatusPicker` component that works with `formControlName` by implementing **ControlValueAccessor**.
4. Save dispatches `updateTask`, which is optimistic with rollback like session 5.
5. Focus: move focus into the panel on open, return it to the card on close, close on Escape.

**Concepts:** routed panels, typed forms, ControlValueAccessor, focus management.

**Done when:** you can open, edit, save, and close a task with the keyboard only, and the URL opens the panel directly.

**Say it out loud:** What does ControlValueAccessor give you that an input/output pair doesn't? Where does focus go when the panel closes, and why?

**Checklist:** c3, a10, h7

## Sessions 7–12: scale, real-time, tests, and the story

### Session 7: Scale to 50,000 tasks

Goal: prove the app stays fast with a very large workspace, and measure it instead of guessing.

**Data the component needs**

```ts
// Seed: generateTasks(50_000) → Task[]
// ListPage still reads rows: TaskRowVm[], but only ~30 render at once
```

**Build**

1. Seed 50,000 tasks. Record a baseline in the DevTools Performance panel: load time, scroll frame rate, time to filter.
2. Add CDK virtual scroll to the list view. Record again and compare.
3. Profile with Angular DevTools. Confirm selectors aren't recomputing on unrelated actions.
4. Board view: cap each column with "Show more" or virtualize per column. Try `content-visibility: auto` on cards and measure.
5. Write the before and after numbers into your notes. These are your interview numbers.

**Concepts:** virtual scrolling, memoized selectors, why zoneless and signals cut wasted renders, layout and paint cost.

**Done when:** scrolling 50,000 rows stays smooth and you have measured before and after numbers.

**Say it out loud:** A user says the board is slow with 50,000 tasks. Walk through how you find the cause. Then tell your 20s to 1.3s LCP story.

**Checklist:** f1, f2, f5, a5

### Session 8: Real-time updates and presence

Goal: other people's changes appear live, conflicts resolve predictably, and the app survives a dropped connection.

**Data the component needs**

```ts
type RealtimeEvent =
  | { type: 'task.updated'; task: Task; version: number; by: string }
  | { type: 'task.deleted'; id: string; by: string }
  | { type: 'presence'; users: { id: string; initials: string; viewing: string }[] };
```

**Build**

1. `RealtimeService` exposes `events$`, an RxJS stream that emits random events every 2–5 seconds.
2. An effect maps events to store actions. Each `Task` gets a `version` number.
3. Conflict rule: apply an incoming change only if its version is newer. If it hits a task you're editing, show "Updated by Sam" instead of overwriting your form.
4. Make the stream fail sometimes. Reconnect with `retry` and exponential backoff, then reload changed tasks.
5. Show presence avatars in the top bar.

**Concepts:** discriminated unions for events, merging streams into state, versioning, reconnect strategy, `toSignal` for presence.

**Done when:** cards move by themselves, your open edit isn't overwritten, and the app recovers after the stream errors.

**Say it out loud:** How would this work with a real websocket for a 10,000-person company? What happens to updates sent while a user was offline?

**Checklist:** r8, r9, d2, d3, t3

### Session 9: ⌘K command palette

Goal: a keyboard-first search that cancels stale requests and meets ARIA patterns.

**Data the component needs**

```ts
type SearchResult = {
  id: string;
  title: string;
  status: TaskStatus;
  match: [start: number, end: number];
};
// Palette state: query: string, results: SearchResult[], activeIndex: number, loading: boolean
```

**Build**

1. CDK Overlay opens a dialog on ⌘K or Ctrl+K.
2. Search input: `debounceTime(200)`, `distinctUntilChanged`, `switchMap` to `TaskApi.search`, `catchError` inside.
3. Results as an ARIA listbox: `role="combobox"`, `aria-activedescendant`, arrow keys move, Enter opens the task.
4. Trap focus inside, close on Escape, return focus to where it was.
5. Highlight the matched text with the `match` range.

**Concepts:** typeahead pattern, cancellation, overlay, combobox and listbox ARIA, focus trap.

**Done when:** fast typing only shows results for the last query, and the palette works without a mouse.

**Say it out loud:** Why `switchMap` and not `mergeMap` here? How would search work across tasks, docs, and people at ClickUp's scale?

**Checklist:** j1, r2, d7, k1, k5, h6

### Session 10: Tests

Goal: a testing strategy you can explain, with real tests at each level.

**Build**

1. Vitest: reducer tests (move, rollback), selector tests (`selectBoardColumns`, `selectFilteredRows`).
2. Effect test with `provideMockActions`: success, failure, and rollback.
3. Component test for `TaskCard` with signal inputs, and `BoardPage` with `provideMockStore`.
4. Use a CDK component harness for the status picker.
5. Playwright: open the board, drag a card, check it moved, then check the URL-filter flow. Add an automated accessibility check with axe.

**Concepts:** test pyramid, what to mock at each level, avoiding flaky E2E tests, harnesses.

**Done when:** `ng test` and the Playwright suite both pass, and you can explain why each test sits at its level.

**Say it out loud:** What would you test for a drag-and-drop board, and at which level? Tell the pixel-diff gate story.

**Checklist:** q1, q2, q3, q5, q6, q7, n10

### Session 11: Responsive, theming, and an a11y audit

Goal: the CSS deep dive. The app works on a phone, has dark mode, and passes an accessibility audit.

**Build**

1. Container queries: cards switch from a full layout to a compact one based on column width, not screen width.
2. Responsive shell: the nav collapses to a menu under 768 px; the board scrolls; the panel becomes full screen.
3. Theme tokens as CSS custom properties in Tailwind v4's `@theme`, plus a dark mode toggle stored in a signal.
4. Run Lighthouse and axe. Fix contrast, labels, and heading order.
5. Check in Chrome, Firefox, and Safari (or WebKit through Playwright). Note any differences.

**Concepts:** container vs media queries, custom properties, specificity and view encapsulation, WCAG AA contrast, cross-browser checks.

**Done when:** the app works at 375 px, both themes pass contrast checks, and the axe report is clean.

**Say it out loud:** When do you use a container query instead of a media query? How did you keep loanDepot sites WCAG compliant?

**Checklist:** h3, h4, h5, h8, h9

### Session 12: System design rehearsal

Goal: present your own app as the answer to "Design ClickUp's multi-view task system" in 45 minutes, out loud.

**Do**

1. 5 minutes: ask clarifying questions (workspace size, real-time needs, offline, devices).
2. 30 minutes: draw the architecture from the diagram in this doc, from memory. Walk through data flow, normalization, real-time, and optimistic updates.
3. 10 minutes: tradeoffs and scale. Use your session 7 numbers.
4. Record it, watch it back, and note one thing to tighten.

**Checklist:** d1, d4, d5, d6, k8

## Buffer days and timed drills

Use the two buffer days to catch up first. If you're on schedule, run these drills from a blank project, 45 minutes each, out loud, with no AI and no looking at your TaskBoard code.

- [ ] Kanban column with add, edit, and delete (k2)
- [ ] Sortable, filterable table (k4)
- [ ] Fix three bugs in a broken reducer (k6)
- [ ] Read 100 lines of unfamiliar Angular and list what you'd change (k7)
- [ ] Write debounce, throttle, and `Promise.all` from scratch (j1, j2)
- [ ] Lay out the app shell and board from memory with Grid and Flexbox (h1)

**Interview lines to have ready**

- "I built a ClickUp-style board to prepare: one normalized NgRx store behind a board and a list, optimistic drag-and-drop with rollback, and a simulated real-time stream with versioned conflict handling."
- "At 50,000 tasks, virtual scroll took the list from \[your before number\] to \[your after number\]." Fill in your session 7 numbers.
- "The data layer sits behind a `TaskApi` interface, so swapping the mock for a real backend is one provider change."
