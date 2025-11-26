package com.dylan.airtag.detector.ui.onboarding

import android.animation.ValueAnimator
import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.view.View
import android.view.animation.OvershootInterpolator
import kotlin.math.min
import kotlin.math.pow
import kotlin.math.sin

class AnimatedLineChartView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private val linePaint = Paint().apply {
        isAntiAlias = true
        strokeCap = Paint.Cap.ROUND
        strokeJoin = Paint.Join.ROUND
        style = Paint.Style.STROKE
    }

    private val fillPaint = Paint().apply {
        isAntiAlias = true
        style = Paint.Style.FILL
    }

    private val textPaint = Paint().apply {
        isAntiAlias = true
        textAlign = Paint.Align.CENTER
        typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
    }

    private val labelPaint = Paint().apply {
        isAntiAlias = true
        textAlign = Paint.Align.CENTER
    }

    private val gridPaint = Paint().apply {
        isAntiAlias = true
        style = Paint.Style.STROKE
        strokeWidth = 1.5f
        color = Color.parseColor("#E8E8E8")
    }

    private val axisPaint = Paint().apply {
        isAntiAlias = true
        style = Paint.Style.STROKE
        strokeWidth = 2f
        color = Color.parseColor("#CCCCCC")
    }

    private val shadowPaint = Paint().apply {
        isAntiAlias = true
        maskFilter = BlurMaskFilter(8f, BlurMaskFilter.Blur.NORMAL)
    }

    private val path = Path()
    private val fillPath = Path()

    // Enhanced data with better progression
    private val dataPoints = listOf(
        DataPoint(2019, 1500f, "#2196F3", "1.5K"),
        DataPoint(2020, 2100f, "#4CAF50", "2.1K"),
        DataPoint(2021, 3200f, "#FFC107", "3.2K"),
        DataPoint(2022, 5000f, "#FF9800", "5.0K"),
        DataPoint(2023, 6500f, "#FF5722", "6.5K"),
        DataPoint(2024, 7800f, "#E91E63", "7.8K"),
        DataPoint(2025, 8500f, "#FF3030", "8.5K")
    )

    private var animationProgress = 0f
    private var valueAnimator: ValueAnimator? = null

    // Precomputed positions and values
    private val pointPositions = mutableListOf<PointF>()
    private var chartBounds = RectF()
    private var maxValue = 10000f

    private lateinit var gradient: LinearGradient
    private lateinit var glowGradient: RadialGradient

    init {
        setLayerType(LAYER_TYPE_SOFTWARE, null)
        // Start animation immediately when view is created
        post { startAnimation() }
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        setupChart()
    }

    private fun setupChart() {
        val width = width.toFloat()
        val height = height.toFloat()
        val padding = 80f

        chartBounds = RectF(
            padding,
            padding * 0.8f,
            width - padding,
            height - padding * 1.8f
        )

        precomputePositions()
        setupGradients()
    }

    private fun precomputePositions() {
        pointPositions.clear()
        val chartWidth = chartBounds.width()
        val chartHeight = chartBounds.height()

        dataPoints.forEachIndexed { i, point ->
            val x = chartBounds.left + (chartWidth / (dataPoints.size - 1)) * i
            val y = chartBounds.bottom - (point.value / maxValue) * chartHeight
            pointPositions.add(PointF(x, y))
        }
    }

    private fun setupGradients() {
        // Main fill gradient
        gradient = LinearGradient(
            0f, chartBounds.top, 0f, chartBounds.bottom,
            intArrayOf(
                Color.parseColor("#40FF3030"),
                Color.parseColor("#20FF3030"),
                Color.parseColor("#05FF3030")
            ),
            floatArrayOf(0f, 0.6f, 1f),
            Shader.TileMode.CLAMP
        )

        // Glow effect for points
        glowGradient = RadialGradient(
            0f, 0f, 20f,
            intArrayOf(
                Color.parseColor("#60FF3030"),
                Color.parseColor("#20FF3030"),
                Color.parseColor("#00FF3030")
            ),
            floatArrayOf(0f, 0.7f, 1f),
            Shader.TileMode.CLAMP
        )
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        // Always draw the complete chart structure first
        drawChartStructure(canvas)

        // Then draw animated data
        if (animationProgress > 0f && pointPositions.isNotEmpty()) {
            drawAnimatedChart(canvas)
        }
    }

    private fun drawChartStructure(canvas: Canvas) {
        // Draw subtle grid
        for (i in 0..4) {
            val y = chartBounds.top + (chartBounds.height() / 4) * i
            canvas.drawLine(chartBounds.left, y, chartBounds.right, y, gridPaint)
        }

        // Draw main axes
        canvas.drawLine(chartBounds.left, chartBounds.top, chartBounds.left, chartBounds.bottom, axisPaint)
        canvas.drawLine(chartBounds.left, chartBounds.bottom, chartBounds.right, chartBounds.bottom, axisPaint)

        // Draw Y-axis labels (values)
        labelPaint.apply {
            color = Color.parseColor("#888888")
            textSize = 24f
            textAlign = Paint.Align.RIGHT
        }

        for (i in 0..4) {
            val value = (maxValue / 4) * i / 1000f // Convert to K
            val y = chartBounds.bottom - (chartBounds.height() / 4) * i
            canvas.drawText("${value.toInt()}K", chartBounds.left - 20f, y + 8f, labelPaint)
        }

        // Draw X-axis labels (years) - always visible
        labelPaint.apply {
            color = Color.parseColor("#666666")
            textSize = 28f
            textAlign = Paint.Align.CENTER
        }

        pointPositions.forEachIndexed { i, position ->
            canvas.drawText(
                dataPoints[i].year.toString(),
                position.x,
                chartBounds.bottom + 40f,
                labelPaint
            )
        }
    }

    private fun drawAnimatedChart(canvas: Canvas) {
        // Calculate how much of the chart to show
        val totalPoints = dataPoints.size
        val currentPoint = (animationProgress * (totalPoints - 1)).coerceAtMost(totalPoints - 1f)
        val completePoints = currentPoint.toInt()
        val partialProgress = currentPoint - completePoints

        // Create animated path
        path.reset()
        fillPath.reset()

        if (completePoints >= 0 && pointPositions.isNotEmpty()) {
            // Start paths
            val startPoint = pointPositions[0]
            path.moveTo(startPoint.x, startPoint.y)
            fillPath.moveTo(startPoint.x, chartBounds.bottom)
            fillPath.lineTo(startPoint.x, startPoint.y)

            // Add complete segments
            for (i in 1..min(completePoints, pointPositions.size - 1)) {
                val point = pointPositions[i]
                path.lineTo(point.x, point.y)
                fillPath.lineTo(point.x, point.y)
            }

            // Add partial segment with smooth easing
            if (completePoints < pointPositions.size - 1 && partialProgress > 0) {
                val currentPos = pointPositions[completePoints]
                val nextPos = pointPositions[completePoints + 1]

                val easedProgress = easeOutQuart(partialProgress)
                val interpolatedX = currentPos.x + (nextPos.x - currentPos.x) * easedProgress
                val interpolatedY = currentPos.y + (nextPos.y - currentPos.y) * easedProgress

                path.lineTo(interpolatedX, interpolatedY)
                fillPath.lineTo(interpolatedX, interpolatedY)
            }

            // Close fill path
            val lastX = if (completePoints < pointPositions.size - 1 && partialProgress > 0) {
                val currentPos = pointPositions[completePoints]
                val nextPos = pointPositions[completePoints + 1]
                val easedProgress = easeOutQuart(partialProgress)
                currentPos.x + (nextPos.x - currentPos.x) * easedProgress
            } else {
                pointPositions[min(completePoints, pointPositions.size - 1)].x
            }

            fillPath.lineTo(lastX, chartBounds.bottom)
            fillPath.close()

            // Draw gradient fill
            fillPaint.shader = gradient
            canvas.drawPath(fillPath, fillPaint)
            fillPaint.shader = null

            // Draw main line with glow effect
            drawGlowingLine(canvas)

            // Draw animated points and labels
            drawAnimatedPoints(canvas)
        }
    }

    private fun drawGlowingLine(canvas: Canvas) {
        // Draw glow effect
        shadowPaint.apply {
            color = Color.parseColor("#40FF3030")
            strokeWidth = 8f
            style = Paint.Style.STROKE
        }
        canvas.drawPath(path, shadowPaint)

        // Draw main line
        linePaint.apply {
            strokeWidth = 4f
            color = Color.parseColor("#FF3030")
            style = Paint.Style.STROKE
            shader = null
        }
        canvas.drawPath(path, linePaint)
    }

    private fun drawAnimatedPoints(canvas: Canvas) {
        val pointDelay = 0.15f

        pointPositions.forEachIndexed { i, position ->
            val pointThreshold = (i.toFloat() / pointPositions.size) + pointDelay

            if (animationProgress >= pointThreshold) {
                val pointProgress = ((animationProgress - pointThreshold) / (1f - pointThreshold))
                    .coerceIn(0f, 1f)

                // Bouncy scale animation
                val scale = if (pointProgress < 1f) {
                    val bounce = sin(pointProgress * kotlin.math.PI * 1.5) *
                            (1f - pointProgress).pow(1.5f) * 0.4f
                    easeOutBack(pointProgress) + bounce
                } else 1f

                val radius = 10f * scale.toFloat()
                val innerRadius = 6f * scale.toFloat()

                // Draw point glow
                val glowMatrix = Matrix()
                glowMatrix.setTranslate(position.x, position.y)
                glowGradient.setLocalMatrix(glowMatrix)

                fillPaint.shader = glowGradient
                canvas.drawCircle(position.x, position.y, radius * 1.8f, fillPaint)
                fillPaint.shader = null

                // Draw main point
                fillPaint.color = Color.parseColor(dataPoints[i].color)
                canvas.drawCircle(position.x, position.y, radius, fillPaint)

                // Draw inner white circle
                fillPaint.color = Color.WHITE
                canvas.drawCircle(position.x, position.y, innerRadius, fillPaint)

                // Draw animated value label
                if (pointProgress > 0.3f) {
                    val labelProgress = ((pointProgress - 0.3f) / 0.7f).coerceIn(0f, 1f)
                    val slideOffset = (1f - easeOutCubic(labelProgress)) * 25f
                    val labelAlpha = (255 * labelProgress).toInt()

                    textPaint.apply {
                        color = Color.parseColor(dataPoints[i].color)
                        alpha = labelAlpha
                        textSize = 26f
                        typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                    }

                    canvas.drawText(
                        dataPoints[i].displayValue,
                        position.x,
                        position.y - 25f - slideOffset,
                        textPaint
                    )
                }
            }
        }

        textPaint.alpha = 255
    }

    // Enhanced easing functions
    private fun easeOutQuart(t: Float): Float = 1f - (1f - t).pow(4)

    private fun easeOutCubic(t: Float): Float = 1f - (1f - t).pow(3)

    private fun easeOutBack(t: Float): Float {
        val c1 = 1.70158f
        val c3 = c1 + 1f
        return 1f + c3 * (t - 1f).pow(3) + c1 * (t - 1f).pow(2)
    }

    fun startAnimation() {
        // Cancel any existing animation
        valueAnimator?.cancel()

        valueAnimator = ValueAnimator.ofFloat(0f, 1f).apply {
            duration = 1800 // Faster, smoother duration
            interpolator = OvershootInterpolator(0.8f) // Slight overshoot for liveliness
            addUpdateListener { animation ->
                animationProgress = animation.animatedValue as Float
                invalidate()
            }
            start()
        }
    }

    fun resetAnimation() {
        valueAnimator?.cancel()
        animationProgress = 0f
        invalidate()
        postDelayed({ startAnimation() }, 100)
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        // No delay - start immediately
        if (animationProgress == 0f) {
            startAnimation()
        }
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        valueAnimator?.cancel()
    }

    data class DataPoint(
        val year: Int,
        val value: Float,
        val color: String,
        val displayValue: String
    )
}