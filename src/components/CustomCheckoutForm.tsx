'use client';

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createSubscription } from '../app/actions';
import { CreditCard } from 'lucide-react';

interface Props {
    priceId: string;
}

export default function CustomCheckoutForm({ priceId }: Props) {
    const stripe = useStripe();
    const elements = useElements();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            // 1. Create Subscription on Server
            const { clientSecret } = await createSubscription(priceId, email);

            if (!clientSecret) {
                throw new Error("Failed to create subscription: No client secret returned");
            }

            // 2. Confirm Card Payment
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) throw new Error("Card Element not found");

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: name,
                        email: email,
                    },
                },
            });

            if (error) {
                setErrorMessage(error.message || 'An error occurred');
                setLoading(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Success! Redirect to return page with session_id (which is the PaymentIntent ID)
                window.location.href = `/?success=true&session_id=${paymentIntent.id}`;
            }
        } catch (err: any) {
            setErrorMessage(err.message);
            setLoading(false);
        }
    };

    const cardStyle = {
        style: {
            base: {
                color: "#ffffff",
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        },
        hidePostalCode: true,
    };

    return (
        <form onSubmit={handleSubmit} className="custom-checkout-form">
            <div className="form-group">
                <label className="input-label">
                    <CreditCard size={20} className="card-icon" />
                    <span className="label-text">Card</span>
                </label>
                <div className="card-element-container">
                    <CardElement options={cardStyle} />
                </div>
            </div>

            <div className="form-group">
                <input
                    type="text"
                    placeholder="Name on Card"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="text-input"
                />
            </div>

            <div className="form-group">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-input"
                />
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <button type="submit" disabled={!stripe || loading} className="submit-button">
                {loading ? 'Processing...' : 'Continue'}
            </button>

            <style jsx>{`
                .custom-checkout-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    width: 100%;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .input-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 4px;
                }
                .card-icon {
                    color: #fff;
                }
                .card-element-container {
                    padding: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.05);
                }
                .text-input {
                    padding: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    font-size: 16px;
                    outline: none;
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }
                .text-input::placeholder {
                    color: #aab7c4;
                }
                .text-input:focus, .card-element-container:focus-within {
                    border-color: #4CAF50;
                    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
                }
                .submit-button {
                    background: #4CAF50; /* Green */
                    color: white;
                    border: none;
                    padding: 16px;
                    border-radius: 30px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background 0.2s;
                    margin-top: 8px;
                }
                .submit-button:hover {
                    background: #4a4ccf;
                }
                .submit-button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                .error-message {
                    color: #df1b41;
                    font-size: 14px;
                    text-align: center;
                }
            `}</style>
        </form>
    );
}
