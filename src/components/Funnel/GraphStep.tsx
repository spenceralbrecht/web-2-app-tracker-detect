'use client';

import React, { useEffect, useRef } from 'react';
import { Step } from './data';

interface Props {
    step: Step;
    onNext: () => void;
}

export default function GraphStep({ step, onNext }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const rect = entry.contentRect;
                if (rect.width === 0 || rect.height === 0) return;

                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.resetTransform();
                ctx.scale(dpr, dpr);

                const chartBounds = {
                    left: 40,
                    top: 20,
                    right: rect.width - 20,
                    bottom: rect.height - 40,
                    width: rect.width - 60,
                    height: rect.height - 60
                };

                if (animationRef.current) cancelAnimationFrame(animationRef.current);
                startAnimation(ctx, rect, chartBounds);
            }
        });

        resizeObserver.observe(canvas);

        return () => {
            resizeObserver.disconnect();
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    const startAnimation = (ctx: CanvasRenderingContext2D, rect: DOMRectReadOnly, bounds: any) => {
        const dataPoints = [
            { year: 2019, value: 1500, color: "#2196F3", displayValue: "1.5K" },
            { year: 2020, value: 2100, color: "#4CAF50", displayValue: "2.1K" },
            { year: 2021, value: 3200, color: "#FFC107", displayValue: "3.2K" },
            { year: 2022, value: 5000, color: "#FF9800", displayValue: "5.0K" },
            { year: 2023, value: 6500, color: "#FF5722", displayValue: "6.5K" },
            { year: 2024, value: 7800, color: "#E91E63", displayValue: "7.8K" },
            { year: 2025, value: 8500, color: "#FF3030", displayValue: "8.5K" }
        ];
        const maxValue = 10000;
        let startTime: number | null = null;
        const duration = 1800;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const t = progress;
            const overshoot = (t: number) => {
                const tension = 0.8;
                return (t - 1) * (t - 1) * ((tension + 1) * (t - 1) + tension) + 1;
            };
            const animationProgress = overshoot(progress);

            ctx.clearRect(0, 0, rect.width, rect.height);

            drawChartStructure(ctx, bounds, maxValue, dataPoints);

            if (animationProgress > 0) {
                drawAnimatedChart(ctx, bounds, maxValue, dataPoints, animationProgress);
            }

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    const drawChartStructure = (ctx: CanvasRenderingContext2D, bounds: any, maxValue: number, dataPoints: any[]) => {
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= 4; i++) {
            const y = bounds.top + (bounds.height / 4) * i;
            ctx.moveTo(bounds.left, y);
            ctx.lineTo(bounds.right, y);
        }
        ctx.stroke();

        ctx.strokeStyle = "#555555";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bounds.left, bounds.top);
        ctx.lineTo(bounds.left, bounds.bottom);
        ctx.lineTo(bounds.right, bounds.bottom);
        ctx.stroke();

        ctx.fillStyle = "#888888";
        ctx.font = "10px Arial";
        ctx.textAlign = "right";
        for (let i = 0; i <= 4; i++) {
            const value = Math.round((maxValue / 4) * i / 1000) + "K";
            const y = bounds.bottom - (bounds.height / 4) * i;
            ctx.fillText(value, bounds.left - 5, y + 3);
        }

        ctx.textAlign = "center";
        dataPoints.forEach((point, i) => {
            const x = bounds.left + (bounds.width / (dataPoints.length - 1)) * i;
            ctx.fillText(point.year.toString(), x, bounds.bottom + 15);
        });
    };

    const drawAnimatedChart = (ctx: CanvasRenderingContext2D, bounds: any, maxValue: number, dataPoints: any[], progress: number) => {
        const pointPositions = dataPoints.map((point, i) => ({
            x: bounds.left + (bounds.width / (dataPoints.length - 1)) * i,
            y: bounds.bottom - (point.value / maxValue) * bounds.height,
            color: point.color,
            displayValue: point.displayValue
        }));

        const totalPoints = dataPoints.length;
        const effectiveProgress = Math.min(Math.max(progress, 0), 1);
        const currentPoint = (effectiveProgress * (totalPoints - 1));
        const completePoints = Math.floor(currentPoint);
        const partialProgress = currentPoint - completePoints;

        ctx.beginPath();
        ctx.moveTo(pointPositions[0].x, pointPositions[0].y);

        for (let i = 1; i <= Math.min(completePoints, totalPoints - 1); i++) {
            ctx.lineTo(pointPositions[i].x, pointPositions[i].y);
        }

        let lastX = pointPositions[Math.min(completePoints, totalPoints - 1)].x;
        let lastY = pointPositions[Math.min(completePoints, totalPoints - 1)].y; // Unused but kept for logic consistency

        if (completePoints < totalPoints - 1) {
            const currentPos = pointPositions[completePoints];
            const nextPos = pointPositions[completePoints + 1];
            const eased = 1 - Math.pow(1 - partialProgress, 4);

            const interpX = currentPos.x + (nextPos.x - currentPos.x) * eased;
            const interpY = currentPos.y + (nextPos.y - currentPos.y) * eased;

            ctx.lineTo(interpX, interpY);
            lastX = interpX;
            lastY = interpY; // Update lastY
        }

        ctx.strokeStyle = "#FF3030";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = "rgba(255, 48, 48, 0.4)";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.lineTo(lastX, bounds.bottom);
        ctx.lineTo(pointPositions[0].x, bounds.bottom);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, bounds.top, 0, bounds.bottom);
        gradient.addColorStop(0, "rgba(255, 48, 48, 0.4)");
        gradient.addColorStop(0.6, "rgba(255, 48, 48, 0.2)");
        gradient.addColorStop(1, "rgba(255, 48, 48, 0.05)");

        ctx.fillStyle = gradient;
        ctx.fill();

        const pointDelay = 0.15;
        const easeOutBack = (t: number) => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        };
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

        pointPositions.forEach((pos, i) => {
            const pointThreshold = (i / totalPoints) + pointDelay;

            if (progress >= pointThreshold) {
                let pointProgress = (progress - pointThreshold) / (1 - pointThreshold);
                pointProgress = Math.min(Math.max(pointProgress, 0), 1);

                let scale = 1;
                if (pointProgress < 1) {
                    scale = easeOutBack(pointProgress);
                }

                const radius = 4 * scale;

                const glowGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2);
                glowGrad.addColorStop(0, "rgba(255, 48, 48, 0.6)");
                glowGrad.addColorStop(1, "rgba(255, 48, 48, 0)");
                ctx.fillStyle = glowGrad;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius * 3, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = pos.color;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius * 0.6, 0, Math.PI * 2);
                ctx.fill();

                if (pointProgress > 0.3) {
                    let labelProgress = (pointProgress - 0.3) / 0.7;
                    labelProgress = Math.min(Math.max(labelProgress, 0), 1);

                    const slideOffset = (1 - easeOutCubic(labelProgress)) * 10;
                    ctx.globalAlpha = labelProgress;

                    ctx.fillStyle = pos.color;
                    ctx.font = "bold 10px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText(pos.displayValue, pos.x, pos.y - 10 - slideOffset);

                    ctx.globalAlpha = 1;
                }
            }
        });
    };

    return (
        <div className="graph-container">
            <div className="graph-header-card">
                <div className="graph-header-label">{step.headerLabel}</div>
                <div className="graph-header-title">{step.headerTitle}</div>
            </div>

            <div className="chart-card">
                <div className="chart-content">
                    <div className="axis-label y-axis-label">{step.yAxisLabel}</div>
                    <canvas id="lineChartCanvas" ref={canvasRef}></canvas>
                    <div className="axis-label x-axis-label">{step.xAxisLabel}</div>
                </div>

                <div className="overlay-badge">
                    <div className="badge-dot"></div>
                    <div className="badge-text">{step.badgeText}</div>
                </div>

                <div className="bottom-info">{step.bottomInfo}</div>
            </div>

            <div className="stats-container">
                <div className="stat-box">
                    <div className="stat-number">{step.stat1Number}</div>
                    <div className="stat-label">{step.stat1Label}</div>
                </div>
                <div className="stat-box">
                    <div className="stat-number">{step.stat2Number}</div>
                    <div className="stat-label">{step.stat2Label}</div>
                </div>
            </div>

            <button className="graph-btn" onClick={onNext}>{step.buttonText}</button>
        </div>
    );
}
