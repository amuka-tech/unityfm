const fs = require('fs');
let content = fs.readFileSync('d:/Unitytvsite/src/lib/server-actions.ts', 'utf8');

content = content.replace('is_live: true,', 'is_live: row.is_live === 0 ? false : true,');

content = content.replace(
  'try { db.exec(\'ALTER TABLE broadcast_state ADD COLUMN now_playing_start_time TEXT DEFAULT "06:00"\'); } catch (e) {}',
  'try { db.exec(\'ALTER TABLE broadcast_state ADD COLUMN is_live INTEGER DEFAULT 1\'); } catch (e) {}\n    try { db.exec(\'ALTER TABLE broadcast_state ADD COLUMN now_playing_start_time TEXT DEFAULT "06:00"\'); } catch (e) {}'
);

content = content.replace(
  'stream_url_youtube = ?, \n        is_emergency_slate = ?,',
  'stream_url_youtube = ?, \n        is_live = ?, \n        is_emergency_slate = ?,'
);

content = content.replace(
  'updated.stream_url_youtube,\n      updated.is_emergency_slate ? 1 : 0,',
  'updated.stream_url_youtube,\n      updated.is_live === false ? 0 : 1,\n      updated.is_emergency_slate ? 1 : 0,'
);

fs.writeFileSync('d:/Unitytvsite/src/lib/server-actions.ts', content, 'utf8');
console.log('Fixed');
