'use server';

import { cookies } from 'next/headers';
import crypto from 'crypto';
import { User, Role, Permission, ROLE_PERMISSIONS, UserRole } from '@/types';
import { supabase } from './supabase';
import { logAudit } from './audit';

const AUTH_SECRET = process.env.AUTH_SECRET || 'fallback-secret-key-at-least-32-chars-long';
const COOKIE_NAME = 'unity_session';

export interface SessionData {
  id: number;
  name: string;
  email: string;
  role: Role;
  bureau: string;
  designation: string;
  avatar_url: string;
  iat: number;
  exp: number;
}

function hashPassword(password: string) {
  const salt = 'radio-unity-uganda-salt';
  return crypto.scryptSync(password, salt, 32).toString('hex');
}

function signPayload(payload: string): string {
  return crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
}

export async function loginServerAction(email: string, pass: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single();
    
    if (error || !user) {
      return { success: false, error: 'Invalid staff email or authorization passcode.' };
    }
    
    const hashedInput = hashPassword(pass);
    if (user.password_hash !== hashedInput) {
      await logAudit(normalizedEmail, user.role, 'LOGIN_FAILED', 'Invalid password');
      return { success: false, error: 'Invalid staff email or authorization passcode.' };
    }

    const now = Math.floor(Date.now() / 1000);
    const sessionId = crypto.randomUUID();
    
    // Create session in DB
    await supabase.from('sessions').insert({
      id: sessionId,
      user_id: user.id,
      expires_at: now + 60 * 60 * 24 * 7
    });

    const session: SessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bureau: user.bureau,
      designation: user.designation,
      avatar_url: user.avatar_url,
      iat: now,
      exp: now + 60 * 60 * 24 * 7,
    };

    const payloadString = JSON.stringify({ ...session, sessionId });
    const base64Payload = Buffer.from(payloadString).toString('base64url');
    const signature = signPayload(base64Payload);
    const token = `${base64Payload}.${signature}`;

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    await logAudit(user.email, user.role, 'LOGIN_SUCCESS', 'User logged in successfully');

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bureau: user.bureau,
        designation: user.designation,
        avatar_url: user.avatar_url,
      },
    };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Internal server error during login.' };
  }
}

export async function switchRoleAction(newRole: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession();
    if (!session) return { success: false, error: 'Not authenticated' };

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.id)
      .single();

    if (error || !user || !user.can_impersonate) {
      return { success: false, error: 'You do not have permission to switch roles.' };
    }

    // Just update the session token cookie with the new role
    const now = Math.floor(Date.now() / 1000);
    const newSession: SessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: newRole as Role,
      bureau: user.bureau,
      designation: user.designation,
      avatar_url: user.avatar_url,
      iat: now,
      exp: now + 60 * 60 * 24 * 7,
    };

    const payloadString = JSON.stringify(newSession);
    const base64Payload = Buffer.from(payloadString).toString('base64url');
    const signature = signPayload(base64Payload);
    const token = `${base64Payload}.${signature}`;

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    await logAudit(user.email, newRole, 'ROLE_SWITCH', `Switched to ${newRole}`);

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Error switching roles' };
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  const session = await getServerSession();
  if (!session) return false;

  const { data: user, error } = await supabase
    .from('users')
    .select('password_hash')
    .eq('id', session.id)
    .single();

  if (error || !user) return false;

  const hashedInput = hashPassword(password);
  return user.password_hash === hashedInput;
}

export async function logoutServerAction(): Promise<boolean> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return true;
}

export async function getServerSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const [base64Payload, signature] = token.split('.');
    if (!base64Payload || !signature) return null;

    const expectedSig = signPayload(base64Payload);
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payloadJson = Buffer.from(base64Payload, 'base64url').toString('utf8');
    const session: SessionData = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (session.exp < now) {
      return null;
    }

    return {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
      bureau: session.bureau,
      designation: session.designation || 'Editorial Staff',
      avatar_url: session.avatar_url,
    };
  } catch (e) {
    return null;
  }
}

export async function requirePermission(requiredPermission: Permission) {
  const session = await getServerSession();
  if (!session) {
    throw new Error('UNAUTHORIZED: No active session');
  }

  const userPermissions = ROLE_PERMISSIONS[session.role as UserRole];
  if (!userPermissions || !userPermissions.includes(requiredPermission)) {
    console.warn(`[SECURITY] Role '${session.role}' attempted '${requiredPermission}' without authorization.`);
    throw new Error('FORBIDDEN: Insufficient privileges');
  }

  return session;
}
