import { useEffect, useRef, useState } from 'react'

import {
  drawPlayer,
  movePlayer,
  updatePlayer,
  startJump,
  resetPlayer,
  player,
  drawCrashAnimation,
  addJumpCharge,
  MAX_JUMPS,
} from './player'

import { drawRoad } from './road'

import { setupKeyboardInput } from './input'

import {
  updateTraffic,
  drawTraffic,
  resetTraffic,
  trafficCars,
} from './traffic'
import { checkCollision } from './collision'

function Game({ onCrash }) {
  const canvasRef = useRef(null)
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const [score, setScore] = useState(0)
  const [availableJumps, setAvailableJumps] = useState(0)
  const [carsTowardJump, setCarsTowardJump] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const canvasWidth = 500
    const canvasHeight = 700

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    resetPlayer()
    resetTraffic()

    const laneCount = 5
    const laneWidth = canvasWidth / laneCount

    const keys = {
      up: false,
      down: false,
    }

    const handleJump = () => {
      setAvailableJumps(player.availableJumps)
      setScore((currentScore) => currentScore + 25)
    }

    const cleanupKeyboardInput = setupKeyboardInput(
      movePlayer,
      laneCount,
      keys,
      startJump,
      handleJump
    )

    let lastTime = performance.now()
    const gameStartTime = lastTime
    let lastSpeedDisplaySecond = 0
    let animationFrameId
    let isRunning = true
    let crashStartedAt = null
    let runScore = 0
    let carsPassedTowardJump = 0
    const gameLoop = (currentTime) => {
      if (!isRunning) {
        return
      }

      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.05)

      lastTime = currentTime

      if (crashStartedAt === null) {
        updatePlayer(keys, deltaTime, canvasHeight)

        const elapsedSeconds = (currentTime - gameStartTime) / 1000
        const currentSpeedMultiplier = Math.min(1 + elapsedSeconds / 60, 2.5)
        const elapsedWholeSeconds = Math.floor(elapsedSeconds)
        runScore = Math.floor(elapsedSeconds * 10) + player.jumpCount * 25

        const passedCars = updateTraffic(
          deltaTime,
          canvasHeight,
          trafficCars,
          currentSpeedMultiplier,
          player.y + player.height
        )
        carsPassedTowardJump += passedCars

        if (passedCars > 0) {
          while (carsPassedTowardJump >= 5) {
            carsPassedTowardJump -= 5
            if (addJumpCharge()) {
              setAvailableJumps(player.availableJumps)
            }
          }

          setCarsTowardJump(carsPassedTowardJump)
        }

        if (elapsedWholeSeconds > lastSpeedDisplaySecond) {
          lastSpeedDisplaySecond = elapsedWholeSeconds
          setSpeedMultiplier(currentSpeedMultiplier)
          setScore(runScore)
        }

        if (checkCollision(player, trafficCars, laneWidth)) {
          setScore(runScore)
          setAvailableJumps(player.availableJumps)
          crashStartedAt = currentTime
        }
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      drawRoad(ctx, canvasWidth, canvasHeight, laneCount, laneWidth)

      drawTraffic(ctx, laneWidth, trafficCars)

      if (crashStartedAt === null) {
        drawPlayer(ctx, laneWidth)
      } else {
        const crashElapsed = (currentTime - crashStartedAt) / 1000
        drawCrashAnimation(ctx, laneWidth, crashElapsed)

        if (crashElapsed >= 0.9) {
          isRunning = false
          onCrash?.(runScore)
          return
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop)
    }

    animationFrameId = requestAnimationFrame(gameLoop)

    return () => {
      isRunning = false
      cancelAnimationFrame(animationFrameId)
      cleanupKeyboardInput()
    }
  }, [onCrash])

  return (
    <div className="game-canvas-wrap">
      <div className="game-hud" aria-live="polite">
        <p>Score <strong>{score}</strong></p>
        <p>Jumps <strong>{availableJumps}/{MAX_JUMPS}</strong></p>
        <p>Speed <strong>{speedMultiplier.toFixed(1)}×</strong></p>
      </div>
      <p className="jump-hint">
        {availableJumps === MAX_JUMPS
          ? 'Jump stock full'
          : `Cars passed: ${carsTowardJump}/5`}
      </p>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Game
