"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Paywall() {
    const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'yearly'>('weekly');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ plan: selectedPlan }),
            });

            const { sessionId, error } = await response.json();

            if (error) {
                console.error('Error creating session:', error);
                alert('Failed to start checkout. Please try again.');
                setIsLoading(false);
                return;
            }

            const stripe = await stripePromise;
            if (!stripe) {
                console.error('Stripe failed to load');
                setIsLoading(false);
                return;
            }

            const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

            if (stripeError) {
                console.error('Stripe redirect error:', stripeError);
                alert(stripeError.message);
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center max-w-md mx-auto w-full px-4 pt-4 pb-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-6"
            >
                <div className="w-20 h-20 bg-[#50E3C2] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#50E3C2]/30">
                    <Check className="w-10 h-10 text-white" strokeWidth={4} />
                </div>
                <h2 className="text-2xl font-bold text-[#1C1C28] mb-2">
                    Your personalized app is ready!
                </h2>

                <div className="flex items-center justify-center space-x-1 text-[#00B67A] font-bold mt-4">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-xl">Trustpilot</span>
                </div>
                <div className="flex items-center justify-center space-x-1 mt-1">
                    <span className="text-[#1C1C28] font-medium">Excellent</span>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-5 h-5 bg-[#00B67A] mx-[1px]" />)}
                    </div>
                    <span className="text-[#1C1C28] font-medium">4.8/5</span>
                </div>
            </motion.div>

            <div className="w-full space-y-4 mb-8">
                <div
                    onClick={() => setSelectedPlan('weekly')}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === 'weekly' ? 'border-[#483FDD] bg-[#F4F6FC]' : 'border-gray-200 bg-white'}`}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-[#1C1C28]">Weekly</h3>
                            <p className="text-sm text-[#6B6B7F]">7-day free trial, then $8.99/week</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'weekly' ? 'border-[#483FDD]' : 'border-gray-300'}`}>
                            {selectedPlan === 'weekly' && <div className="w-3 h-3 bg-[#483FDD] rounded-full" />}
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => setSelectedPlan('yearly')}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === 'yearly' ? 'border-[#483FDD] bg-[#F4F6FC]' : 'border-gray-200 bg-white'}`}
                >
                    <div className="absolute -top-3 right-4 bg-[#483FDD] text-white text-xs font-bold px-2 py-1 rounded-full">
                        SAVE 50%
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-[#1C1C28]">Yearly</h3>
                            <p className="text-sm text-[#6B6B7F]">$4.99/week, billed yearly</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'yearly' ? 'border-[#483FDD]' : 'border-gray-300'}`}>
                            {selectedPlan === 'yearly' && <div className="w-3 h-3 bg-[#483FDD] rounded-full" />}
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-[#483FDD] hover:bg-[#3A32B0] text-white font-semibold py-4 rounded-full text-lg transition-colors shadow-lg shadow-blue-500/30 mb-4 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    "Start your 7-day trial"
                )}
            </button>

            <p className="text-xs text-center text-[#6B6B7F] px-4">
                By continuing you agree to our Terms of Service and Privacy Policy. Subscription auto-renews unless canceled.
            </p>
        </div>
    );
}
