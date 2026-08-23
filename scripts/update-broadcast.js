const Database = require('better-sqlite3');
const db = new Database('unitytv.sqlite');

try { db.exec('ALTER TABLE broadcast_state ADD COLUMN now_playing_start_time TEXT DEFAULT "06:00"'); } catch (e) {}
try { db.exec('ALTER TABLE broadcast_state ADD COLUMN now_playing_end_time TEXT DEFAULT "09:00"'); } catch (e) {}
try { db.exec('ALTER TABLE broadcast_state ADD COLUMN up_next_title TEXT DEFAULT "Lango Agro Focus & Commodity Ticker"'); } catch (e) {}
try { db.exec('ALTER TABLE broadcast_state ADD COLUMN up_next_time TEXT DEFAULT "09:00 - 10:30"'); } catch (e) {}
try { db.exec('ALTER TABLE broadcast_state ADD COLUMN up_next_presenter TEXT DEFAULT "Denis Ogwang"'); } catch (e) {}

db.prepare(`
  UPDATE broadcast_state SET
    now_playing_title = 'Lango Evening News & Agribusiness Pulse',
    now_playing_presenter = 'Sarah Awor & Moses Okello',
    now_playing_start_time = '06:00',
    now_playing_end_time = '09:00'
  WHERE id = 1
`).run();

const row = db.prepare('SELECT * FROM broadcast_state WHERE id = 1').get();
console.log('UPDATED RECORD IN UNITYTV.SQLITE:');
console.log('Now Playing:', row.now_playing_title);
console.log('Anchor:', row.now_playing_presenter, '(' + row.now_playing_start_time + ' - ' + row.now_playing_end_time + ')');
