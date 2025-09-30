import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, Provider } from '@/models';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { email, password, firstName, lastName, role, providerRole } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    let providerId = undefined;

    // If registering as a provider, create provider record first
    if (firstName && lastName && providerRole) {
      if (!['Anesthesiologist', 'CRNA', 'AA'].includes(providerRole)) {
        return NextResponse.json(
          { error: 'Invalid provider role' },
          { status: 400 }
        );
      }

      const provider = await Provider.create({
        firstName,
        lastName,
        role: providerRole,
        active: true,
        availableForRelief: providerRole === 'CRNA' // Default CRNAs to available for relief
      });

      providerId = provider._id;
    }

    // Create user with Pending status
    const user = await User.create({
      email,
      passwordHash,
      role: role === 'Admin' ? 'Admin' : 'Standard',
      status: 'Pending', // All new users start as Pending
      providerId
    });

    return NextResponse.json({
      message: 'Registration successful. Please wait for admin approval.',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}