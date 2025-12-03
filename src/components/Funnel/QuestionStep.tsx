'use client';

import React from 'react';
import { Step } from './data';

interface Props {
    step: Step;
    onNext: () => void;
    onAnswer: (stepId: string, answer: string | string[]) => void;
    currentAnswers: string[];
}

export default function QuestionStep({ step, onNext, onAnswer, currentAnswers }: Props) {

    const handleOptionClick = (optionId: string) => {
        if (step.multiSelect) {
            const newAnswers = currentAnswers.includes(optionId)
                ? currentAnswers.filter(id => id !== optionId)
                : [...currentAnswers, optionId];
            onAnswer(step.id, newAnswers);
        } else {
            onAnswer(step.id, [optionId]);
            onNext();
        }
    };

    return (
        <>
            <h2>{step.question}</h2>
            {step.subtitle && <p className="subtitle">{step.subtitle}</p>}

            <div className="options-grid">
                {step.options?.map((option: any) => {
                    const isSelected = currentAnswers.includes(option.id);
                    return (
                        <button
                            key={option.id}
                            className={`option-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleOptionClick(option.id)}
                        >
                            {option.icon && (
                                <span className="icon">
                                    {option.icon === 'magnifying_glass' ? '🔍' :
                                        option.icon === 'shield' ? '🛡️' :
                                            option.icon === 'mobile' ? '📱' : option.icon}
                                </span>
                            )}
                            <div className="option-text">
                                <span className="label">{option.label}</span>
                                {option.description && <span className="description">{option.description}</span>}
                            </div>
                            {step.multiSelect ? (
                                <span className="checkbox"></span>
                            ) : (
                                <span className="arrow">›</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {step.multiSelect && (
                <button className="primary-btn" onClick={onNext}>
                    Next
                </button>
            )}
        </>
    );
}
