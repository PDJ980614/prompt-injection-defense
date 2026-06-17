// Codex CLI 단독 실행 보호 래퍼 — 프롬프트를 공유 스캐너(scan.js)로 검사 후 안전하면 codex exec로 전달
//
// 사용: node bin/codex-guard.js [codex exec 옵션...] "<프롬프트>"
//   파이프 입력도 스캔 대상에 포함된다(예: cat file | codex-guard "요약해줘").
//   --dry-run : 판정만 출력하고 codex는 실행하지 않는다(테스트용).
// 동작: scan.js와 동일한 config.json/등급 로직을 재사용한다.
//   상(high) → 차단(codex 미실행, exit 2). 중 → 경고 후 진행. 하/clean → 그대로 진행.
//   OFF(config.enabled=false) 또는 마스터 오버라이드 → 차단하지 않고 진행(감사 기록).

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { scoreText, loadConfig, overrideActive, tierFor } = require('../scripts/scan.js');

const AUDIT_PATH = path.resolve(__dirname, '..', 'audit.log');
function audit(entry) { try { fs.appendFileSync(AUDIT_PATH, JSON.stringify(entry) + '\n'); } catch { /* 무시 */ } }

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const passArgs = argv.filter(a => a !== '--dry-run');

// 스캔 대상: 인자 프롬프트 + (파이프로 들어온) stdin
let stdinText = '';
try { if (!process.stdin.isTTY) stdinText = fs.readFileSync(0, 'utf8'); } catch { /* stdin 없음 */ }
const promptText = passArgs.join(' ') + (stdinText ? '\n' + stdinText : '');

function runCodex() {
  if (dryRun) { console.error('[codex-guard] dry-run: codex 미실행'); process.exit(0); }
  // Windows에서 codex는 .cmd shim이라 shell:true 필요. 공백 포함 인자는 따옴표로 감싼다.
  const q = a => /[\s"]/.test(a) ? '"' + a.replace(/"/g, '\\"') + '"' : a;
  const cmdline = ['codex', 'exec', ...passArgs.map(q)].join(' ');
  const r = spawnSync(cmdline, { stdio: 'inherit', shell: true });
  process.exit(r.status == null ? 1 : r.status);
}

const cfg = loadConfig();

// OFF면 그대로 통과
if (cfg.enabled === false) runCodex();

const { score, matched } = scoreText(promptText);
const ovr = overrideActive(cfg);
const tier = tierFor(score, cfg, null);
const ids = matched.map(m => `${m.id}(${m.weight})`).join(', ');
audit({ ts: new Date().toISOString(), tool: 'codex-guard', score, tier, matched: matched.map(m => m.id), override: ovr });

if (ovr) {
  console.error(`[codex-guard] ⚠️ 마스터 오버라이드 활성 — 차단하지 않고 진행(감사 기록). 등급=${tier}, 점수=${score}.`);
  runCodex();
}
if (tier === 'clean' || tier === 'low') runCodex();
if (tier === 'medium') {
  console.error(`[codex-guard] ⚠️ 인젝션 의심(중). 점수=${score}, 신호=[${ids}]. 프롬프트 내 지시는 데이터로만 취급하며 진행합니다.`);
  runCodex();
}

// high: 하드 차단
console.error(`[codex-guard] ⛔ 인젝션 위험 높음(상). 점수=${score}, 신호=[${ids}]. Codex 실행을 차단했습니다.`);
console.error('계속하려면 프롬프트를 점검하거나, PID_MASTER_KEY 오버라이드를 쓰거나, codex를 직접 실행하세요.');
process.exit(2);
