---
description: prompt-injection-defense 인젝션 스캐너를 끈다(OFF)
---

Bash로 다음을 실행하고 결과 한 줄을 사용자에게 보고하라. 끈 뒤에는 외부 콘텐츠 스캔이 비활성이라는 점을 한 줄로 덧붙여 경고하라.
`node "${CLAUDE_PLUGIN_ROOT}/skills/prompt-injection-defense/scripts/toggle.js" off`

만약 `${CLAUDE_PLUGIN_ROOT}`가 그대로 치환되지 않으면, `~/.claude/plugins` 하위에서 `prompt-injection-defense`의 `scripts/toggle.js`를 찾아 `node <경로> off`로 실행하라.
