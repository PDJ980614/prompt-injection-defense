// 마스터 오버라이드 키를 해시로 config.json에 등록하는 헬퍼 (공개·감사형 관리자 키)
//
// 사용: node scripts/set-master-key.js "<원하는-키-문자열>"
//   → 키의 sha256 해시를 config.masterKeyHash에 저장하고 overrideEnabled를 true로 켠다.
//   원본 키는 저장하지 않는다. 우회 시에는 env PID_MASTER_KEY에 같은 키를 넣어 실행.
//   끄려면: node scripts/set-master-key.js --disable

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CONFIG_PATH = path.resolve(__dirname, '..', 'config.json');

function load() {
  try { return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); }
  catch { return { sensitivity: 'medium', trustedDomains: [], overrideEnabled: false, masterKeyHash: null }; }
}
function save(cfg) { fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2) + '\n'); }

const arg = process.argv[2];
const cfg = load();

if (arg === '--disable') {
  cfg.overrideEnabled = false;
  save(cfg);
  console.log('마스터 오버라이드를 비활성화했습니다 (masterKeyHash는 유지).');
  process.exit(0);
}
if (!arg) {
  console.error('사용법: node scripts/set-master-key.js "<키 문자열>"  또는  --disable');
  process.exit(1);
}

cfg.masterKeyHash = crypto.createHash('sha256').update(arg, 'utf8').digest('hex');
cfg.overrideEnabled = true;
save(cfg);
console.log('마스터 키를 등록하고 오버라이드를 활성화했습니다.');
console.log('우회하려면 해당 세션 환경변수에 PID_MASTER_KEY를 같은 값으로 설정하세요.');
console.log('주의: 발동 시마다 audit.log에 기록됩니다 (숨김 동작 없음).');
