const http = require('http');

const routes = [
  { path: '/', expect: 'Something Extraordinary Is Brewing' },
  { path: '/technex-2k26', expect: 'TECHNEX 2K26' },
  { path: '/contact', expect: 'Get in Touch' },
  { path: '/registration/success', expect: 'S4DS MITAOE' },
  { path: '/about', expect: 'Under Development' },
  { path: '/events', expect: 'Under Development' },
  { path: '/team', expect: 'Under Development' },
  { path: '/gallery', expect: 'Under Development' },
  { path: '/projects', expect: 'Under Development' },
  { path: '/membership', expect: 'Under Development' },
  { path: '/join', expect: 'Under Development' }
];

async function check() {
  let passed = 0;
  for (const r of routes) {
    await new Promise((resolve) => {
      http.get('http://localhost:3000' + r.path, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const okStatus = res.statusCode === 200;
          const okContent = data.includes(r.expect);
          console.log(`${r.path.padEnd(25)} -> Status: ${res.statusCode} | Matches '${r.expect}': ${okContent}`);
          if (okStatus && okContent) passed++;
          resolve();
        });
      }).on('error', (err) => {
        console.error(`Error on ${r.path}:`, err.message);
        resolve();
      });
    });
  }
  console.log(`\nResult: ${passed} / ${routes.length} passed.`);
  process.exit(passed === routes.length ? 0 : 1);
}

check();
