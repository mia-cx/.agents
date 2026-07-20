---
title: "Build a Splice Studio Replacement for Vesta"
constraints: quick
mode: structured
---

## Context

Splice Studio — the desktop DAW-adjacent sample management, cloud sync, and plugin management tool — shut down and left the market. Producers who relied on it for sample library management, cloud backup of projects, and rent-to-own plugin access are now fragmented across ad-hoc workflows (manual folder management, Dropbox, etc.). From community sentiment on Reddit, Twitter/X, and producer forums, the gap is deeply felt — especially the unified "one app to manage your entire production toolkit" experience.

Vesta is positioned to capture this market. Our existing infrastructure and user base give us a foundation, but this would be a significant new product surface.

## Decision Required

Should Vesta build a Splice Studio replacement as a new product vertical? If yes, what scope should V1 target, and what's the go-to-market approach?

## Constraints

- **Engineering capacity**: Current team is 8 engineers. This would compete with existing roadmap items.
- **Timeline pressure**: The market gap is open now, but competitors (Loopcloud, LANDR, Plugin Boutique) are likely evaluating the same opportunity. Window is estimated at 6-9 months before someone fills it.
- **Budget**: $200K maximum for V1 development (6 months of a 3-person squad + infrastructure).
- **Technical**: Must work cross-platform (macOS + Windows). Plugin scanning and DAW integration are non-trivial.
- **Licensing**: Rent-to-own plugin model requires partnerships with plugin developers (iZotope, Arturia, FabFilter, etc.) — long lead time.

## Options Considered

1. **Full Splice Studio clone** — Sample management + cloud sync + rent-to-own plugins. High fidelity replacement. ~12 months, ~$500K.
2. **Sample management + cloud sync only** — Skip the plugin marketplace entirely. Ship in 4-5 months. ~$150K. Add plugins later if traction proves out.
3. **Cloud-first project backup** — Narrowest scope. DAW project backup/sync with sample dependency tracking. Ship in 2-3 months. ~$80K. Differentiator: no one does this well.
4. **Acquisition play** — Buy an existing sample management tool and integrate. Unknown cost, faster to market potentially.
5. **Don't build** — Focus on core Vesta roadmap. Let the market settle and reassess in 6 months.

## Success Criteria

- **Adoption**: 10K active users within 6 months of launch (Splice had ~4M at peak, so this is ~0.25%).
- **Revenue**: $50K MRR within 9 months (subscription model at $7.99-14.99/mo).
- **Retention**: 60%+ month-3 retention (indicates real utility, not just curiosity).
- **Strategic**: Establishes Vesta as the "producer's operating system" — a positioning moat.

## Additional Context

- Splice Studio was estimated at $30M+ ARR before shutdown. The total addressable market for music production tools is ~$1.5B.
- Key Splice Studio features users miss most (based on community analysis): (1) automatic sample library organization, (2) cloud backup of DAW projects, (3) rent-to-own plugins, (4) version history for projects.
- Our existing users have been requesting sample management features organically — 47 feature requests in the last quarter.
- Loopcloud focuses on samples-as-a-service (subscription sample packs) — different model than what Splice Studio did.
- Plugin Boutique has a desktop app but it's purchase-only, no rent-to-own or cloud sync.
