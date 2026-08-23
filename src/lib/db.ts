import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';
import { DB_SCHEMA } from './schema';

let dbInstance: any = null;

export function hashPassword(password: string) {
  const salt = 'unity-tv-uganda-salt';
  return crypto.scryptSync(password, salt, 32).toString('hex');
}

export function seedDefaultUsers(db: any) {
  const count = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (count === 0) {
    const password_hash = hashPassword('password123');
    const insert = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, bureau, designation, avatar_url, can_impersonate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const users = [
      ['Denis Okello', 'admin@unitytv.ug', password_hash, 'managing_director', 'Lira City Headquarters', 'Chief Managing Editor & Station Head', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 1],
      ['System Admin', 'sysadmin@unitytv.ug', password_hash, 'super_admin', 'Lira City Hub', 'IT & Security Administrator', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 1],
      ['Sarah Awor', 'editor@unitytv.ug', password_hash, 'news_editor', 'Lango Regional Newsroom', 'Senior News Editor', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 0],
      ['Patrick Okot', 'producer@unitytv.ug', password_hash, 'broadcast_director', 'Master Control Room (MCR)', 'Executive Broadcast Producer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 0],
      ['Moses Elem', 'reporter@unitytv.ug', password_hash, 'field_reporter', 'Dokolo & Otuke Bureau', 'Field Correspondent', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 0],
    ];

    db.transaction(() => {
      for (const u of users) {
        insert.run(...u);
      }
    })();
  }
}

export function getDb() {
  if (!dbInstance) {
    const dbPath = path.join(process.cwd(), 'unitytv.sqlite');
    dbInstance = new Database(dbPath);
    dbInstance.pragma('journal_mode = WAL');

    dbInstance.exec(DB_SCHEMA);
    seedDefaultUsers(dbInstance);
  }
  return dbInstance;
}
