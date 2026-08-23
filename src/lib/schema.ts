export const DB_SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    bureau TEXT,
    designation TEXT,
    avatar_url TEXT,
    bio TEXT,
    can_impersonate INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    role TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS live_blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT,
    event_location TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS live_blog_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    live_blog_id INTEGER NOT NULL,
    author_name TEXT NOT NULL,
    author_role TEXT,
    content TEXT NOT NULL,
    is_key_event INTEGER DEFAULT 0,
    published_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (live_blog_id) REFERENCES live_blogs(id) ON DELETE CASCADE
  );
`;
