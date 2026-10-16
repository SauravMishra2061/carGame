import { drawCarSprite } from './carSprites'

const TRAFFIC_LANE_COUNT = 5
const TRAFFIC_SPACING = 170
const TRAFFIC_TYPES = [
  { type: 'small', width: 42, height: 64, speed: 225, color: '#34d399' },
  { type: 'sedan', width: 50, height: 80, speed: 200, color: '#38bdf8' },
  { type: 'pickup', width: 56, height: 96, speed: 185, color: '#f97316' },
  { type: 'truck', width: 60, height: 122, speed: 110, color: '#a78bfa' },
  { type: 'sport', width: 48, height: 72, speed: 300, color: '#fb456b' },
  { type: 'largeTruck', width: 76, height: 148, speed: 85, color: '#facc15' },
]
const TRAFFIC_TYPE_WEIGHTS = [25, 33, 18, 12, 10, 2]
const INITIAL_TRAFFIC_TYPES = [4, 0, 3, 2, 1]

function chooseTrafficType() {
  const totalWeight = TRAFFIC_TYPE_WEIGHTS.reduce((total, weight) => total + weight, 0)
  let choice = Math.random() * totalWeight

  for (let typeIndex = 0; typeIndex < TRAFFIC_TYPE_WEIGHTS.length; typeIndex += 1) {
    choice -= TRAFFIC_TYPE_WEIGHTS[typeIndex]
    if (choice < 0) return typeIndex
  }

  return TRAFFIC_TYPES.length - 1
}

function applyTrafficType(car, typeIndex) {
  const vehicleType = TRAFFIC_TYPES[typeIndex]
  car.typeIndex = typeIndex
  Object.assign(car, vehicleType)
}

export const trafficCars = Array.from({ length: TRAFFIC_LANE_COUNT }, (_, lane) => {
  const car = {
    lane,
    y: -100 - lane * TRAFFIC_SPACING,
    hasPassedPlayer: false,
  }

  applyTrafficType(car, INITIAL_TRAFFIC_TYPES[lane])
  return car
})

export function resetTraffic() {
  trafficCars.forEach((car, lane) => {
    car.lane = lane
    car.y = -100 - lane * TRAFFIC_SPACING
    car.hasPassedPlayer = false
    applyTrafficType(car, INITIAL_TRAFFIC_TYPES[lane])
  })
}

export function updateTraffic(
  deltaTime,
  canvasHeight,
  cars = trafficCars,
  speedMultiplier = 1,
  passLine = canvasHeight
) {
  let passedCars = 0

  cars.forEach((car) => {
    car.y += car.speed * speedMultiplier * deltaTime

    if (!car.hasPassedPlayer && car.y > passLine) {
      car.hasPassedPlayer = true
      passedCars += 1
    }

    if (car.y > canvasHeight) {
      applyTrafficType(car, chooseTrafficType())
      car.y = -car.height
      car.hasPassedPlayer = false
    }
  })

  return passedCars
}

export function drawTraffic(ctx, laneWidth, cars = trafficCars) {
  cars.forEach((car) => {
    const x = car.lane * laneWidth + laneWidth / 2 - car.width / 2

    drawCarSprite(ctx, car, x, car.y, 'toward')
  })
}
