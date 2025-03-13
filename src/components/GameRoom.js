import { useDataChannel, useParticipants } from "@livekit/components-react";
import VideoCall from "./VideoCall";
import Sidebar from "./Sidebar";
import { useState } from "react";
import EmojiRoom from "./EmojiRoom";

export default function GameRoom({token, roomId, userOptions}) {
  const [currentWinner, setCurrentWinner] = useState('-');
  const [gameState, setGameState] = useState('waiting');
  const [gameData, setGameData] = useState({
    gamesPlayed: 0,
    currentWinner
  })
  const [rounds, setRounds] = useState([[]]);

  const participants = useParticipants();
  // Send messages to all participants via the 'chat' topic.
  const { message: latestMessage, send } = useDataChannel("chat", (msg) =>{
    const decodedMsg = new TextDecoder("utf-8").decode(msg.payload)
    console.log("message received", decodedMsg)

    // here will have the messages for the scoring too
    if(decodedMsg === 'game started') {
      setGameState('playing');
    }
  });

  function startGame() {
    setGameState('playing');
    send(new TextEncoder().encode('game started'))
  }

  return (
    <>
      <div style={{width: '100%'}}>
        { gameState === 'waiting' && (
          <div style={{display: 'flex', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh'}}>
            <button id='start-game-button' type="button" disabled={participants.length <= 1} onClick={startGame}>
              Start a game
            </button>
          </div>
        ) }

        <div style={{ padding: '0 2rem 0 1rem' }}>
          { gameState === 'playing' && <EmojiRoom username={userOptions.username} /> }
          { gameState === 'waiting' && <VideoCall roomId={roomId} participants={participants} /> }
        </div>
      </div>

      <Sidebar currentWinner={currentWinner} gameData={gameData} rounds={rounds} />
    </>
  )
}