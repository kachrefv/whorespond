import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword
      }
    });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Registration API error:', error);

    // Specific handling for PrismaClientInitializationError (e.g., missing DATABASE_URL)
    if (error.name === 'PrismaClientInitializationError' || (error.message && error.message.includes('DATABASE_URL'))) {
      return NextResponse.json({ message: 'Server configuration error: Database connection failed. Please contact support.' }, { status: 500 });
    }

    // General handling for other Prisma-related errors
    if (error.constructor.name.startsWith('PrismaClient')) {
      return NextResponse.json({ message: 'A database error occurred during registration.' }, { status: 500 });
    }

    // Generic error for unexpected issues
    return NextResponse.json({ message: 'An unexpected error occurred. Please try again later.' }, { status: 500 });
  }
}
