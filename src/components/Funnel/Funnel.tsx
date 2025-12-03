'use client';

import React, { useState, useEffect } from 'react';
import { steps, Step } from './data';
import CarouselStep from './CarouselStep';
import QuestionStep from './QuestionStep';
import NewsStep from './NewsStep';
import GraphStep from './GraphStep';
import FinalStep from './FinalStep';
import ResultsStep from './ResultsStep';
import FeaturesStep from './FeaturesStep';
import ReviewStep from './ReviewStep';
import PaywallStep from './PaywallStep';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Funnel() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const success = searchParams.get('success');
        const canceled = searchParams.get('canceled');
        const sessionId = searchParams.get('session_id');

        if (success === 'true' && sessionId) {
            // Verify the session
            fetch(`/api/verify_session?session_id=${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.payment_status === 'paid') {
                        // Find the index of the step AFTER paywall (which is 'results' usually)
                        const paywallIndex = steps.findIndex(s => s.type === 'paywall');
                        if (paywallIndex !== -1 && paywallIndex < steps.length - 1) {
                            setCurrentStepIndex(paywallIndex + 1);
                        }
                    } else {
                        console.error('Payment not paid:', data);
                        // Optionally redirect back to paywall or show error
                        const paywallIndex = steps.findIndex(s => s.type === 'paywall');
                        if (paywallIndex !== -1) setCurrentStepIndex(paywallIndex);
                    }
                })
                .catch(err => {
                    console.error('Error verifying session:', err);
                    // Fallback to paywall on error
                    const paywallIndex = steps.findIndex(s => s.type === 'paywall');
                    if (paywallIndex !== -1) setCurrentStepIndex(paywallIndex);
                });
        } else if (canceled === 'true') {
            // Go to paywall step
            const paywallIndex = steps.findIndex(s => s.type === 'paywall');
            if (paywallIndex !== -1) {
                setCurrentStepIndex(paywallIndex);
            }
        }
    }, [searchParams]);

    const nextStep = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const handleAnswer = (stepId: string, answer: string | string[]) => {
        setAnswers(prev => ({
            ...prev,
            [stepId]: Array.isArray(answer) ? answer : [answer]
        }));
    };

    const step = steps[currentStepIndex];

    return (
        <div id="app">
            <div className="step-container">
                <div className="content">
                    {step.type === 'carousel' && (
                        <CarouselStep step={step} onNext={nextStep} />
                    )}
                    {step.type === 'question' && (
                        <QuestionStep
                            step={step}
                            onNext={nextStep}
                            onAnswer={handleAnswer}
                            currentAnswers={answers[step.id] || []}
                        />
                    )}
                    {step.type === 'news' && (
                        <NewsStep step={step} onNext={nextStep} />
                    )}
                    {step.type === 'graph' && (
                        <GraphStep step={step} onNext={nextStep} />
                    )}
                    {step.type === 'final' && (
                        <FinalStep step={step} onNext={nextStep} />
                    )}
                    {step.type === 'results' && (
                        <ResultsStep step={step} onNext={nextStep} answers={answers} />
                    )}
                    {step.type === 'features' && (
                        <FeaturesStep step={step} onNext={nextStep} />
                    )}
                    {step.type === 'review' && (
                        <ReviewStep step={step} onNext={nextStep} />
                    )}
                    {step.type === 'paywall' && (
                        <PaywallStep step={step} onNext={nextStep} />
                    )}
                </div>
            </div>
        </div>
    );
}
