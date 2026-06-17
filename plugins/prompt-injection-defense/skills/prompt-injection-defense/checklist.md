# 체크리스트 — prompt-injection-defense 스킬

- [x] 아키텍처 확정 (UserPromptSubmit + PostToolUse 훅 + 2차 방어 스킬, 등급별 차등)
- [x] 마스터 오버라이드 방식 확정 (비밀 백도어 X → 공개·감사되는 관리자 키)
- [x] 1차 스캐너 스크립트 작성 (scripts/scan.js, 결정론적 시그니처 + 구조 신호)
- [x] 튜닝 설정 파일 (config.json: 민감도/신뢰 도메인/마스터키 해시/오버라이드 토글)
- [x] 마스터키 등록 헬퍼 (scripts/set-master-key.js)
- [x] 2차 방어 스킬 본문 (SKILL.md)
- [x] 훅 등록 스니펫 (settings-hooks.json) + 활성화 안내
- [x] 테스트 코퍼스 + 러너 (tests/corpus.json, tests/run.js)
- [x] 테스트 실행해서 오탐/미탐 확인 (7/7 pass, exfil 갭 버그 수정)
- [x] README (사용법 + 오버라이드 운영 절차)

## 남은 수동 단계 (사용자)
- [ ] settings-hooks.json을 ~/.claude/settings.json에 병합해 1차 훅 활성화
- [ ] (선택) node scripts/set-master-key.js "<키>" 로 마스터 오버라이드 등록
