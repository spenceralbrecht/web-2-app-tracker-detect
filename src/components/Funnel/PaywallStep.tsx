'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Step } from './data';
import { Check, Shield, Zap, Lock } from 'lucide-react';

// Replace with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

interface Props {
    step: Step;
    onNext: () => void;
}

export default function PaywallStep({ step, onNext }: Props) {
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'weekly'>('yearly');

    // Replace with your actual Stripe Price IDs
    const PRICE_IDS = {
        yearly: 'price_1SaLz1Fj5Urn3FygBiLqOGOI', // Replace with actual yearly price ID
        weekly: 'price_1Qc...'  // Replace with actual weekly price ID
    };

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: selectedPlan === 'yearly' ? PRICE_IDS.yearly : PRICE_IDS.weekly
                }),
            });

            const { url, error } = await response.json();

            if (error) {
                console.error('Error creating session:', error);
                alert('Failed to start payment: ' + error);
                setLoading(false);
                return;
            }

            if (url) {
                window.location.href = url;
            } else {
                console.error('No checkout URL returned');
                alert('Failed to start payment: No checkout URL');
                setLoading(false);
            }
        } catch (err) {
            console.error('Payment error:', err);
            alert('An unexpected error occurred.');
            setLoading(false);
        }
    };

    return (
        <div className="paywall-container">
            <div className="header">
                <div className="icon-wrapper">
                    <Shield className="shield-icon" size={48} />
                </div>
                <h1>{step.title}</h1>
                <p className="subtitle">{step.subtitle}</p>
            </div>

            <div className="benefits-list">
                {step.benefits?.map((benefit: string, index: number) => (
                    <div key={index} className="benefit-item">
                        <div className="check-circle">
                            <Check size={16} color="white" />
                        </div>
                        <span>{benefit}</span>
                    </div>
                ))}
            </div>

            <div className="plans-container">
                <div
                    className={`plan-card ${selectedPlan === 'yearly' ? 'selected' : ''}`}
                    onClick={() => setSelectedPlan('yearly')}
                >
                    <div className="plan-header">
                        <span className="plan-name">Yearly Access</span>
                        <span className="save-badge">SAVE 80%</span>
                    </div>
                    <div className="plan-price">
                        <span className="currency">$</span>
                        <span className="amount">39.99</span>
                        <span className="period">/year</span>
                    </div>
                    <div className="plan-subtext">$3.33 / month</div>
                    {selectedPlan === 'yearly' && <div className="selected-check"><Check size={14} /></div>}
                </div>

                <div
                    className={`plan-card ${selectedPlan === 'weekly' ? 'selected' : ''}`}
                    onClick={() => setSelectedPlan('weekly')}
                >
                    <div className="plan-header">
                        <span className="plan-name">Weekly Access</span>
                    </div>
                    <div className="plan-price">
                        <span className="currency">$</span>
                        <span className="amount">6.99</span>
                        <span className="period">/week</span>
                    </div>
                    {selectedPlan === 'weekly' && <div className="selected-check"><Check size={14} /></div>}
                </div>
            </div>

            <div className="action-area">
                <button
                    className="subscribe-btn"
                    onClick={handleSubscribe}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : step.buttonText}
                </button>
                <p className="guarantee">
                    <Lock size={12} />
                    Secured with SSL Encryption. Cancel anytime.
                </p>
            </div>

            <style jsx>{`
                .paywall-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    padding: 20px;
                    color: #fff;
                    max-width: 100%;
                    margin: 0 auto;
                    overflow-y: auto;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    margin-top: 10px;
                }
                .icon-wrapper {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 80px;
                    height: 80px;
                    background: rgba(76, 175, 80, 0.1);
                    border-radius: 50%;
                    margin-bottom: 16px;
                    border: 1px solid rgba(76, 175, 80, 0.3);
                    box-shadow: 0 0 20px rgba(76, 175, 80, 0.2);
                }
                .shield-icon {
                    color: #4CAF50;
                }
                h1 {
                    font-size: 28px;
                    font-weight: 800;
                    margin-bottom: 8px;
                    background: linear-gradient(90deg, #fff, #e0e0e0);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .subtitle {
                    font-size: 16px;
                    color: #aaa;
                    line-height: 1.4;
                }
                .benefits-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    margin-bottom: 30px;
                }
                .benefit-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 12px 16px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .check-circle {
                    width: 24px;
                    height: 24px;
                    background: #4CAF50;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .benefit-item span {
                    font-size: 15px;
                    font-weight: 500;
                    color: #e0e0e0;
                }
                .plans-container {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 30px;
                }
                .plan-card {
                    position: relative;
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 16px 20px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .plan-card.selected {
                    background: rgba(76, 175, 80, 0.1);
                    border-color: #4CAF50;
                    box-shadow: 0 0 15px rgba(76, 175, 80, 0.2);
                }
                .plan-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                .plan-name {
                    font-weight: 700;
                    font-size: 16px;
                }
                .save-badge {
                    background: #4CAF50;
                    color: white;
                    font-size: 10px;
                    font-weight: 800;
                    padding: 4px 8px;
                    border-radius: 20px;
                }
                .plan-price {
                    display: flex;
                    align-items: baseline;
                    gap: 2px;
                }
                .currency {
                    font-size: 18px;
                    font-weight: 600;
                }
                .amount {
                    font-size: 28px;
                    font-weight: 800;
                    color: #fff;
                }
                .period {
                    font-size: 14px;
                    color: #aaa;
                }
                .plan-subtext {
                    font-size: 12px;
                    color: #888;
                    margin-top: 4px;
                }
                .selected-check {
                    position: absolute;
                    top: 50%;
                    right: 16px;
                    transform: translateY(-50%);
                    width: 24px;
                    height: 24px;
                    background: #4CAF50;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                .action-area {
                    margin-top: auto;
                    text-align: center;
                }
                .subscribe-btn {
                    width: 100%;
                    padding: 18px;
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                    color: white;
                    border: none;
                    border-radius: 16px;
                    font-size: 18px;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
                    transition: transform 0.1s;
                    margin-bottom: 12px;
                }
                .subscribe-btn:active {
                    transform: scale(0.98);
                }
                .subscribe-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .guarantee {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    font-size: 12px;
                    color: #666;
                }
            `}</style>
        </div>
    );
}
