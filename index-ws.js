const express = require('express');

const server = require('http').createServer();
const app = express();

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');

})

server.on('request', app);
server.listen(3000, function() {
    console.log('Server is running on port 3000');
})

/** Begin WebSocket */
const { Server : WebSocketServer, WebSocket} = require('ws');
const wss = new WebSocketServer({ server: server });

wss.on('connection', function connection(ws){
    console.log('Client connected');
    const numClients = wss.clients.size;
    console.log('Clients connected: ', numClients);

    wss.broadcast(`Current visitors: ${numClients}`);
    if(ws.readyState === WebSocket.OPEN){
        ws.send(`Welcome to the chat!`);
    }
    ws.on('close', function close() {
        wss.broadcast(`Current visitors: ${numClients - 1}`);
        console.log('Client disconnected');
    })
})
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    })
}