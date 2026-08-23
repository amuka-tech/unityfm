const fs = require('fs');

const liveBlogActions = `
// ==========================================
// LIVE BLOG ACTIONS
// ==========================================

export async function getLiveBlogsDb() {
  const db = getDb();
  const blogs = db.prepare('SELECT * FROM live_blogs ORDER BY is_active DESC, created_at DESC').all();
  return blogs;
}

export async function getLiveBlogUpdatesDb(blogId: number) {
  const db = getDb();
  return db.prepare('SELECT * FROM live_blog_updates WHERE live_blog_id = ? ORDER BY published_at DESC').all(blogId);
}

export async function createLiveBlogDb(title: string, summary: string, location: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const db = getDb();
  const result = db.prepare(\`
    INSERT INTO live_blogs (title, summary, event_location, is_active)
    VALUES (?, ?, ?, 1)
  \`).run(title, summary, location);

  return result.lastInsertRowid;
}

export async function toggleLiveBlogStatusDb(blogId: number, isActive: boolean) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const db = getDb();
  db.prepare('UPDATE live_blogs SET is_active = ? WHERE id = ?').run(isActive ? 1 : 0, blogId);
  return true;
}

export async function addLiveBlogUpdateDb(blogId: number, content: string, isKeyEvent: boolean) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const db = getDb();
  const result = db.prepare(\`
    INSERT INTO live_blog_updates (live_blog_id, author_name, author_role, content, is_key_event)
    VALUES (?, ?, ?, ?, ?)
  \`).run(blogId, session.name, session.designation || session.role, content, isKeyEvent ? 1 : 0);

  return db.prepare('SELECT * FROM live_blog_updates WHERE id = ?').get(result.lastInsertRowid);
}

export async function deleteLiveBlogUpdateDb(updateId: number) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const db = getDb();
  db.prepare('DELETE FROM live_blog_updates WHERE id = ?').run(updateId);
  return true;
}

export async function updateLiveBlogUpdateDb(updateId: number, content: string, isKeyEvent: boolean) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const db = getDb();
  db.prepare('UPDATE live_blog_updates SET content = ?, is_key_event = ? WHERE id = ?').run(content, isKeyEvent ? 1 : 0, updateId);
  return true;
}
`;

fs.appendFileSync('d:/Unitytvsite/src/lib/server-actions.ts', liveBlogActions);
console.log('Added live blog actions');
