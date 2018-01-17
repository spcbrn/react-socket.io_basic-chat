require('dotenv').config();

//------------DEPENDENCIES------------//

const express = require('express')
    , path = require('path')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , socket = require('socket.io')
    , db = require('./fake_db');

const app = express();

app.use(bodyParser.json());
app.use(cors());

//-----------------ENV----------------//

const port = process.env.PORT || 8042
    , app_url = process.env.REACT_APP_BASEURL;

//---------INITIALIZE SERVER----------//

/*
Add the socket transport to your server by passing the listening server into the imported `socket()` decorator.
(Side note: There is other syntax and patterning for this offered in the socket.io official docs.)
Store the reference to a new variable `io`.
*/
const io = socket(app.listen(port, () => console.log(`serving port ${port}`)));

//-----------------IO-----------------//

/*
When a socket connection is established with the client, a `connect` event opens the transport.
The channel state persists during the life of the connection, and gets destroyed when the connection is closed.
`io` represents the server's socket instance, and `socket` represents the individual client channel.
Write your event listeners inside the `connect` callback.
When the channel is closed, there will be a final 'disconnect' event.
*/
io.on('connect', socket => {
  console.log(`User connected on socket ${socket.id}`);
  io.to(socket.id).emit('get messages', { messages: db.messages })

  socket.on('new message', data => {
    db.messages.unshift(data);
    socket.broadcast.emit('get messages', { messages: db.messages })
  });

  socket.on('disconnect', () => console.log(`User disconnected from socket ${socket.id}`));
})

//----------------REST----------------//

app.get('/api/messages', (req, res) => {
  res.status(200).send(db.messages);
})

app.post('/api/newmessage', (req, res) => {
  db.messages.unshift(req.body);
  res.status(200).send(db.messages);
})
