const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/editor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Document = mongoose.model('Document', {
  content: String,
});

let currentContent = '';

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.emit('doc-update', currentContent);

  socket.on('doc-change', async (data) => {
    currentContent = data;
    io.emit('doc-update', data);

    // Save to DB (optional for now)
    await Document.findOneAndUpdate({}, { content: data }, { upsert: true });
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(3001, () => console.log('Server running on port 3001'));
