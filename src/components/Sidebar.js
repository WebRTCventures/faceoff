import { useEffect, useState } from 'react'
import medal from './../images/medal.png'

export default function Sidebar({gameData, rounds}) {
  const [reversedRounds, setReversedRounds] = useState([])

  useEffect(() => {
    setReversedRounds(rounds.slice().reverse())
  }, [rounds])

  return (
    <div className="sidebar">
      <div className="title">Scorecard</div>

      <div className="number-card">
        <div className="title">Games played</div>
        <div className="detail">{gameData.gamesPlayed}</div>
      </div>
      <div className="number-card">
        <div className="title">Current winner</div>
        <div className="detail">{gameData.currentWinner}</div>
      </div>

      { reversedRounds.map((round, index) => (
        round.length > 0 && (
          <span key={index}>
            <div className="title" style={{marginTop: '2rem'}}>
              Round {rounds.length - index}
            </div>

            {round.map((score, i) => (
              <div key={i} className='score-row'>
                <img id='medal-img' src={medal} />
                <span>{score.player}: {score.score}</span>
              </div>
            ))}
          </span>
        )
      ))}
    </div>
  )
}