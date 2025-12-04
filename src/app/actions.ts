'use server';

import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia',
});

export async function createCheckoutSession(priceId: string) {
    try {
        const headersList = await headers();
        const origin = headersList.get('origin') || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
            billing_address_collection: 'auto',
            payment_method_types: ['card'],
            phone_number_collection: {
                enabled: false,
            },
        });

        return { clientSecret: session.client_secret };
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        throw new Error(error.message);
    }
}

export async function getSessionStatus(sessionId: string) {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return {
            status: session.status,
            customer_email: session.customer_details?.email,
        };
    } catch (error: any) {
        console.error('Error retrieving session status:', error);
        throw new Error(error.message);
    }
}

export async function createSubscription(priceId: string, email: string) {
    try {
        // Create a new customer
        const customer = await stripe.customers.create({
            email: email,
        });

        // Create the subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{
                price: priceId,
            }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
        });

        const invoice = subscription.latest_invoice as any;
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

        return {
            subscriptionId: subscription.id,
            clientSecret: paymentIntent.client_secret,
        };
    } catch (error: any) {
        console.error('Error creating subscription:', error);
        throw new Error(error.message);
    }
}
