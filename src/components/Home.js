import React, { useEffect, useState } from 'react';
import { LiveKitRoom, PreJoin } from "@livekit/components-react";
import { useSearchParams } from 'react-router';
import GameRoom from './GameRoom';

export default function Home() {
  const [token, setToken] = useState('');
  const [roomId, setRoomId] = useState('');
  const [userOptions, setUserOptions] = useState({});
  const [queryParameters] = useSearchParams()

  useEffect(() => {
    if(queryParameters.get('roomId')) {
      setRoomId(queryParameters.get('roomId'));
    }
  }, [queryParameters])

  function fetchToken(username) {
    fetch(`http://localhost:3002/getToken?userName=${username}&roomId=${roomId}`)
      .then(async (res) => {
        return res.json()
      })
      .then(({token, roomId, error}) => {
        if(error) {
          alert(error)
        } else {
          setToken(token)
          setRoomId(roomId)
        }
      })
  }

  function handleSubmit(userOptions) {
    setUserOptions(userOptions);
    fetchToken(userOptions.username);
  }

  return (
    <>
      { token ? (
        <LiveKitRoom
          audio={userOptions.audioEnabled}
          video={userOptions.videoEnabled}
          token={token}
          serverUrl={process.env.LIVEKIT_URL}
          data-lk-theme="default"
          style={{display: 'flex', width: '100%', backgroundColor: '#F5F5FA'}}
        >
          <GameRoom token={token} roomId={roomId} userOptions={userOptions} />
        </LiveKitRoom>
      ) : (
        <div className="home-container">
          <div>
            <h1
              style={{
                fontFamily: 'Dela Gothic One',
                fontSize: '80px',
                fontWeight: '400',
                alignContent: 'center',
                textAlign: 'center',
                color: '#2F1942',
                marginBottom: '-35px'
            }}
            >Get ready to</h1>
            <h1
              style={{
                fontFamily: 'Dela Gothic One',
                fontSize: '80px',
                fontWeight: '400',
                alignContent: 'center',
                textAlign: 'center',
                color: '#2F1942',
                marginTop: '0'
            }}
            >Face Off!</h1>
          </div>

          <div className="home-content">
          <PreJoin
              style={{width: '70%', marginTop: '50px'}}
              joinLabel="Join a Game"
              userLabel="Enter your name to continue"
              persistUserChoices={false}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      ) }
    </>
  )
}