// src/components/VideoConference.js

import React from 'react';

import {
  GridLayout,
  ParticipantTile,
  useTracks,
} from '@livekit/components-react';

import '@livekit/components-styles';
import { Track } from 'livekit-client';

export default function VideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(84vh - var(--lk-control-bar-height))', padding: '0' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}