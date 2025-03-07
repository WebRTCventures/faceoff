import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  TrackLoop,
  useParticipants,
  useTracks,
} from '@livekit/components-react';

import '@livekit/components-styles';
import { waitFor } from '@testing-library/dom';
import { wait } from '@testing-library/user-event/dist/utils';

import { Track } from 'livekit-client';
import { useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { Link, useSearchParams } from 'react-router';
import { Tooltip } from 'react-tooltip';
// import { useParams } from 'react-router';

const serverUrl = 'wss://faceoff-kglh1sok.livekit.cloud';
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDEwOTc4MjYsImlzcyI6IkFQSVlhRkRpdEJoWlNiQyIsIm5hbWUiOiJ1c2VyMSIsIm5iZiI6MTc0MTA5NDIyNiwic3ViIjoidXNlcjEiLCJ2aWRlbyI6eyJyb29tIjoicm9vbSIsInJvb21Kb2luIjp0cnVlfX0.d1blAFrs2ixyE9CdHbHUgtqoYlvtXRG58zC-SdZTBZM';

export default function App({token, roomId, userOptions}) {
  return (
    <>
      <LiveKitRoom
        audio={userOptions.audioEnabled}
        video={userOptions.videoEnabled}
        token={token}
        serverUrl={serverUrl}
        // Use the default LiveKit theme for nice styles.
        data-lk-theme="default"
        style={{ height: '94vh' }}
      >
        {/* Your custom component with basic video conferencing functionality. */}
        <MyVideoConference roomId={roomId} />
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        <RoomAudioRenderer />
        {/* Controls for the user to start/stop audio, video, and screen
        share tracks and to leave the room. */}
        <ControlBar variation='verbose' />
      </LiveKitRoom>
    </>
  );
}

function MyVideoConference({roomId}) {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const participants = useParticipants();
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <div style={{ display: 'flex' }}>
      {participants.length === 1 && (
        <>
          <Tooltip id='tooltip' openOnClick={true} closeEvents={['mouseleave']} />
          <div style={{ background: '#E4DAD7', width: '840px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <button data-tooltip-id="tooltip" data-tooltip-content="Copied to clickbord" data-toggle='tooltip' title='teste' type='button' class='lk-button copy-link' onClick={() => {navigator.clipboard.writeText(`http://localhost:3000?roomId=${roomId}`)}}>Copy link to join</button>
          </div>
        </>
      )}
      <GridLayout tracks={tracks} style={{ height: 'calc(94vh - var(--lk-control-bar-height))' }}>
        {/* The GridLayout accepts zero or one child. The child is used
        as a template to render all passed in tracks. */}
        <ParticipantTile />
      </GridLayout>
    </div>
  );
}