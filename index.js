/**
 * @file index.js
 * @description This file contains the main entry point for the showdown server.
 * @author Areeb Islam
 */

// Establish a socket connection
const CONFIG = require('./config');
const DATA_PARSER = require('./data_parser');
const CLIENTS = CONFIG.client_set;
require('dotenv').config();

var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

global.Connection = null;

// TODO change this assertion from being a global variable to a function
global.Assertion = null;

client.on('connectFailed', function (error) {
  console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
  Connection = connection;
  connection.on('error', function (error) {
    console.log('Connection Error: ' + error.toString());
  });
  connection.on('close', function () {
    console.log('echo-protocol Connection Closed');
  });
  connection.on('message', function (message) {
    // Process the message into a json object
    if (message.type === 'utf8') {
      DATA_PARSER.ParseResponseData(message);
    }

    // Pass the client into the parsing function and then send the message to the python agent client
    // for (let client of CLIENTS) {
    //   // client.send(message.utf)
    // }
  });
});

client.connect(CONFIG.url);

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const WebSocket = require('ws');

// Instantiates a websocket server
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws) => {
  CONFIG.clients.add(ws);
  console.log('Connection Established with Client');
  ws.on('message', (msg) => {
    Connection.send(msg);
  });
  ws.on('close', () => {
    console.log('Connection Closed with Client');
  });
});

server.listen(CONFIG.port, () => {
  console.log(`Server listening on port ${CONFIG.port}`);
});
