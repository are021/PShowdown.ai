/**
 * @file index.js
 * @description This file contains the main entry point for the showdown server.
 * @author Areeb Islam
 */

// Establish a socket connection
const CONFIG = require('./config');
const DATA_PARSER = require('./data_parser');
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
    console.log(message);
  });
});

client.connect(CONFIG.url);
