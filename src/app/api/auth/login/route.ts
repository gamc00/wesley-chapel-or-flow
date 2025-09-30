import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email }).populate('providerId');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is approved
    if (user.status !== 'Active') {
      let message = 'Account is not active';
      if (user.status === 'Pending') {
        message = 'Account is pending approval. Please contact an administrator.';
      } else if (user.status === 'Disabled') {
        message = 'Account has been disabled. Please contact an administrator.';
      }
      
      return NextResponse.json(
        { error: message },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      status: user.status,
      providerId: user.providerId?.toString()
    });

    // Prepare user data for response
    const userData = {
      id: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
      provider: user.providerId && typeof user.providerId === 'object' && 'firstName' in user.providerId ? {
        id: user.providerId._id,
        firstName: (user.providerId as any).firstName,
        lastName: (user.providerId as any).lastName,
        role: (user.providerId as any).role
      } : null
    };

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}