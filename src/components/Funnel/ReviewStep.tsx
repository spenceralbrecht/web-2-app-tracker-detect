'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Step } from './data';

interface Props {
    step: Step;
    onNext: () => void;
}

export default function ReviewStep({ step, onNext }: Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isInteracting = useRef(false);

    const handleInstall = () => {
        onNext();
    };

    const startAutoAdvance = () => {
        stopAutoAdvance();
        intervalRef.current = setInterval(() => {
            if (!isInteracting.current && step.reviews) {
                setActiveIndex(prev => {
                    const nextIndex = (prev + 1) % step.reviews.length;
                    scrollToSlide(nextIndex);
                    return nextIndex;
                });
            }
        }, 4000);
    };

    const stopAutoAdvance = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        startAutoAdvance();
        return () => stopAutoAdvance();
    }, [step.reviews]);

    const handleScroll = () => {
        // We can update active index here if needed, but let's rely on the end of scroll
        // to avoid jittery updates during swipe.
    };

    const handleScrollEnd = () => {
        if (scrollContainerRef.current) {
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            const slideWidth = scrollContainerRef.current.offsetWidth * 0.85;
            const index = Math.round(scrollLeft / slideWidth);
            if (index !== activeIndex && index >= 0 && index < (step.reviews?.length || 0)) {
                setActiveIndex(index);
            }
            isInteracting.current = false;
            startAutoAdvance();
        }
    };

    const scrollToSlide = (index: number) => {
        if (scrollContainerRef.current) {
            const slides = scrollContainerRef.current.children;
            if (slides[index]) {
                slides[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    };

    return (
        <div className="review-container">
            <div className="header-section">
                <h2 className="review-title">{step.title}</h2>
                <div className="gp-rating-container">
                    <div className="gp-row-1">
                        <svg className="gp-icon" viewBox="0 0 289.789 289.789" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path style={{ fill: '#349886' }} d="M13.424,13.689c-0.692,2.431-1.165,5.053-1.165,8.048v246.356c0,2.95,0.473,5.544,1.138,7.948 l138.267-130.993C151.664,145.047,13.424,13.689,13.424,13.689z" />
                                <path style={{ fill: '#3DB39E' }} d="M205.621,93.921L44.185,4.121C37.749,0.207,31.413-0.785,26.06,0.58l138.85,131.931 C164.91,132.511,205.621,93.921,205.621,93.921z" />
                                <path style={{ fill: '#F4B459' }} d="M265.142,127.031l-43.088-23.97l-44.135,41.804l44.954,42.733l41.923-23.023 C285.261,152.913,277.796,134.141,265.142,127.031z" />
                                <path style={{ fill: '#E2574C' }} d="M25.65,289.095c5.435,1.52,11.926,0.61,18.526-3.405l161.928-88.907L164.655,157.4 C164.655,157.401,25.65,289.095,25.65,289.095z" />
                            </g>
                        </svg>
                        <span className="gp-text">Google Play Rating</span>
                    </div>
                    <div className="gp-row-2">
                        <span className="gp-score">4.6</span>
                        <span className="stars">★★★★★</span>
                        <span className="gp-count">5.5k reviews</span>
                    </div>
                </div>
            </div>

            <div
                className="reviews-carousel"
                ref={scrollContainerRef}
                onScroll={handleScroll}
                onTouchStart={() => { isInteracting.current = true; stopAutoAdvance(); }}
                onTouchEnd={handleScrollEnd}
                onMouseEnter={() => { isInteracting.current = true; stopAutoAdvance(); }}
                onMouseLeave={() => { isInteracting.current = false; startAutoAdvance(); }}
            >
                {step.reviews?.map((review: any, index: number) => (
                    <div key={index} className="review-slide">
                        <div className={`review-card ${index === activeIndex ? 'active' : ''}`}>
                            <div className="review-header">
                                <div className="review-author-avatar">{review.author.charAt(0)}</div>
                                <div className="review-meta">
                                    <div className="review-author">{review.author}</div>
                                    <div className="review-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>★</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="review-date">{review.date}</div>
                            </div>
                            <p className="review-text">"{review.text}"</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="carousel-indicators">
                {step.reviews?.map((_: any, index: number) => (
                    <button
                        key={index}
                        className={`indicator ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => { setActiveIndex(index); scrollToSlide(index); }}
                        aria-label={`Go to review ${index + 1}`}
                    />
                ))}
            </div>

            <button className="primary-btn" onClick={handleInstall}>
                {step.buttonText}
            </button>

            <style jsx>{`
                .review-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    padding: 20px 0;
                    color: #fff;
                    max-width: 100%;
                    margin: 0 auto;
                    justify-content: center;
                    overflow: hidden;
                }
                .header-section {
                    margin-bottom: 25px;
                    text-align: center;
                    padding: 0 20px;
                }
                .review-title {
                    font-size: 26px;
                    margin-bottom: 12px;
                    font-weight: 800;
                    background: linear-gradient(90deg, #fff, #aaa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .gp-rating-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }
                .gp-row-1 {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #e0e0e0;
                    font-weight: 500;
                }
                .gp-icon {
                    display: block;
                }
                .gp-row-2 {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .gp-score {
                    font-size: 16px;
                    font-weight: 700;
                    color: #fff;
                }
                .stars {
                    color: #FFD700;
                    letter-spacing: 1px;
                    font-size: 14px;
                }
                .gp-count {
                    font-size: 13px;
                    color: #999;
                }
                .reviews-carousel {
                    display: flex;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    gap: 16px;
                    padding: 0 calc(50% - 42.5%);
                    padding-bottom: 20px;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .reviews-carousel::-webkit-scrollbar {
                    display: none;
                }
                .review-slide {
                    flex: 0 0 85%;
                    scroll-snap-align: center;
                    display: flex;
                    justify-content: center;
                    transition: transform 0.3s ease, opacity 0.3s ease;
                    opacity: 0.5;
                    transform: scale(0.9);
                }
                /* Highlight active slide */
                /* Since we pass 'active' class to review-card based on state */
                .review-slide:has(.active) {
                    opacity: 1;
                    transform: scale(1);
                }
                
                .review-card {
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 20px;
                    width: 100%;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    display: flex;
                    flex-direction: column;
                    height: 220px; /* Fixed height for uniformity */
                }
                
                .review-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .review-author-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #4CAF50, #2E7D32);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 18px;
                    margin-right: 12px;
                    color: white;
                }
                .review-meta {
                    flex: 1;
                }
                .review-author {
                    font-weight: 700;
                    font-size: 14px;
                    margin-bottom: 2px;
                }
                .review-rating {
                    color: #FFD700;
                    font-size: 14px;
                }
                .review-date {
                    font-size: 11px;
                    color: #888;
                }
                .review-text {
                    font-size: 14px;
                    line-height: 1.5;
                    color: #e0e0e0;
                    font-style: italic;
                    /* Truncation logic */
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .carousel-indicators {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin: 10px 0 30px;
                }
                .indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.2);
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    padding: 0;
                }
                .indicator.active {
                    background-color: #4CAF50;
                    transform: scale(1.2);
                    width: 20px;
                    border-radius: 10px;
                }
                .primary-btn {
                    width: calc(100% - 40px); /* Account for padding */
                    margin: 0 20px;
                    padding: 16px;
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                    color: white;
                    border: none;
                    border-radius: 14px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
                }
            `}</style>
        </div>
    );
}
