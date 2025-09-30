import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole, UserStatus } from '@/models';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  providerId?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function formatTime(timeString?: string): string {
  if (!timeString) return '';
  
  // Handle HHMM or HH:MM format
  let cleaned = timeString.replace(/[^\d]/g, '');
  
  if (cleaned.length === 4) {
    return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
  } else if (cleaned.length === 3) {
    return `0${cleaned.slice(0, 1)}:${cleaned.slice(1, 3)}`;
  }
  
  return timeString;
}

export function validateTimeOrder(start?: string, end?: string): boolean {
  if (!start || !end) return true;
  
  const startTime = new Date(`2024-01-01T${formatTime(start)}:00`);
  const endTime = new Date(`2024-01-01T${formatTime(end)}:00`);
  
  return startTime < endTime;
}

export function isAdmin(user: { role: UserRole }): boolean {
  return user.role === 'Admin';
}

export function isActive(user: { status: UserStatus }): boolean {
  return user.status === 'Active';
}