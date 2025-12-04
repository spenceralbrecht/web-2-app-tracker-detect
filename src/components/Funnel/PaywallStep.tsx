'use client';

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Step } from './data';
import { Check } from 'lucide-react';
import Image from 'next/image';
import CustomCheckoutForm from '../CustomCheckoutForm';

// Replace with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

interface Props {
    step: Step;
    onNext: () => void;
}

export default function PaywallStep({ step, onNext }: Props) {
    // Replace with your actual Stripe Price IDs
    const PRICE_IDS = {
        yearly: 'price_1SaLz1Fj5Urn3FygBiLqOGOI', // Replace with actual yearly price ID
    };

    return (
        <div className="paywall-container">
            <h1 className="headline">
                Stop your phone <span className="highlight">from being spied on.</span>
            </h1>

            <div className="content-wrapper">
                <div className="left-column">
                    <div className="benefits-list">
                        <div className="benefit-item">
                            <div className="check-circle"><Check size={14} color="white" strokeWidth={3} /></div>
                            <span>Spying protection</span>
                        </div>
                        <div className="benefit-item">
                            <div className="check-circle"><Check size={14} color="white" strokeWidth={3} /></div>
                            <span>Real-time Threat Alerts</span>
                        </div>
                        <div className="benefit-item">
                            <div className="check-circle"><Check size={14} color="white" strokeWidth={3} /></div>
                            <span>24/7 Background protection</span>
                        </div>
                    </div>
                </div>

                <div className="right-column">
                    <div className="phone-mockup">
                        <Image
                            src="/onboarding_carousel_1.webp"
                            alt="App Screenshot"
                            width={80}
                            height={120}
                            className="phone-image"
                        />
                    </div>
                </div>
            </div>

            <div className="payment-section">
                <div className="checkout-container">


                    <div id="checkout">
                        <Elements stripe={stripePromise}>
                            <CustomCheckoutForm priceId={PRICE_IDS.yearly} />
                        </Elements>
                    </div>
                </div>

                <p className="guarantee">14-day money-back guarantee</p>
                <p className="terms">
                    <a href="#">Auto-renewal</a>. By proceeding, you affirm your agreement to our <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
                </p>
            </div>

            <style jsx>{`
                .paywall-container {
                    display: flex;
                    flex-direction: column;
                    padding: 24px;
                    color: #fff;
                    max-width: 800px;
                    margin: 0 auto;
                    width: 100%;
                }
                .content-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 30px;
                    gap: 20px;
                }
                @media(min-width: 768px) {
                    .content-wrapper {
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 40px;
                    }
                    .left-column {
                        flex: 1;
                        padding-top: 20px;
                    }
                    .right-column {
                        flex: 1;
                        display: flex;
                        justify-content: center;
                    }
                }
                .headline {
                    font-size: 28px;
                    font-weight: 700;
                    line-height: 1.2;
                    margin-bottom: 24px;
                    color: #fff;
                }
                .highlight {
                    color: #4CAF50; /* Green */
                }
                .benefits-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .benefit-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .check-circle {
                    width: 24px;
                    height: 24px;
                    background: #4CAF50; /* Green */
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .benefit-item span {
                    font-size: 16px;
                    font-weight: 500;
                    color: #e0e0e0;
                }
                .phone-mockup {
                    position: relative;
                }
                .phone-image {
                    border-radius: 16px;
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
                }
                
                .payment-section {
                    background: transparent;
                    width: 100%;
                    max-width: 500px;
                    margin: 0 auto;
                }

                .checkout-container {
                    background: transparent;
                    border-radius: 12px;
                    padding: 20px;
                    color: #fff;
                }
                
                .order-summary {
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #eee;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 4px;
                }
                .plan-name {
                    font-weight: 700;
                    font-size: 18px;
                    color: #1a1a2e;
                }
                .plan-price {
                    font-weight: 700;
                    font-size: 18px;
                    color: #1a1a2e;
                }
                .subtext {
                    color: #666;
                    font-size: 14px;
                }
                .badge {
                    background: #4CAF50;
                    color: white;
                    font-size: 10px;
                    font-weight: 800;
                    padding: 2px 6px;
                    border-radius: 4px;
                }
                
                .guarantee {
                    text-align: center;
                    color: #888;
                    margin-top: 20px;
                    font-size: 14px;
                }
                .terms {
                    text-align: center;
                    color: #666;
                    font-size: 12px;
                    margin-top: 10px;
                    line-height: 1.5;
                }
                .terms a {
                    color: #888;
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}
