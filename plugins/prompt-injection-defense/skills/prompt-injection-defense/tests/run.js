// 코퍼스를 scan.js에 실제로 통과시켜 등급별 출력(block/context/silent)을 검증하는 테스트 러너
//
// 사용: node tests/run.js   (스킬 루트 또는 어디서든 실행 가능)

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SCAN = path.resolve(__dirname, '..', 'scripts', 'scan.js');
const corpus = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'corpus.json'), 'utf8'));

function outcomeOf(stdout) {
  const out = (stdout || '').trim();
  if (!out) return 'silent';
  let obj;
  try { obj = JSON.parse(out); } catch { return 'silent'; }
  if (obj.decision === 'block') return 'block';
  if (obj.hookSpecificOutput && obj.hookSpecificOutput.additionalContext) return 'context';
  return 'silent';
}

let pass = 0, fail = 0;
for (const c of corpus) {
  const res = spawnSync('node', [SCAN], { input: JSON.stringify(c.payload), encoding: 'utf8' });
  const got = outcomeOf(res.stdout);
  const ok = got === c.expect;
  if (ok) { pass++; console.log(`  PASS  [${c.expect}] ${c.name}`); }
  else { fail++; console.log(`  FAIL  expected=${c.expect} got=${got}  ${c.name}\n        stdout=${(res.stdout || '').trim()}`); }
}

console.log(`\n결과: ${pass} pass, ${fail} fail (총 ${corpus.length})`);
process.exit(fail ? 1 : 0);
