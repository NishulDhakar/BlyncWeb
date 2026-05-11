import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/mailer';

// Only allow in development
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const to = req.nextUrl.searchParams.get('to');
  if (!to) {
    return NextResponse.json({ error: 'Pass ?to=your@email.com' }, { status: 400 });
  }

  try {
    await sendWelcomeEmail(to, 'Test User');
    return NextResponse.json({ ok: true, message: `Welcome email sent to ${to}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
