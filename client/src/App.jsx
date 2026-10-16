import { useCallback, useState } from 'react'
import Game from './game/game'
import './App.css'

function App() {
  const [screen, setScreen] = useState('landing')
  const [gameOver, setGameOver] = useState(false)
  const [gameKey, setGameKey] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const handleCrash = useCallback((score) => {
    setFinalScore(score)
    setGameOver(true)
  }, [])

  const startGame = () => {
    setGameOver(false)
    setFinalScore(0)
    setGameKey((key) => key + 1)
    setScreen('game')
  }

  const returnToLanding = () => {
    setGameOver(false)
    setScreen('landing')
  }

  return (
    <main className="app-shell">
      {screen === 'landing' ? (
        <section className="landing-screen">
          <p className="eyebrow">ARCADE DRIVE</p>
          <h1>CarGame</h1>
          <p className="landing-copy">
            Dodge the traffic, switch lanes, and jump over cars to keep your run alive.
          </p>
          <button className="primary-button" onClick={startGame}>
            Start Game
          </button>
          <p className="control-hint">Left / Right move lanes | Space jump</p>
        </section>
      ) : (
        <section className="play-screen">
          <div className="game-toolbar">
            <button className="quiet-button" onClick={returnToLanding}>
              Back to menu
            </button>
            <p>Left / Right move | Space jump</p>
          </div>
          <Game key={gameKey} onCrash={handleCrash} />
          {gameOver && (
            <div className="game-over-backdrop" role="presentation">
              <section className="game-over-card" role="dialog" aria-modal="true" aria-labelledby="crash-title">
                <p className="eyebrow">RUN OVER</p>
                <h2 id="crash-title">You crashed</h2>
                <p className="final-score">Final score: {finalScore}</p>
                <p>Try another run and jump over the traffic.</p>
                <button className="primary-button" onClick={startGame}>
                  Play Again
                </button>
                <button className="quiet-button" onClick={returnToLanding}>
                  Back to menu
                </button>
              </section>
            </div>
          )}
        </section>
      )}
    </main>
  )
}

export default App
