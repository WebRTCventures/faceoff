// server.js
const { v4: uuidv4 } = require('uuid');
const express = require('express')
const { AccessToken, RoomServiceClient } = require('livekit-server-sdk');
require("dotenv").config();

const createToken = async (participantName, roomName) => {
  // Limit the room to 4 peers
  // const roomService = new RoomServiceClient(livekitHost, 'api-key', 'secret-key');
  // const res = await roomService.listParticipants(roomName);

  // If this room doesn't exist, it'll be automatically created when the first
  // participant joins
  // Identifier to be used for participant.
  // It's available as LocalParticipant.identity with livekit-client SDK
  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: participantName,
    // Token to expire after 10 minutes
    ttl: '10m',
  });

  const room = roomName || uuidv4(); // TODO: see if I can use the session ID for this.
  console.log({at})
  at.addGrant({ roomJoin: true, room });

  return { token: await at.toJwt(), roomId: room };
};

const app = express();
const port = 3002;

app.get('/getToken', async (req, res) => {
  const userName = req.query.userName;
  const room = req.query.roomId;
  const { token, roomId } = await createToken(userName, room)
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Content-Type', 'application/json');
  // res.send(token);
  res.json({token, roomId});
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});