export function drawRoad(ctx, canvasWidth, canvasHeight, laneCount, laneWidth) {
  ctx.fillStyle = '#333'

  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 4

  for (let i = 1; i < laneCount; i++) {
    const x = i * laneWidth

    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvasHeight)
    ctx.stroke()
  }
}
