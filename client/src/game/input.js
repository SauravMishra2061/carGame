export function setupKeyboardInput(movePlayer, laneCount, keys, startJump, onJump) {
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      movePlayer('left', laneCount)
    }

    if (event.key === 'ArrowRight') {
      movePlayer('right', laneCount)
    }

    if (event.key === 'ArrowUp') {
      keys.up = true
    }

    if (event.key === 'ArrowDown') {
      keys.down = true
    }

    if (event.code === 'Space') {
      event.preventDefault()
      if (!event.repeat && startJump()) {
        onJump?.()
      }
    }
  }

  const handleKeyUp = (event) => {
    if (event.key === 'ArrowUp') {
      keys.up = false
    }

    if (event.key === 'ArrowDown') {
      keys.down = false
    }
  }

  window.addEventListener('keydown', handleKeyDown)

  window.addEventListener('keyup', handleKeyUp)

  return () => {
    window.removeEventListener('keydown', handleKeyDown)

    window.removeEventListener('keyup', handleKeyUp)
  }
}
