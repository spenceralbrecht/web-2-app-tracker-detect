'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Step } from './data';

interface Props {
    step: Step;
    onNext: () => void;
}

export default function CarouselStep({ step, onNext }: Props) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = step.images?.length || 0;
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        startInterval();
        return () => stopInterval();
    }, [totalSlides]);

    const startInterval = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % totalSlides);
        }, 2000);
    };

    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const handleNext = () => {
        stopInterval();
        onNext();
    };

    return (
        <div className="carousel-container">
            <div className="carousel-header">
                <div className="icon"></div>
                <h2>{step.headlineText}</h2>
                <p>{step.subheadlineText}</p>
            </div>

            <div className="carousel-viewport">
                <div
                    className="carousel-track"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {step.images?.map((img: string, index: number) => (
                        <div className="carousel-slide" key={index}>
                            <img src={img} alt={`Slide ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="carousel-footer">
                <button className="carousel-btn" onClick={handleNext}>
                    {step.buttonText}
                </button>
                <div className="carousel-time">{step.timeEstimate}</div>
            </div>
        </div>
    );
}
