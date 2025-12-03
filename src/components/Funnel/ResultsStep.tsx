'use client';

import React from 'react';
import { Step } from './data';

interface Props {
    step: Step;
    onNext: () => void;
    answers: Record<string, string[]>;
}

export default function ResultsStep({ step, onNext, answers }: Props) {
    const summaryItems: string[] = [];
    if (answers['scan_plan'] && answers['scan_plan'].includes('quick_scan')) summaryItems.push('Quick Scan');
    if (answers['scan_plan'] && answers['scan_plan'].includes('ongoing')) summaryItems.push('Ongoing Protection');

    if (answers['intent'] && answers['intent'].includes('known_threat')) summaryItems.push('Locate Known Threat');
    if (answers['intent'] && answers['intent'].includes('suspicion')) summaryItems.push('Check for Suspicious Devices');
    if (answers['intent'] && answers['intent'].includes('privacy')) summaryItems.push('Enhance Privacy Awareness');
    if (answers['intent'] && answers['intent'].includes('find_mine')) summaryItems.push('Find My Device');

    if (summaryItems.length === 0) summaryItems.push('Protect your device');

    return (
        <>
            <h2>{step.title}</h2>
            <ul className="results-list">
                {summaryItems.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <button className="primary-btn" onClick={onNext}>
                {step.buttonText}
            </button>
        </>
    );
}
