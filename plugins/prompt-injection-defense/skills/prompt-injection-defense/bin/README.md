# codex-guard — Codex CLI 단독 실행 인젝션 방어 래퍼

`codex` 대신 호출하면 프롬프트를 prompt-injection-defense 스캐너(scan.js의 공유 로직)로 검사한 뒤
안전할 때만 `codex exec`로 전달한다. 같은 `config.json`을 공유하므로 ON/OFF 토글·민감도·마스터키가 그대로 적용된다.

## 사용
- 직접: `node <이 폴더>/codex-guard.js "<프롬프트>" [codex exec 옵션...]`
- Windows shim: `codex-guard.cmd "<프롬프트>"`
- 파이프 입력도 검사에 포함: `cat note.md | node codex-guard.js "요약해줘"`
- 테스트용: `--dry-run` (판정만, codex 미실행)

## PowerShell 별칭(권장 — `codex` 입력을 자동으로 가드)
`$PROFILE`에 추가:
```powershell
function codex { node "C:\Users\djpark26\.claude\plugins\prompt-injection-defense\plugins\prompt-injection-defense\skills\prompt-injection-defense\bin\codex-guard.js" @args }
```
(설치본 경로는 `~/.claude/plugins/cache/...` 아래일 수 있으니 실제 경로로 조정.)

## 등급별 동작
- 상(high): 차단(codex 미실행, exit 2)
- 중(medium): 경고 후 진행
- 하/clean: 그대로 진행
- OFF(`config.enabled=false`) 또는 `PID_MASTER_KEY` 오버라이드: 차단 안 함(감사 기록)

## 한계
- 검사 대상은 "실행 시점의 프롬프트(+파이프 입력)"다. Codex 세션 도중 읽는 파일·웹 출력은
  대상이 아니다(그 수준은 Codex 네이티브 훅 연동이 필요 — 후속 과제).
