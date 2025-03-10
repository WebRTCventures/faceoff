// server.js
const { v4: uuidv4 } = require('uuid');
const express = require('express')
const { AccessToken, RoomServiceClient } = require('livekit-server-sdk');
require("dotenv").config();

const createToken = async (participantName, room) => {
  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: participantName,
    // Token to expire after 10 minutes
    ttl: '10m',
  });

  at.addGrant({ roomJoin: true, room });
  console.log({at})

  return { token: await at.toJwt(), roomId: room };
}

const handleToken = async (participantName, roomName) => {
  const room = roomName || uuidv4(); // TODO: see if I can use the session ID for this.

  const roomService = new RoomServiceClient(process.env.LIVEKIT_HOST, process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET);
  roomService.listRooms().then((rooms) => {
    console.log('existing rooms', rooms);
  });

  if(roomName) { // room is already created
    const participants = await roomService.listParticipants(room)

    if(participants.length >= 4) {
      return { token: null, roomId: null, error: 'The room is full' }
    } else {
      return await createToken(participantName, room);
    }
  } else { // room is not created
    return await createToken(participantName, room); // create the first token and with it create the room
  }
};

const app = express();
const port = 3002;

app.get('/rooms',  async (req, res) => {
  const roomService = new RoomServiceClient(process.env.LIVEKIT_HOST, process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET);
  const rooms = await roomService.listRooms()

  console.log('existing rooms', rooms);
  res.status(200).json({rooms});
})

app.get('/getToken', async (req, res) => {
  const userName = req.query.userName;
  const room = req.query.roomId;
  const { token, roomId, error } = await handleToken(userName, room)
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Content-Type', 'application/json');

  if(error) {
    res.status(500).json({error});
  } else {
    res.json({token, roomId});
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});