'use client';

import React from 'react';
import { Step } from './data';

interface Props {
    step: Step;
    onNext: () => void;
}

export default function FeaturesStep({ step, onNext }: Props) {
    return (
        <>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
            <button className="primary-btn" onClick={onNext}>
                {step.buttonText}
            </button>
        </>
    );
}
