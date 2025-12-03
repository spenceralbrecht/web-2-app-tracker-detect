'use client';

import React from 'react';
import { Step } from './data';

interface Props {
    step: Step;
}

export default function FinalStep({ step }: Props) {
    const handleInstall = () => {
        window.open('https://play.google.com/store/apps/details?id=com.dylan.airtag.detector.pro&referrer=utm_source%3Dweb_app%26utm_medium%3DTracker%2BDetect%2BApp%26utm_campaign%3Dweb_app%26anid%3Daarki%26aclid%3D{click_id}%26cp1%3D', '_blank');
    };

    return (
        <div className="final-container">
            <div className="final-icon"></div>
            <h1 className="final-title">{step.title}</h1>
            <div className="final-subtitle">{step.subtitle}</div>
            <p className="final-description">{step.description}</p>

            <button className="final-btn" onClick={handleInstall}>
                {step.buttonText}
            </button>
        </div>
    );
}
