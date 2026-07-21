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

process.on('SIGINT', () => {
    wss.clients.forEach(function each(client) {
        client.close();
    })
    server.close(() => {
        shutdownDB();
    })
})
wss.on('connection', function connection(ws){
    const numClients = wss.clients.size;
    console.log('Client connected', numClients);

    wss.broadcast(`Current visitors: ${numClients}`);
    if(ws.readyState === WebSocket.OPEN){
        ws.send(`Welcome to the chat!`);
    }
    db.run(`INSERT INTO visitors (count, time)
        VALUES (${numClients}, datetime('now'))    
    `);
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
/** end Websockets */

/** begin database */
const sqlite = require('sqlite3');

const db = new sqlite.Database(':memory:');

db.serialize(() => {
    db.run(`
        CREATE TABLE visitors (
            count INTEGER,
            time TEXT
        )    
    `)
})

function getCounts() {
    db.each('SELECT * FROM visitors', (err, row) => {
        console.log('row', row);
    })
}

function shutdownDB() {
    console.log('Shutting down db');
    getCounts();
    db.close();
}