import { drawCarSprite, drawWings } from './carSprites'

export const player = {
  lane: 2,
  lanePosition: 2,
  width: 50,
  height: 80,
  type: 'player',
  color: '#090b10',
  y: 580,
  speed: 300,
  isFlying: false,
  jumpHeight: 0,
  jumpVelocity: 0,
  jumpForwardRemaining: 0,
  flightTime: 0,
  jumpCount: 0,
  availableJumps: 0,
}

const initialPlayerState = { ...player }
const JUMP_VELOCITY = 620
const GRAVITY = 1400
const JUMP_FORWARD_DISTANCE = 60
const JUMP_DURATION = (2 * JUMP_VELOCITY) / GRAVITY
const LANE_CHANGE_SPEED = 6
export const MAX_JUMPS = 5

export function resetPlayer() {
  Object.assign(player, initialPlayerState)
}

export function movePlayer(direction, laneCount) {
  if (direction === 'left') {
    player.lane -= 1
  }

  if (direction === 'right') {
    player.lane += 1
  }

  if (player.lane < 0) {
    player.lane = 0
  }

  if (player.lane >= laneCount) {
    player.lane = laneCount - 1
  }
}

export function startJump() {
  if (player.isFlying || player.availableJumps <= 0) {
    return false
  }

  player.availableJumps -= 1
  player.isFlying = true
  player.jumpVelocity = JUMP_VELOCITY
  player.jumpForwardRemaining = JUMP_FORWARD_DISTANCE
  player.flightTime = 0
  player.jumpCount += 1
  return true
}

export function addJumpCharge() {
  if (player.availableJumps >= MAX_JUMPS) {
    return false
  }

  player.availableJumps += 1
  return true
}

export function updatePlayer(keys, deltaTime, canvasHeight) {
  const laneDistance = player.lane - player.lanePosition
  const laneStep = LANE_CHANGE_SPEED * deltaTime

  if (Math.abs(laneDistance) <= laneStep) {
    player.lanePosition = player.lane
  } else {
    player.lanePosition += Math.sign(laneDistance) * laneStep
  }

  if (player.isFlying) {
    player.flightTime += deltaTime
    player.jumpHeight += player.jumpVelocity * deltaTime
    player.jumpVelocity -= GRAVITY * deltaTime

    const forwardStep = Math.min(
      player.jumpForwardRemaining,
      (JUMP_FORWARD_DISTANCE * deltaTime) / JUMP_DURATION
    )
    player.y -= forwardStep
    player.jumpForwardRemaining -= forwardStep

    if (player.jumpHeight <= 0) {
      player.jumpHeight = 0
      player.jumpVelocity = 0
      player.jumpForwardRemaining = 0
      player.flightTime = 0
      player.isFlying = false
    }
  }

  if (keys.up) {
    player.y -= player.speed * deltaTime
  }

  if (keys.down) {
    player.y += player.speed * deltaTime
  }

  const topBoundary = 100
  const bottomBoundary = canvasHeight - 40

  if (player.y < topBoundary) {
    player.y = topBoundary
  }

  if (player.y + player.height > bottomBoundary) {
    player.y = bottomBoundary - player.height
  }
}

export function drawPlayer(ctx, laneWidth) {
  const x = player.lanePosition * laneWidth + laneWidth / 2 - player.width / 2
  const y = player.y - player.jumpHeight

  if (player.isFlying) {
    drawWings(
      ctx,
      x,
      y,
      player.width,
      player.height,
      player.flightTime,
      player.color
    )
  }

  drawCarSprite(ctx, player, x, y, 'away')
}

export function drawCrashAnimation(ctx, laneWidth, elapsedSeconds) {
  const progress = Math.min(elapsedSeconds / 0.9, 1)
  const centerX = player.lanePosition * laneWidth + laneWidth / 2
  const centerY = player.y + player.height / 2 + progress * 26
  const shake = Math.sin(elapsedSeconds * 75) * (1 - progress) * 7
  const rotation = progress * Math.PI * 2 + Math.sin(elapsedSeconds * 42) * (1 - progress) * 0.12

  if (progress < 0.45) {
    const flashProgress = progress / 0.45
    ctx.save()
    ctx.globalAlpha = 1 - flashProgress
    ctx.fillStyle = '#f97316'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 12 + flashProgress * 35, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fde047'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 6 + flashProgress * 18, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  if (progress > 0.12) {
    const smokeProgress = (progress - 0.12) / 0.88
    ctx.save()
    ctx.globalAlpha = (1 - smokeProgress) * 0.55
    ctx.fillStyle = '#94a3b8'
    for (let puff = 0; puff < 6; puff += 1) {
      const angle = (puff / 6) * Math.PI * 2
      const distance = 12 + smokeProgress * 34
      ctx.beginPath()
      ctx.arc(
        centerX + Math.cos(angle) * distance,
        centerY + Math.sin(angle) * distance,
        5 + smokeProgress * 7,
        0,
        Math.PI * 2
      )
      ctx.fill()
    }
    ctx.restore()
  }

  ctx.save()
  ctx.translate(centerX + shake, centerY)
  ctx.rotate(rotation)
  ctx.scale(1 - progress * 0.15, 1 - progress * 0.15)
  ctx.globalAlpha = 1 - progress * 0.35
  drawCarSprite(
    ctx,
    player,
    -player.width / 2,
    -player.height / 2,
    'away'
  )
  ctx.restore()

  if (progress < 0.85) {
    ctx.save()
    ctx.globalAlpha = 1 - progress / 0.85
    for (let spark = 0; spark < 10; spark += 1) {
      const angle = (spark / 10) * Math.PI * 2 + progress
      const innerDistance = 12 + progress * 24
      const outerDistance = innerDistance + 16 + progress * 24

      ctx.strokeStyle = spark % 2 === 0 ? '#fbbf24' : '#fb7185'
      ctx.lineWidth = 2 + (1 - progress) * 2
      ctx.beginPath()
      ctx.moveTo(
        centerX + Math.cos(angle) * innerDistance,
        centerY + Math.sin(angle) * innerDistance
      )
      ctx.lineTo(
        centerX + Math.cos(angle) * outerDistance,
        centerY + Math.sin(angle) * outerDistance
      )
      ctx.stroke()
    }
    ctx.restore()
  }
}
