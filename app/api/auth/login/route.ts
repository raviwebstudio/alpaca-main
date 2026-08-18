import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, generateTokens, setAuthCookies } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const identifier = body.identifier || body.email;
    const password = body.password;
    
    if (!identifier || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { email: body.email }
        ]
      }
    });
    
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    console.log('Password valid:', isValid);
    console.log('User found:', user?.email, 'Role:', user?.role);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
