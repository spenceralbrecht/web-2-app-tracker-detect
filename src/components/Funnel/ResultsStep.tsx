'use client';

import React from 'react';
import { Step } from './data';
import Image from 'next/image';

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

    const handleInstall = () => {
        window.open('https://play.google.com/store/apps/details?id=com.dylan.airtag.detector.pro&referrer=utm_source%3Dweb_app%26utm_medium%3DTracker%2BDetect%2BApp%26utm_campaign%3Dweb_app%26anid%3Daarki%26aclid%3D{click_id}%26cp1%3D', '_blank');
    };

    return (
        <div className="results-container">
            <div className="icon-container">
                <Image src="/ic_shield.svg" alt="Security Shield" width={80} height={80} />
            </div>

            <h2 className="results-title">{step.title}</h2>

            <div className="encouragement-text">
                You have access to security tools
            </div>

            <ul className="results-list">
                {summaryItems.map((item, index) => (
                    <li key={index} className="result-item">
                        <span className="check-icon">✓</span>
                        {item}
                    </li>
                ))}
            </ul>

            <div className="advice-text">
                Install the app to get direct access
            </div>

            <button className="primary-btn" onClick={handleInstall}>
                Install
            </button>

            <style jsx>{`
                .results-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    color: #fff;
                    text-align: center;
                }
                .icon-container {
                    margin-bottom: 20px;
                    filter: drop-shadow(0 0 10px rgba(76, 175, 80, 0.5));
                }
                .results-title {
                    font-size: 24px;
                    font-weight: 800;
                    margin-bottom: 10px;
                    background: linear-gradient(90deg, #fff, #aaa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .encouragement-text {
                    font-size: 18px;
                    color: #4CAF50;
                    font-weight: 600;
                    margin-bottom: 25px;
                }
                .results-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 30px 0;
                    width: 100%;
                    max-width: 320px;
                }
                .result-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    margin-bottom: 10px;
                    padding: 12px 16px;
                    border-radius: 12px;
                    font-size: 15px;
                    text-align: left;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .check-icon {
                    color: #4CAF50;
                    font-weight: bold;
                }
                .advice-text {
                    font-size: 14px;
                    color: #aaa;
                    margin-bottom: 20px;
                }
                .primary-btn {
                    width: 100%;
                    max-width: 320px;
                    padding: 16px;
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                    color: white;
                    border: none;
                    border-radius: 14px;
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
                    transition: transform 0.2s;
                }
                .primary-btn:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    );
}
