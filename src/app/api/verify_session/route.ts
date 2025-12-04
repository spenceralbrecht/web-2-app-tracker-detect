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

        let status;
        let payment_status;

        if (sessionId.startsWith('pi_')) {
            const paymentIntent = await stripe.paymentIntents.retrieve(sessionId);
            status = paymentIntent.status;
            payment_status = paymentIntent.status === 'succeeded' ? 'paid' : 'unpaid';
        } else {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            status = session.status;
            payment_status = session.payment_status;
        }

        return NextResponse.json({
            status: status,
            payment_status: payment_status,
        });
    } catch (err: any) {
        console.error('Error verifying session:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
