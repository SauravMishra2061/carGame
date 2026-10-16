export function checkCollision(player, trafficCars, laneWidth) {
  if (player.isFlying) {
    return false
  }

  return trafficCars.some((car) => {
    const playerTop = player.y
    const playerBottom = playerTop + player.height
    const playerLeft =
      player.lanePosition * laneWidth + laneWidth / 2 - player.width / 2
    const playerRight = playerLeft + player.width
    const trafficLeft = car.lane * laneWidth + laneWidth / 2 - car.width / 2
    const trafficRight = trafficLeft + car.width
    const trafficBottom = car.y + car.height

    const overlapsHorizontally =
      playerLeft < trafficRight && playerRight > trafficLeft
    const overlapsVertically = playerTop < trafficBottom && playerBottom > car.y

    return overlapsHorizontally && overlapsVertically
  })
}
