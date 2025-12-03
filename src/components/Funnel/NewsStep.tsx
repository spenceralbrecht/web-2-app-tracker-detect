'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Step } from './data';

interface Props {
    step: Step;
    onNext: () => void;
}

export default function NewsStep({ step, onNext }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalCards = step.images?.length || 0;
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        startInterval();
        return () => stopInterval();
    }, [totalCards]);

    const startInterval = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            nextCard();
        }, 2500);
    };

    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const nextCard = () => {
        setCurrentIndex(prev => (prev + 1) % totalCards);
    };

    const prevCard = () => {
        setCurrentIndex(prev => (prev - 1 + totalCards) % totalCards);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.changedTouches[0].screenX;
        stopInterval();
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].screenX;
        handleSwipe();
        startInterval();
    };

    const handleSwipe = () => {
        const threshold = 50;
        if (touchEndX.current < touchStartX.current - threshold) {
            nextCard();
        } else if (touchEndX.current > touchStartX.current + threshold) {
            prevCard();
        }
    };

    const getCardClass = (index: number) => {
        if (index === currentIndex) return 'active';
        if (index === (currentIndex + 1) % totalCards) return 'next';
        if (index === (currentIndex + 2) % totalCards) return 'next-2';

        const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
        if (index === prevIndex) return 'prev';

        return 'hidden';
    };

    return (
        <div className="news-container">
            <div className="news-header-card">
                <div className="news-label">{step.breakingNews}</div>
                <div className="news-title">{step.surgeTitle}</div>
                <div className="news-description">{step.surgeDescription}</div>
            </div>

            <div
                className="news-viewport"
                id="newsViewport"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {step.images?.map((img: string, index: number) => (
                    <div
                        key={index}
                        className={`news-card ${getCardClass(index)}`}
                        data-index={index}
                    >
                        <img src={img} alt={`News Article ${index + 1}`} />
                    </div>
                ))}
            </div>

            <div className="page-indicator">
                {step.images?.map((_: any, index: number) => (
                    <div
                        key={index}
                        className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                    ></div>
                ))}
            </div>

            <div className="news-fact">{step.fact}</div>

            <button className="news-btn" onClick={onNext}>
                {step.buttonText}
            </button>
        </div>
    );
}
