import { NextRequest } from 'next/server';
import { verifyToken, JWTPayload } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export function getAuthToken(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies as fallback
  const token = request.cookies.get('token')?.value;
  return token || null;
}

export function authenticateRequest(request: NextRequest): JWTPayload | null {
  const token = getAuthToken(request);
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export function requireAuth(request: NextRequest): JWTPayload {
  const user = authenticateRequest(request);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export function requireAdmin(request: NextRequest): JWTPayload {
  const user = requireAuth(request);
  if (user.role !== 'Admin') {
    throw new Error('Admin access required');
  }
  return user;
}

export function requireActive(request: NextRequest): JWTPayload {
  const user = requireAuth(request);
  if (user.status !== 'Active') {
    throw new Error('Active account required');
  }
  return user;
}

// Middleware helper for API routes
export function withAuth(
  handler: (request: NextRequest, user: JWTPayload) => Promise<Response>
) {
  return async (request: NextRequest) => {
    try {
      const user = requireActive(request);
      return await handler(request, user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      return new Response(JSON.stringify({ error: message }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}

export function withAdminAuth(
  handler: (request: NextRequest, user: JWTPayload) => Promise<Response>
) {
  return async (request: NextRequest) => {
    try {
      const user = requireAdmin(request);
      return await handler(request, user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Admin access required';
      const status = message.includes('Admin') ? 403 : 401;
      return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}