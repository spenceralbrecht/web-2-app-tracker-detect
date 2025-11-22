import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia', // Use latest API version or the one you prefer
});

export async function POST(req: Request) {
    try {
        const { plan } = await req.json();

        let priceId;
        // Replace these with your actual Stripe Price IDs
        if (plan === 'weekly') {
            priceId = 'price_weekly_placeholder';
        } else if (plan === 'yearly') {
            priceId = 'price_yearly_placeholder';
        } else {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        // For demo purposes, we'll create a session with ad-hoc data if no price ID is provided
        // In production, you should use price IDs from your Stripe Dashboard
        const lineItems = priceId.includes('placeholder')
            ? [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: plan === 'weekly' ? 'Weekly Subscription' : 'Yearly Subscription',
                        },
                        unit_amount: plan === 'weekly' ? 899 : 499, // $8.99 or $4.99 (weekly equivalent for yearly)
                        recurring: {
                            interval: plan === 'weekly' ? 'week' : 'year',
                        },
                    },
                    quantity: 1,
                },
            ]
            : [{ price: priceId, quantity: 1 }];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'subscription',
            success_url: `${req.headers.get('origin')}/?success=true`,
            cancel_url: `${req.headers.get('origin')}/?canceled=true`,
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (err: any) {
        console.error('Error creating checkout session:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
