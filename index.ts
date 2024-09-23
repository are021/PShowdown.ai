/**
 * @file index.js
 * @description This file contains the main entry point for the showdown server.
 * @author Areeb Islam
 */

import PROJECT_CONFIG from './config';
import { ParseResponseData } from './api';
import dotenv from 'dotenv';
import websocket from 'websocket';
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { Dex } from '@pkmn/dex';

dotenv.config();
var WebSocketClient = websocket.client;

var client = new WebSocketClient();

globalThis.Connection = null;

// TODO change this assertion from being a global variable to a function
globalThis.Assertion = null;

client.on('connectFailed', function (error) {
  console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
  globalThis.Connection = connection;
  connection.on('error', function (error) {
    console.log('Connection Error: ' + error.toString());
  });
  connection.on('close', function () {
    console.log('echo-protocol Connection Closed');
  });
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      ParseResponseData(message);
    }
  });
});

client.connect(PROJECT_CONFIG.url);

const app = express();
const server = http.createServer(app);
// Instantiates a websocket server
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws) => {
  PROJECT_CONFIG.clients.add(ws);
  console.log(
    'Connection Established with Client',
    PROJECT_CONFIG.clients.size
  );
  ws.on('message', (msg) => {
    if (msg.toString() !== '' && globalThis.Connection !== null) {
      globalThis.Connection.send(msg.toString());
    }
  });
  ws.on('close', () => {
    console.log('Connection Closed with Client');
    PROJECT_CONFIG.clients.delete(ws);
  });
});

// Send the pokemon type back to the user
app.post('/get_types', (req, res) => {
  const types = Dex.species.get(req.body.pokemon).types;
  types.map((type) => {
    return type.toLowerCase();
  });
  res.send(types);
});

server.listen(PROJECT_CONFIG.port, () => {
  console.log(`Server listening on port ${PROJECT_CONFIG.port}`);
});
