import { getDb } from './db';

export function logAudit(user_email: string, role: string, action: string, details?: string) {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO audit_logs (user_email, role, action, details)
      VALUES (?, ?, ?, ?)
    `).run(user_email, role, action, details || null);
  } catch (err) {
    console.error('Failed to log audit event', err);
  }
}
