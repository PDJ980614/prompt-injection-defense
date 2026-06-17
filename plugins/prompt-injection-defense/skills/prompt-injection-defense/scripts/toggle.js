// prompt-injection-defense 스캐너 ON/OFF 토글 — config.json의 enabled 플래그를 바꾼다
// 사용: node scripts/toggle.js on|off|status
const fs = require('fs');
const path = require('path');
const CONFIG_PATH = path.resolve(__dirname, '..', 'config.json');

function load() {
  try { return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); }
  catch { return { enabled: true, sensitivity: 'medium', trustedDomains: [], overrideEnabled: false, masterKeyHash: null }; }
}

const arg = (process.argv[2] || 'status').toLowerCase();
const cfg = load();
const cur = cfg.enabled !== false; // 미설정/누락은 ON으로 간주

if (arg === 'status') {
  console.log(`prompt-injection-defense: ${cur ? 'ON (스캔 활성)' : 'OFF (스캔 비활성)'}`);
  process.exit(0);
}
if (arg !== 'on' && arg !== 'off') {
  console.error('사용법: node scripts/toggle.js on|off|status');
  process.exit(1);
}

cfg.enabled = (arg === 'on');
fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2) + '\n');
console.log(`prompt-injection-defense: ${cfg.enabled ? 'ON 으로 켰습니다' : 'OFF 로 껐습니다'}.`);
