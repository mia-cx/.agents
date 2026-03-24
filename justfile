# Boardroom — run board meetings from the CLI via Pi

pi_boardroom := "pi -e ~/.pi/agent/extensions/boardroom/index.ts"

default:
    @just --list

# Run a board meeting on a brief
board brief constraints="quick" mode="structured":
    {{pi_boardroom}} -p "Use the board_meeting tool: brief=\"{{brief}}\" constraints=\"{{constraints}}\" mode=\"{{mode}}\""

# Quick board meeting — pick a brief, everything else defaults
board-quick brief:
    {{pi_boardroom}} -p "Use the board_meeting tool: brief=\"{{brief}}\" constraints=\"quick\" mode=\"freeform\""

# Deep dive board meeting
board-deep brief:
    {{pi_boardroom}} -p "Use the board_meeting tool: brief=\"{{brief}}\" constraints=\"deep-dive\" mode=\"structured\""

# List available briefs
briefs:
    @ls -1 boardroom/briefs/*.md | grep -v _template | sed 's|.*/||; s|\.md$||'

# List past meetings
meetings:
    @{{pi_boardroom}} -p "Use the board_meeting tool is not needed. Just run /board-list and show me the results."

# Smoke test: Splice Studio replacement
smoke-splice:
    {{pi_boardroom}} -p "Use the board_meeting tool: brief=\"boardroom/briefs/splice-studio-replacement.md\" constraints=\"quick\" mode=\"structured\""

# Interactive smoke test: Splice Studio replacement
smoke-splice-ui:
    {{pi_boardroom}} "Use the board_meeting tool: brief=\"boardroom/briefs/splice-studio-replacement.md\" constraints=\"quick\" mode=\"structured\""

# Smoke test: Vesta buyout
smoke-buyout:
    {{pi_boardroom}} -p "Use the board_meeting tool: brief=\"boardroom/briefs/vesta-buyout-5m.md\" constraints=\"quick\" mode=\"structured\""

# Interactive smoke test: Vesta buyout
smoke-buyout-ui:
    {{pi_boardroom}} "Use the board_meeting tool: brief=\"boardroom/briefs/vesta-buyout-5m.md\" constraints=\"quick\" mode=\"structured\""
