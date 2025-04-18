// src/components/VideoCall.js

import React from 'react';
import {
  ControlBar,
  RoomAudioRenderer,
  useParticipants,
} from '@livekit/components-react';

import '@livekit/components-styles';
import VideoConference from './VideoConference';
import { Tooltip } from 'react-tooltip';

export default function VideoCall({roomId}) {
  const participants = useParticipants();
  return (
    <div>
      <div style={{ display: 'flex' }}>
        {participants.length === 1 && (
          <>
            <Tooltip id='tooltip' openOnClick={true} closeEvents={['mouseleave']} />
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
              <button
                data-tooltip-id="tooltip"
                data-tooltip-content="Copied to clickbord"
                data-toggle='tooltip'
                type='button'
                className='lk-button copy-link'
                onClick={() => {navigator.clipboard.writeText(`${window.location.origin}?roomId=${roomId}`)}}
              >
                Copy link to join
              </button>
            </div>
          </>
        )}

        <VideoConference />
      </div>
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
      <ControlBar variation='verbose' />
    </div>
  );
}