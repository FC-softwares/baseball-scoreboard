require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');

const PORT = process.env.PORT;

app.use(express.static(__dirname + '/app'));

io.on('connection', (socket) => {
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
          console.log('user disconnected');
        });
        fs.readFile('./app/json/data.json', function(err, data) {
            if (err) throw err;
            const json = JSON.parse(data);
            io.emit('update',json)
        });
    });
});

server.listen(PORT, () => {
    console.log('listening on http://localhost:' + PORT);
});