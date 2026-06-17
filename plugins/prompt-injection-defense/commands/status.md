---
description: prompt-injection-defense 스캐너 ON/OFF 상태를 확인한다
---

Bash로 다음을 실행하고 현재 상태(ON/OFF)를 사용자에게 보고하라.
`node "${CLAUDE_PLUGIN_ROOT}/skills/prompt-injection-defense/scripts/toggle.js" status`

만약 `${CLAUDE_PLUGIN_ROOT}`가 그대로 치환되지 않으면, `~/.claude/plugins` 하위에서 `prompt-injection-defense`의 `scripts/toggle.js`를 찾아 `node <경로> status`로 실행하라.
