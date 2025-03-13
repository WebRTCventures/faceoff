import { ControlBar, ParticipantTile, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";

export default function EmojiRoom({username}) {
  const trackRefs = useTracks([Track.Source.Camera]);
  const myCamTrackRef = trackRefs.find((trackRef) => trackRef.participant.identity === username);

  return (
    <div>
      { myCamTrackRef && (
        <>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                borderRadius: '8px',
                height: 'calc(84vh - var(--lk-control-bar-height))',
                background: '#E4DAD7',
                width: '840px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'DM Mono'
              }}>
              EMOJI
            </div>

            <ParticipantTile trackRef={myCamTrackRef} style={{ height: 'calc(84vh - var(--lk-control-bar-height))', padding: '0' }} />
          </div>
          <ControlBar variation='verbose' />
        </>
      )}
    </div>
  )
}