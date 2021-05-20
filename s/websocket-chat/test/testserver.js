#!/usr/bin/env node


/**
 *
 * Here's a short example showing a server that echos back anything sent to it, whether utf-8 or binary.
 * @type {function(*=): void}
 */

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer((request, response) => {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(200);
    response.end()
});

server.listen(8080, () => {
    console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

const originIsAllowed = () => {
    // logic here...
    return true;
}

wsServer.on("request", (req) => {


    console.log("****** Request Handler ********")

    if (!originIsAllowed(req.origin)) {
        req.reject();
        console.log((new Date()) + ' Connection from origin ' + req.origin + ' rejected.');
        return;
    }

    let connection = req.accept('echo-protocol', req.origin);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', (message) => {

        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        } else if (message.type === 'binary') {
            console.log('Received Message: ' + message.binaryData);
            connection.sendBytes(message.binaryData);
        }
    });


    connection.on('close', (reasonCode, description) => {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

});