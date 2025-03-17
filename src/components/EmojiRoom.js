import { ControlBar, ParticipantTile, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import * as faceapi from '@vladmandic/face-api';

export default function EmojiRoom({username, emoji}) {
  const trackRefs = useTracks([Track.Source.Camera]);
  const myCamTrackRef = trackRefs.find((trackRef) => trackRef.participant.identity === username);
  const emojis = [
    //   😀           😐            🙁           😮           😰           😡           🤢
    '\u{1F600}', '\u{1F610}',  '\u{1F641}', '\u{1F62E}', '\u{1F630}', '\u{1F621}', '\u{1F922}'
  ]
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if(emoji) {
      if (seconds > 0) {
        setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        // do bot shenanigans
        // return to waiting mode
      }
    }
  });

  // TODO record the video while on timer
  // TODO integrate with Bot Service with tensor flow to get the scores

  return (
    <div>
      <div style={{height: '50px',display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2vh', marginBottom: '2vh'}}>
        <span style={{display: 'flex', alignItems: 'center'}}>
          <span className="title">Match the emoji </span>
          <span style={{fontSize: '60px', marginLeft: '2rem'}}>{emoji}</span>
        </span>
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