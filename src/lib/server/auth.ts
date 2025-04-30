import Database from 'better-sqlite3';
import crypto from 'crypto';
import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';

// Define types
interface User {
  id: string;
  username: string;
  password_hash: string;
  created_at?: string;
  updated_at?: string;
}

interface Session {
  id: string;
  user_id: string;
  expires_at: string;
}

// Initialize database
const db = new Database('auth.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Prepare statements
const getUserByUsername = db.prepare<string, User>('SELECT * FROM users WHERE username = ?');
const getUserById = db.prepare<string, User>('SELECT * FROM users WHERE id = ?');
const createUser = db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)');
const createSession = db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)');
const getSession = db.prepare<string, Session>('SELECT * FROM sessions WHERE id = ?');
const deleteSession = db.prepare('DELETE FROM sessions WHERE id = ?');
const deleteExpiredSessions = db.prepare('DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP');

// Helper functions
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, storedHash] = hashedPassword.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return storedHash === hash;
}

function generateId(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Auth functions
export async function register(username: string, password: string) {
  try {
    const id = generateId();
    const passwordHash = hashPassword(password);
    createUser.run(id, username, passwordHash);
    return { id, username };
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
}

export async function login(username: string, password: string) {
  try {
    const user = getUserByUsername.get(username);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return null;
    }
    
    return { id: user.id, username: user.username };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function createUserSession(userId: string, cookies: Cookies) {
  // Delete expired sessions
  deleteExpiredSessions.run();
  
  // Create session (expires in 7 days)
  const sessionId = generateId();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  createSession.run(sessionId, userId, expiresAt.toISOString());
  
  // Set cookie
  cookies.set('session_id', sessionId, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: !dev,
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
  
  return sessionId;
}

export async function getUserFromSession(cookies: Cookies) {
  const sessionId = cookies.get('session_id');
  if (!sessionId) return null;
  
  try {
    const session = getSession.get(sessionId);
    if (!session) return null;
    
    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      deleteSession.run(sessionId);
      cookies.delete('session_id', { path: '/' });
      return null;
    }
    
    const user = getUserById.get(session.user_id);
    if (!user) return null;
    
    return { id: user.id, username: user.username };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

export async function logout(cookies: Cookies) {
  const sessionId = cookies.get('session_id');
  if (sessionId) {
    deleteSession.run(sessionId);
    cookies.delete('session_id', { path: '/' });
  }
}

// Clean up expired sessions periodically
if (dev) {
  setInterval(() => {
    deleteExpiredSessions.run();
  }, 1000 * 60 * 60); // Every hour
} 