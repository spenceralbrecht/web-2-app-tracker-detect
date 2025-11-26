import './style.css';
import './carousel.css';
import './news.css';
import './graph.css';
import { steps } from './data.js';

const app = document.querySelector('#app');
let currentStepIndex = 0;
let answers = {};

function render() {
    const step = steps[currentStepIndex];
    app.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'step-container';

    // Header / Progress could go here

    const content = document.createElement('div');
    content.className = 'content';

    if (step.type === 'intro') {
        renderIntro(step, content);
    } else if (step.type === 'question') {
        renderQuestion(step, content);
    } else if (step.type === 'results') {
        renderResults(step, content);
    } else if (step.type === 'features') {
        renderFeatures(step, content);
    } else if (step.type === 'carousel') {
        renderCarousel(step, content);
    } else if (step.type === 'news') {
        renderNews(step, content);
    } else if (step.type === 'graph') {
        renderGraph(step, content);
    }

    container.appendChild(content);
    app.appendChild(container);
}

function renderIntro(step, container) {
    const title = document.createElement('h1');
    title.textContent = step.title;

    const subtitle = document.createElement('p');
    subtitle.textContent = step.subtitle;

    const button = document.createElement('button');
    button.textContent = step.buttonText;
    button.className = 'primary-btn';
    button.onclick = nextStep;

    container.appendChild(title);
    container.appendChild(subtitle);
    container.appendChild(button);
}

function renderQuestion(step, container) {
    const title = document.createElement('h2');
    title.textContent = step.question;
    container.appendChild(title);

    if (step.subtitle) {
        const subtitle = document.createElement('p');
        subtitle.className = 'subtitle';
        subtitle.textContent = step.subtitle;
        container.appendChild(subtitle);
    }

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-grid';

    step.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        if (answers[step.id] && answers[step.id].includes(option.id)) {
            btn.classList.add('selected');
        }

        btn.innerHTML = `
      ${option.icon ? `<span class="icon">${option.icon === 'magnifying_glass' ? '🔍' : option.icon === 'shield' ? '🛡️' : option.icon === 'mobile' ? '📱' : option.icon}</span>` : ''}
      <div class="option-text">
        <span class="label">${option.label}</span>
        ${option.description ? `<span class="description">${option.description}</span>` : ''}
      </div>
      ${step.multiSelect ? '<span class="checkbox"></span>' : '<span class="arrow">›</span>'}
    `;

        btn.onclick = () => handleOptionClick(step, option.id);
        optionsContainer.appendChild(btn);
    });

    container.appendChild(optionsContainer);

    if (step.multiSelect) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.className = 'primary-btn';
        nextBtn.onclick = nextStep;
        // Disable if no selection? Clario allows empty? Let's assume at least one for now or just allow.
        // Clario seemed to allow empty or maybe not. Let's just enable it.
        container.appendChild(nextBtn);
    }
}

function handleOptionClick(step, optionId) {
    if (!answers[step.id]) {
        answers[step.id] = [];
    }

    if (step.multiSelect) {
        if (answers[step.id].includes(optionId)) {
            answers[step.id] = answers[step.id].filter(id => id !== optionId);
        } else {
            answers[step.id].push(optionId);
        }
        render(); // Re-render to update selection state
    } else {
        answers[step.id] = [optionId];
        nextStep(); // Auto advance for single select
    }
}

function renderResults(step, container) {
    const title = document.createElement('h2');
    title.textContent = step.title;

    // Display summary of what they chose?
    // The original app showed "Protect my personal data", "Hide my online activity" etc.
    // We can infer this from answers.

    const list = document.createElement('ul');
    list.className = 'results-list';

    // Simplified logic to show some results based on answers
    const summaryItems = [];
    if (answers['q1'] && answers['q1'].includes('personal_data')) summaryItems.push('Protect my personal data');
    if (answers['q1'] && answers['q1'].includes('online_activity')) summaryItems.push('Hide my online activity');
    // Add more mapping as needed

    if (summaryItems.length === 0) summaryItems.push('Protect your device'); // Fallback

    summaryItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });

    container.appendChild(title);
    container.appendChild(list);

    const button = document.createElement('button');
    button.textContent = step.buttonText;
    button.className = 'primary-btn';
    button.onclick = nextStep;
    container.appendChild(button);
}

function renderFeatures(step, container) {
    const title = document.createElement('h2');
    title.textContent = step.title;

    const desc = document.createElement('p');
    desc.textContent = step.description;

    container.appendChild(title);
    container.appendChild(desc);

    // This is where we stop as per instructions
}

function renderCarousel(step, container) {
    // Container styles handled by global CSS now

    container.className = 'carousel-container';
    container.innerHTML = `
    <div class="carousel-header">
      <div class="icon"></div> <!-- Placeholder for ic_shield with tint -->
      <h2>${step.headlineText}</h2>
      <p>${step.subheadlineText}</p>
    </div>
    
    <div class="carousel-viewport">
      <div class="carousel-track" id="carouselTrack">
        ${step.images.map(img => `
          <div class="carousel-slide">
            <img src="${img}" alt="Scan visualization" />
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="carousel-footer">
      <button class="carousel-btn" onclick="window.nextStep()">${step.buttonText}</button>
      <div class="carousel-time">${step.timeEstimate}</div>
    </div>
  `;

    // Auto advance logic
    let currentSlide = 0;
    const track = container.querySelector('#carouselTrack');
    const totalSlides = step.images.length;

    const interval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }, 2000); // Change slide every 2 seconds

    // Cleanup interval when moving away from this step? 
    // Simple way: attach to window or check if element exists
    window.currentCarouselInterval = interval;
}

function renderNews(step, container) {
    // Override container styles for this step to match dark theme
    document.body.style.backgroundColor = '#1C1B1F';
    const app = document.querySelector('#app');
    app.style.backgroundColor = '#1C1B1F';

    container.className = 'news-container';
    container.innerHTML = `
    <div class="news-header-card">
      <div class="news-label">${step.breakingNews}</div>
      <div class="news-title">${step.surgeTitle}</div>
      <div class="news-description">${step.surgeDescription}</div>
    </div>
    
    <div class="news-viewport" id="newsViewport">
      ${step.images.map((img, index) => `
        <div class="news-card ${index === 0 ? 'active' : 'next'}" data-index="${index}">
          <img src="${img}" alt="News Article ${index + 1}" />
        </div>
      `).join('')}
    </div>
    
    <div class="page-indicator" id="newsIndicator">
      ${step.images.map((_, index) => `
        <div class="indicator-dot ${index === 0 ? 'active' : ''}"></div>
      `).join('')}
    </div>
    
    <div class="news-fact">${step.fact}</div>
    
    <button class="news-btn" onclick="window.nextStep()">${step.buttonText}</button>
  `;

    // Z-axis Auto Advance Logic
    let currentIndex = 0;
    const cards = container.querySelectorAll('.news-card');
    const dots = container.querySelectorAll('.indicator-dot');
    const totalCards = cards.length;

    const updateCards = () => {
        cards.forEach((card, index) => {
            card.className = 'news-card'; // Reset

            // Calculate relative position
            // We want a stack effect: Active, Next, Next-2
            // Previous cards slide out to left

            if (index === currentIndex) {
                card.classList.add('active');
            } else if (index === (currentIndex + 1) % totalCards) {
                card.classList.add('next');
            } else if (index === (currentIndex + 2) % totalCards) {
                card.classList.add('next-2');
            } else {
                // For 3 cards, this covers all if we cycle. 
                // But generally, anything "before" current should be 'prev'
                // Since we cycle, we need to determine if it was just active.
                // Simple heuristic for 3 cards: the one before current is prev.
                const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
                if (index === prevIndex) {
                    card.classList.add('prev');
                } else {
                    card.classList.add('hidden');
                }
            }
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCards();
    }, 2500); // Slightly slower than carousel

    window.currentNewsInterval = interval;
}

function renderGraph(step, container) {
    // Override container styles for this step to match dark theme
    document.body.style.backgroundColor = '#1C1B1F';
    const app = document.querySelector('#app');
    app.style.backgroundColor = '#1C1B1F';

    container.className = 'graph-container';
    container.innerHTML = `
    <div class="graph-header-card">
      <div class="graph-header-label">${step.headerLabel}</div>
      <div class="graph-header-title">${step.headerTitle}</div>
    </div>
    
    <div class="chart-card">
      <div class="chart-content">
        <div class="axis-label y-axis-label">${step.yAxisLabel}</div>
        <canvas id="lineChartCanvas"></canvas>
        <div class="axis-label x-axis-label">${step.xAxisLabel}</div>
      </div>
      
      <div class="overlay-badge">
        <div class="badge-dot"></div>
        <div class="badge-text">${step.badgeText}</div>
      </div>
      
      <div class="bottom-info">${step.bottomInfo}</div>
    </div>
    
    <div class="stats-container">
      <div class="stat-box">
        <div class="stat-number">${step.stat1Number}</div>
        <div class="stat-label">${step.stat1Label}</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">${step.stat2Number}</div>
        <div class="stat-label">${step.stat2Label}</div>
      </div>
    </div>
    
    <button class="graph-btn" onclick="window.nextStep()">${step.buttonText}</button>
  `;

    // Canvas Animation Logic
    const canvas = container.querySelector('#lineChartCanvas');
    const ctx = canvas.getContext('2d');

    // Handle high DPI displays and sizing
    const dpr = window.devicePixelRatio || 1;

    // We need to ensure the canvas has a size before drawing
    // Use a ResizeObserver to handle layout changes and initial size
    const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            const rect = entry.contentRect;
            if (rect.width === 0 || rect.height === 0) return;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.resetTransform(); // Reset before scaling
            ctx.scale(dpr, dpr);

            // Re-calculate bounds based on new size
            const chartBounds = {
                left: 40,
                top: 20,
                right: rect.width - 20,
                bottom: rect.height - 40,
                width: rect.width - 60,
                height: rect.height - 60
            };

            // Restart animation or just redraw? 
            // If we are animating, the loop will pick up the new bounds if we update them globally or pass them.
            // For simplicity, let's restart the animation loop with new bounds.
            if (window.currentGraphAnimation) cancelAnimationFrame(window.currentGraphAnimation);
            startAnimation(ctx, rect, chartBounds);
        }
    });

    resizeObserver.observe(canvas);

    // Data Points
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

    function startAnimation(ctx, rect, chartBounds) {
        let startTime = null;
        const duration = 1800;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Overshoot interpolator approx
            const t = progress;
            const overshoot = (t) => {
                const tension = 0.8; // Match Kotlin 0.8f
                return (t - 1) * (t - 1) * ((tension + 1) * (t - 1) + tension) + 1;
            };
            const animationProgress = overshoot(progress);

            ctx.clearRect(0, 0, rect.width, rect.height);

            drawChartStructure(ctx, chartBounds, maxValue, dataPoints);

            if (animationProgress > 0) {
                drawAnimatedChart(ctx, chartBounds, maxValue, dataPoints, animationProgress);
            }

            if (progress < 1) {
                window.currentGraphAnimation = requestAnimationFrame(animate);
            }
        }

        window.currentGraphAnimation = requestAnimationFrame(animate);
    }
}

function drawChartStructure(ctx, bounds, maxValue, dataPoints) {
    // Grid
    ctx.strokeStyle = "#333333"; // Darker grid for dark theme
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 4; i++) {
        const y = bounds.top + (bounds.height / 4) * i;
        ctx.moveTo(bounds.left, y);
        ctx.lineTo(bounds.right, y);
    }
    ctx.stroke();

    // Axes
    ctx.strokeStyle = "#555555";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bounds.left, bounds.top);
    ctx.lineTo(bounds.left, bounds.bottom);
    ctx.lineTo(bounds.right, bounds.bottom);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = "#888888";
    ctx.font = "10px Arial";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
        const value = Math.round((maxValue / 4) * i / 1000) + "K";
        const y = bounds.bottom - (bounds.height / 4) * i;
        ctx.fillText(value, bounds.left - 5, y + 3);
    }

    // X-axis labels
    ctx.textAlign = "center";
    dataPoints.forEach((point, i) => {
        const x = bounds.left + (bounds.width / (dataPoints.length - 1)) * i;
        ctx.fillText(point.year, x, bounds.bottom + 15);
    });
}

function drawAnimatedChart(ctx, bounds, maxValue, dataPoints, progress) {
    const pointPositions = dataPoints.map((point, i) => ({
        x: bounds.left + (bounds.width / (dataPoints.length - 1)) * i,
        y: bounds.bottom - (point.value / maxValue) * bounds.height,
        color: point.color,
        displayValue: point.displayValue
    }));

    const totalPoints = dataPoints.length;
    // Clamp progress to valid range for point calculation
    // Note: progress can be > 1 due to overshoot, handle carefully
    const effectiveProgress = Math.min(Math.max(progress, 0), 1);

    const currentPoint = (effectiveProgress * (totalPoints - 1));
    const completePoints = Math.floor(currentPoint);
    const partialProgress = currentPoint - completePoints;

    // Path & Fill
    ctx.beginPath();
    ctx.moveTo(pointPositions[0].x, pointPositions[0].y);

    // Complete segments
    for (let i = 1; i <= Math.min(completePoints, totalPoints - 1); i++) {
        ctx.lineTo(pointPositions[i].x, pointPositions[i].y);
    }

    // Partial segment
    let lastX = pointPositions[Math.min(completePoints, totalPoints - 1)].x;
    let lastY = pointPositions[Math.min(completePoints, totalPoints - 1)].y;

    if (completePoints < totalPoints - 1) {
        const currentPos = pointPositions[completePoints];
        const nextPos = pointPositions[completePoints + 1];

        // Use easeOutQuart for smooth line drawing
        const eased = 1 - Math.pow(1 - partialProgress, 4);

        const interpX = currentPos.x + (nextPos.x - currentPos.x) * eased;
        const interpY = currentPos.y + (nextPos.y - currentPos.y) * eased;

        ctx.lineTo(interpX, interpY);
        lastX = interpX;
        lastY = interpY;
    }

    // Stroke
    ctx.strokeStyle = "#FF3030";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(255, 48, 48, 0.4)";
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow

    // Fill Gradient
    ctx.lineTo(lastX, bounds.bottom);
    ctx.lineTo(pointPositions[0].x, bounds.bottom);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, bounds.top, 0, bounds.bottom);
    gradient.addColorStop(0, "rgba(255, 48, 48, 0.4)");
    gradient.addColorStop(0.6, "rgba(255, 48, 48, 0.2)");
    gradient.addColorStop(1, "rgba(255, 48, 48, 0.05)");

    ctx.fillStyle = gradient;
    ctx.fill();

    // Points
    const pointDelay = 0.15;
    const easeOutBack = t => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    pointPositions.forEach((pos, i) => {
        const pointThreshold = (i / totalPoints) + pointDelay;

        if (progress >= pointThreshold) {
            let pointProgress = (progress - pointThreshold) / (1 - pointThreshold);
            pointProgress = Math.min(Math.max(pointProgress, 0), 1);

            // Scale animation
            let scale = 1;
            if (pointProgress < 1) {
                scale = easeOutBack(pointProgress);
            }

            const radius = 4 * scale;

            // Glow
            const glowGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2);
            glowGrad.addColorStop(0, "rgba(255, 48, 48, 0.6)");
            glowGrad.addColorStop(1, "rgba(255, 48, 48, 0)");
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius * 3, 0, Math.PI * 2);
            ctx.fill();

            // Main point
            ctx.fillStyle = pos.color;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            ctx.fill();

            // Inner white
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius * 0.6, 0, Math.PI * 2);
            ctx.fill();

            // Label
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
}

// Ensure nextStep clears interval
window.nextStep = function () {
    if (window.currentCarouselInterval) clearInterval(window.currentCarouselInterval);
    if (window.currentNewsInterval) clearInterval(window.currentNewsInterval);
    if (window.currentGraphAnimation) cancelAnimationFrame(window.currentGraphAnimation);
    // Note: ResizeObserver should ideally be disconnected too, but we didn't store it globally. 
    // It will be garbage collected when the DOM element is removed.

    if (currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        render();
    }
};

render();
