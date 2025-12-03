import { NextResponse } from 'next/server';
// import Stripe from 'stripe';

export async function POST(req: Request) {
    try {
        const { priceId } = await req.json();

        // In a real app, use your actual Stripe secret key
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.headers.get('origin')}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/?canceled=true`,
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
        console.error('Error creating checkout session:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
