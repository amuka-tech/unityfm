import { supabase } from './supabase';

export async function logAudit(user_email: string, role: string, action: string, details?: string) {
  try {
    const { error } = await supabase.from('audit_logs').insert({
      user_email,
      role,
      action,
      details: details || null
    });
    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (err) {
    console.error('Failed to log audit event', err);
  }
}
