import { useDataChannel, useParticipants } from "@livekit/components-react";
import VideoCall from "./VideoCall";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import EmojiRoom from "./EmojiRoom";

export default function GameRoom({token, roomId, userOptions}) {
  const [gameState, setGameState] = useState('waiting');
  const [currentEmoji, setCurrentEmoji] = useState(null);
  const [gameData, setGameData] = useState({
    gamesPlayed: 0,
    currentWinner: '-'
  })
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState([]);

  const participants = useParticipants();
  // Send messages to all participants via the 'chat' topic.
  const { message: latestMessage, send } = useDataChannel("chat", (msg) =>{
    const decodedMsg = new TextDecoder("utf-8").decode(msg.payload)
    console.log("message received", decodedMsg)

    // here will have the messages for the scoring too
    if(decodedMsg === 'game started') {
      setGameState('playing');
    } else if(JSON.parse(decodedMsg)['emoji']) {
      setCurrentEmoji(JSON.parse(decodedMsg)['emoji'])
    } else if(JSON.parse(decodedMsg)['round']) {
      setCurrentRound([...currentRound, JSON.parse(decodedMsg)['round']])
    }
  });

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  function startGame() {
    const usedEmojis = rounds.map((round) => round.map((score) => score.emoji)).flat().filter(onlyUnique)
    fetch(`http://localhost:3002/getEmoji?roomId=${roomId}&usedEmojis=${usedEmojis}`)
    setGameState('playing');
    send(new TextEncoder().encode('game started'))
  }

  function endGame(round) {
    setCurrentRound([...currentRound, round])
    const strData = JSON.stringify({round})
    send(new TextEncoder().encode(strData))
  }

  function calculateWinner() {
    const winner = currentRound.reduce((acc, round) => {
      if(round.score > acc.score) {
        return round
      } else {
        return acc
      }
    }, {score: 0})

    return winner.player
  }

  function buttonLabel() {
    if(rounds.length === 0 || rounds.length == 6) {
      return 'Start a game'
    } else if(rounds.length > 0) {
      return `Start round ${rounds.length + 1}`
    }
  }

  useEffect(() => {
    if(currentRound.length === participants.length) {
      setRounds([...rounds, currentRound])
      const winner = calculateWinner()
      setCurrentRound([])
      setGameData({ gamesPlayed: gameData.gamesPlayed + 1, currentWinner: winner })
      setGameState('waiting');
    }
  }, [currentRound])

  return (
    <>
      <div style={{width: '100%'}}>
        { gameState === 'waiting' && (
          <div style={{display: 'flex', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh'}}>
            <button id='start-game-button' type="button" disabled={participants.length <= 1 || rounds.length == 6} onClick={startGame}>
              {buttonLabel()}
            </button>
          </div>
        ) }

        <div style={{ padding: '0 2rem 0 1rem' }}>
          { gameState === 'playing' && <EmojiRoom username={userOptions.username} emoji={currentEmoji} endGameFn={endGame} /> }
          { gameState === 'waiting' && <VideoCall roomId={roomId} participants={participants} /> }
        </div>
      </div>

      <Sidebar gameData={gameData} rounds={rounds} />
    </>
  )
}