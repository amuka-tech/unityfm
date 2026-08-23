const NodeMediaServer = require('node-media-server');
const http = require('http');
const querystring = require('querystring');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: './media',
  }
};

const nms = new NodeMediaServer(config);

nms.on('prePublish', (session) => {
  const streamPath = session?.streamPath || session?.publishStreamPath || '';
  const streamKey = streamPath.replace('/live/', '').replace('/', '') || '';
  console.log(`[RTMP Server] 🎥 Broadcaster attempting publish on streamPath: "${streamPath}" (Key: "${streamKey}")`);

  // Webhook validation to website backend
  const postData = querystring.stringify({ name: streamKey, addr: session?.ip || '127.0.0.1' });
  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth-stream',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    if (res.statusCode !== 200) {
      console.log(`[RTMP Server] ❌ REJECTED unauthorized stream key: "${streamKey}" (HTTP ${res.statusCode})`);
      try {
        session.reject?.();
        session.close?.();
      } catch (e) {}
    } else {
      console.log(`[RTMP Server] 🟢 AUTHENTICATED & LIVE! Key: "${streamKey}"`);
    }
  });

  req.on('error', (err) => {
    console.error('[RTMP Server] Webhook query error:', err.message);
  });

  req.write(postData);
  req.end();
});

nms.on('donePublish', (session) => {
  const streamPath = session?.streamPath || session?.publishStreamPath || '';
  console.log(`[RTMP Server] ⏹️ Broadcaster disconnected: ${streamPath}`);
});

nms.run();
