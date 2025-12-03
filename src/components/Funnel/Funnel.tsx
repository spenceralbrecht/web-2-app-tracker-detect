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

export default function Funnel() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string[]>>({});

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
                        <FinalStep step={step} />
                    )}
                    {step.type === 'results' && (
                        <ResultsStep step={step} onNext={nextStep} answers={answers} />
                    )}
                    {step.type === 'features' && (
                        <FeaturesStep step={step} onNext={nextStep} />
                    )}
                </div>
            </div>
        </div>
    );
}
