import { ControlBar, ParticipantTile, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import * as faceapi from '@vladmandic/face-api';

export default function EmojiRoom({username, emoji, endGameFn}) {
  const trackRefs = useTracks([Track.Source.Camera]);
  const myCamTrackRef = trackRefs.find((trackRef) => trackRef.participant.identity === username);
  const [seconds, setSeconds] = useState(10);
  const [gamePlaying, setGamePlaying] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(true);
  const [isLoadingScore, setIsLoadingScore] = useState(false);

  const emojiMap = {
    '\u{1F600}': 'happy',
    '\u{1F610}': 'neutral',
    '\u{1F641}': 'sad',
    '\u{1F62E}': 'surprised',
    '\u{1F630}': 'fearful',
    '\u{1F621}': 'angry',
    '\u{1F922}': 'disgusted'
  }

  async function score() {
    if(faceapi.nets.faceExpressionNet.isLoaded) {
      const detectionsWithExpressions = await faceapi
        .detectSingleFace(document.getElementsByTagName('video')[0])
        .withFaceExpressions()

      const expressionMatch = detectionsWithExpressions?.expressions[emojiMap[emoji]]
      const score = Math.round(expressionMatch * 100) || 0
      const round = { player: username, score: score, emoji: emoji }
      endGameFn(round)
    }
  }

  useEffect(() => {
    if(emoji && gamePlaying && modelsLoaded) {
      if (seconds > 0) {
        setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setIsLoadingScore(true);
        score();
        setGamePlaying(false);
      }
    }
  });

  useEffect(() => {
    if(faceapi.nets.faceExpressionNet.isLoaded && faceapi.nets.ssdMobilenetv1.isLoaded){
      setModelsLoaded(true);
    }
  }, [faceapi.nets.faceExpressionNet.isLoaded, faceapi.nets.ssdMobilenetv1.isLoaded])

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/model');
      await faceapi.nets.faceExpressionNet.loadFromUri('/model');
    }

    loadModels();
  }, [])

  return (
    <div>
      <div style={{height: '50px',display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2vh', marginBottom: '2vh'}}>
        <span style={{display: 'flex', alignItems: 'center'}}>
          <span className="title">Match the emoji </span>
          <span style={{fontSize: '60px', marginLeft: '2rem'}}>{emoji}</span>
        </span>
        {isLoadingScore && <div className="title">Loading score...</div>}
        <span className="title">:{seconds}</span>
      </div>

      { myCamTrackRef && (
        <>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                borderRadius: '8px',
                height: 'calc(84vh - var(--lk-control-bar-height))',
                background: '#4937CD',
                width: '840px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '200px'
              }}>
              <div>{emoji}</div>
              <div style={{fontSize: '48px', fontFamily: 'Dela Gothic One', marginTop: '-50px'}}>:{seconds}</div>
            </div>

            <ParticipantTile trackRef={myCamTrackRef} style={{ height: 'calc(84vh - var(--lk-control-bar-height))', padding: '0' }} />
          </div>
          <ControlBar variation='verbose' />
        </>
      )}
    </div>
  )
}