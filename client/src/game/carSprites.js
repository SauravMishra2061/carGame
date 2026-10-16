function drawRoundedRect(ctx, x, y, width, height, radius, color) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, radius)
  ctx.fill()
}

function drawWheels(ctx, x, y, width, height) {
  const wheelWidth = Math.max(5, width * 0.12)
  const wheelHeight = Math.max(12, height * 0.17)
  const wheelX = [x, x + width - wheelWidth]
  const wheelY = [y + height * 0.2, y + height * 0.67]

  ctx.fillStyle = '#111827'
  wheelY.forEach((wheelTop) => {
    wheelX.forEach((wheelLeft) => {
      drawRoundedRect(
        ctx,
        wheelLeft,
        wheelTop,
        wheelWidth,
        wheelHeight,
        wheelWidth / 2,
        '#111827'
      )
    })
  })
}

function drawWindows(ctx, x, y, width, height, type) {
  const inset = width * 0.2
  const windowWidth = width - inset * 2
  const glass = '#a5e9f7'

  if (type === 'truck' || type === 'largeTruck') {
    drawRoundedRect(ctx, x + inset, y + height * 0.1, windowWidth, height * 0.4, 5, '#d6dee8')
    drawRoundedRect(ctx, x + inset, y + height * 0.56, windowWidth, height * 0.22, 5, glass)
    return
  }

  if (type === 'pickup') {
    drawRoundedRect(ctx, x + inset, y + height * 0.12, windowWidth, height * 0.22, 5, '#52606c')
    drawRoundedRect(ctx, x + inset, y + height * 0.42, windowWidth, height * 0.3, 5, glass)
    drawRoundedRect(ctx, x + width * 0.13, y + height * 0.08, width * 0.74, height * 0.25, 4, '#795c43')
    return
  }

  if (type === 'sport') {
    drawRoundedRect(ctx, x + inset * 0.7, y + height * 0.16, windowWidth + inset * 0.6, height * 0.2, 5, '#52606c')
    drawRoundedRect(ctx, x + inset, y + height * 0.48, windowWidth, height * 0.25, 5, glass)
    return
  }

  drawRoundedRect(ctx, x + inset, y + height * 0.18, windowWidth, height * 0.25, 6, '#52606c')
  drawRoundedRect(ctx, x + inset, y + height * 0.48, windowWidth, height * 0.28, 6, glass)
}

export function drawWings(ctx, x, y, width, height, flightTime, carColor) {
  const flap = Math.sin(flightTime * 18)
  const centerX = x + width / 2
  const centerY = y + height * 0.48
  const span = width * (0.8 + Math.abs(flap) * 0.18)
  const angle = flap * 0.12

  ctx.save()
  for (const side of [-1, 1]) {
    ctx.save()
    ctx.translate(centerX + side * width * 0.18, centerY)
    ctx.scale(side, 1)
    ctx.rotate(angle * side)

    drawRoundedRect(ctx, -3, -height * 0.13, span * 0.36, height * 0.26, 4, '#334155')
    ctx.fillStyle = carColor
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, -height * 0.13)
    ctx.lineTo(span * 0.42, -height * 0.2)
    ctx.lineTo(span, -height * 0.1)
    ctx.lineTo(span * 0.82, height * 0.13)
    ctx.lineTo(span * 0.34, height * 0.1)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.strokeStyle = '#facc15'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(span * 0.2, -height * 0.09)
    ctx.lineTo(span * 0.82, -height * 0.04)
    ctx.stroke()

    ctx.fillStyle = '#1e293b'
    ctx.beginPath()
    ctx.arc(span * 0.83, 0, height * 0.09, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#94a3b8'
    ctx.beginPath()
    ctx.arc(span * 0.83, 0, height * 0.045, 0, Math.PI * 2)
    ctx.fill()

    drawRoundedRect(ctx, span * 0.14, -height * 0.045, span * 0.2, height * 0.09, 3, '#0f172a')
    ctx.fillStyle = '#38bdf8'
    ctx.globalAlpha = 0.7 + Math.abs(flap) * 0.3
    ctx.beginPath()
    ctx.ellipse(span * 0.12, 0, 4, height * 0.09, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.restore()
  }

  ctx.restore()
}

export function drawCarSprite(ctx, vehicle, x, y, facing = 'toward') {
  const { width, height, color, type } = vehicle
  const wheelWidth = Math.max(5, width * 0.12)
  const bodyX = x + wheelWidth * 0.35
  const bodyWidth = width - wheelWidth * 0.7

  ctx.save()
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)'
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + height * 0.52, width * 0.56, height * 0.47, 0, 0, Math.PI * 2)
  ctx.fill()

  drawWheels(ctx, x, y, width, height)
  drawRoundedRect(ctx, bodyX, y, bodyWidth, height, Math.min(12, width * 0.22), color)
  drawWindows(ctx, bodyX, y, bodyWidth, height, type)

  if (type === 'player') {
    drawRoundedRect(ctx, bodyX + bodyWidth * 0.43, y + height * 0.06, bodyWidth * 0.045, height * 0.82, 2, '#d4af37')
    drawRoundedRect(ctx, bodyX + bodyWidth * 0.525, y + height * 0.06, bodyWidth * 0.045, height * 0.82, 2, '#d4af37')
    for (const wheelTop of [y + height * 0.29, y + height * 0.755]) {
      for (const wheelLeft of [x, x + width - wheelWidth]) {
        ctx.fillStyle = '#d4af37'
        ctx.beginPath()
        ctx.arc(wheelLeft + wheelWidth / 2, wheelTop, wheelWidth * 0.2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  if (facing === 'toward') {
    const frontY = y + height * 0.84
    if (type === 'truck' || type === 'largeTruck') {
      drawRoundedRect(ctx, bodyX + bodyWidth * 0.12, frontY, bodyWidth * 0.76, height * 0.08, 3, '#374151')
      drawRoundedRect(ctx, bodyX + bodyWidth * 0.13, y + height * 0.77, bodyWidth * 0.17, height * 0.07, 3, '#fff2a6')
      drawRoundedRect(ctx, bodyX + bodyWidth * 0.7, y + height * 0.77, bodyWidth * 0.17, height * 0.07, 3, '#fff2a6')
    } else {
      drawRoundedRect(ctx, bodyX + bodyWidth * 0.14, y + height * 0.82, bodyWidth * 0.2, height * 0.08, 3, '#fff2a6')
      drawRoundedRect(ctx, bodyX + bodyWidth * 0.66, y + height * 0.82, bodyWidth * 0.2, height * 0.08, 3, '#fff2a6')
      drawRoundedRect(ctx, bodyX + bodyWidth * 0.2, frontY, bodyWidth * 0.6, height * 0.035, 2, '#263341')
    }
  } else {
    drawRoundedRect(ctx, bodyX + bodyWidth * 0.12, y + height * 0.83, bodyWidth * 0.19, height * 0.08, 3, '#ff4757')
    drawRoundedRect(ctx, bodyX + bodyWidth * 0.69, y + height * 0.83, bodyWidth * 0.19, height * 0.08, 3, '#ff4757')
    drawRoundedRect(ctx, bodyX + bodyWidth * 0.3, y + height * 0.86, bodyWidth * 0.4, height * 0.04, 2, '#243244')
  }

  if (type === 'pickup') {
    ctx.strokeStyle = '#d7b58d'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(bodyX + bodyWidth * 0.12, y + height * 0.37)
    ctx.lineTo(bodyX + bodyWidth * 0.88, y + height * 0.37)
    ctx.stroke()
  }

  ctx.restore()
}
