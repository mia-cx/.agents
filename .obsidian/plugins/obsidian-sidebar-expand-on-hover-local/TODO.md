# Sidebar Expand on Hover (Local fork) — TODO

When forking the upstream plugin, work through this list to re-apply our changes.

---

## Done (re-implement in fork)

### Right-side ribbon support

- [ ] **Ribbon on right:** If CSS snippet moves ribbon to the right (detect via `getComputedStyle(leftRibbon.containerEl).order === '999'`), ribbon hover should expand the **right** sidebar (not left). Double-click on left ribbon toggles **right** pin when snippet is active.
- [ ] **Right sidebar toggle:** In rootSplit logic, use the same “ribbon on right” check so behaviour is consistent.

### Edge strip (secondary trigger)

- [ ] **Configurable edge strip:** Invisible hover region (no DOM element, coordinate-based). Default: **right** edge → expand right sidebar. When “ribbon on right” snippet is active: **left** edge → expand left sidebar.
- [ ] **Setting:** “Edge strip width” (px), 1–100, default 8. Description explains left/right flip when snippet is active.
- [ ] **Focus/modal:** Only react to edge strip when `document.hasFocus()` and no `.modal-bg` (e.g. Settings closed).

### Collapse behaviour

- [ ] **No document leave:** Do **not** collapse on `document.mouseleave` / `document.mouseout`. Collapse only when pointer **enters** main content (rootSplit). This avoids spurious collapse over tab-header margins and when leaving viewport from left/right.
- [ ] **rootSplit enter:** On rootSplit container `mouseenter`, collapse both sidebars **unless** the element under the cursor (via `elementFromPoint`) is inside a sidedock or `.workspace-tab-header-container`. Use actual sidebar container refs (`leftSidebar.contains(el)` / `rightSidebar.contains(el)`) for “hover” detection, not only DOM classes.
- [ ] **Tab header:** Never collapse when the pointer is over `.workspace-tab-header-container` (icons + padding).

### Collapse delay

- [ ] **Setting:** “Collapse delay (ms)”, default 300, range 0–3000. 0 = instant collapse.
- [ ] **Delayed collapse:** When rootSplit would collapse, start a timeout. If user moves cursor back into **either** sidebar before the delay, cancel the timeout (no collapse). Use `mouseenter` on `leftSidebar` and `rightSidebar` to clear the timeout.

### Debug mode

- [ ] **Setting:** “Debug mode” toggle. When on: disable all expand/collapse; log to console.
- [ ] **Logs:** For relevant events (document mouseover/mouseout, rootSplit mouseenter, ribbon mouseenter, edge strip enter/leave, resize handle), log `eventName`, `target` (short descriptor: tag + id + classes), and `sidedockHover`: `'left' | 'right' | null` from `elementFromPoint(clientX, clientY)` + sidebar container `.contains()`. Handle `#document` in `describeEl` (not `[object HTMLDocument]`).

### Focus

- [ ] **Window focus:** Only trigger expand on ribbon hover when `document.hasFocus()`. Skip edge-strip logic when no focus or modal open.

---

## To do (suggested)

### Manual sidebar open → keep open

- [ ] **Hook into manual open:** When the user opens a sidebar by clicking the ribbon/toggle icon or using a keybind, treat it as “user wants it open” and keep it open (e.g. cancel collapse timeout and/or temporarily treat as pinned).
- [ ] **Research:** Check Obsidian API for workspace/sidebar events, e.g. `workspace.on('layout-change')`, or `leftSplit`/`rightSplit` expand/collapse lifecycle. Implement listener that clears collapse timeout or sets a short “user-opened” flag so we don’t auto-collapse immediately after a manual open.

---

## Reference: upstream

- Original: [Sidebar Expand on Hover](https://github.com/toiq/obsidian-sidebar-expand-on-hover) (toiq).
- This fork is local-only (no upstream remote) so Obsidian doesn’t auto-update it.
