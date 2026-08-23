const http = require('http');
const querystring = require('querystring');

function testWebhook(key, expectedStatus) {
  const postData = querystring.stringify({
    name: key,
    addr: '192.168.1.100',
    app: 'live',
    call: 'publish'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth-stream',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`[RTMP TEST] Key: "${key || '<empty>'}" => HTTP Status: ${res.statusCode} (Expected: ${expectedStatus})`);
  });

  req.on('error', (e) => console.error(e));
  req.write(postData);
  req.end();
}

testWebhook('live_utv_lira2026', 200);
setTimeout(() => testWebhook('invalid_hacker_key_999', 403), 300);
setTimeout(() => testWebhook('', 403), 600);
