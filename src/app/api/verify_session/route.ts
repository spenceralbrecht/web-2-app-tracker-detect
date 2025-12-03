import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return NextResponse.json({
            status: session.status,
            payment_status: session.payment_status,
        });
    } catch (err: any) {
        console.error('Error verifying session:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
