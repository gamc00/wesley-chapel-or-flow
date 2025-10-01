import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function POST() {
  try {
    // In production, you might want to add authentication check here
    const result = await seedDatabase();
    
    return NextResponse.json({
      message: 'Database seeded successfully',
      data: result
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Seed endpoint available. Use POST to seed the database.',
    endpoints: {
      seed: 'POST /api/seed'
    }
  });
}
