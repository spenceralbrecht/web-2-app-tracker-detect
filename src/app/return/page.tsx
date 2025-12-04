'use client';

import React, { useEffect, useState } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import { getSessionStatus } from '../actions';

export default function ReturnPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState<string | null>(null);
    const [customerEmail, setCustomerEmail] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        getSessionStatus(sessionId).then((data) => {
            setStatus(data.status);
            if (data.customer_email) {
                setCustomerEmail(data.customer_email);
            }
        });
    }, [sessionId]);

    if (status === 'open') {
        return (
            redirect('/')
        );
    }

    if (status === 'complete') {
        return (
            <div id="success" className="success-container">
                <div className="content">
                    <div className="icon-circle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h1>Payment Successful!</h1>
                    <p>
                        We appreciate your business! A confirmation email will be sent to {customerEmail}.
                    </p>
                    <p>
                        If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
                    </p>
                    <button onClick={() => window.location.href = '/?success=true'} className="continue-btn">
                        Start App
                    </button>
                </div>
                <style jsx>{`
            .success-container {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: #1a1a2e;
                color: white;
                padding: 20px;
            }
            .content {
                background: rgba(255, 255, 255, 0.05);
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 500px;
                width: 100%;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .icon-circle {
                width: 80px;
                height: 80px;
                background: #4CAF50;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
                box-shadow: 0 0 20px rgba(76, 175, 80, 0.4);
            }
            .check-icon {
                width: 40px;
                height: 40px;
                color: white;
            }
            h1 {
                margin-bottom: 16px;
                font-size: 28px;
            }
            p {
                color: #ccc;
                margin-bottom: 24px;
                line-height: 1.5;
            }
            a {
                color: #4CAF50;
                text-decoration: underline;
            }
            .continue-btn {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 16px 32px;
                border-radius: 30px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                transition: background 0.2s;
            }
            .continue-btn:hover {
                background: #45a049;
            }
        `}</style>
            </div>
        );
    }

    return null;
}
