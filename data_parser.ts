/**
 * @file data_parser.js
 * @description This file contains the data parser for the showdown server.
 * @author Areeb Islam
 */

import PROJECT_CONFIG from './config';
import { parse } from 'path';
import querystring from 'querystring';

// const CONFIG = require('./config');
// const { parse } = require('path');
// const querystring = require('querystring');

const makeLoginRequest = async (url, headers, request_body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: querystring.stringify(request_body),
  });

  const jsonStr = await response.text();
  const json_obj = JSON.parse(jsonStr.substring(1));
  if (
    json_obj.curuser !== undefined &&
    json_obj.curuser.loggedin &&
    json_obj.assertion.slice(0, 2) !== ';;'
  ) {
    console.log('Successfully logged in! Response = ', json_obj);
    globalThis.Assertion = json_obj.assertion;
    globalThis.Connection.send(
      `|/trn ${process.env.USERNAME},0,${globalThis.Assertion}`
    );

    return { success: 'true' };
  } else {
    console.log('Failed to login! Response = ', json_obj);
    return { success: 'false' };
  }
};

const handleBattleRequest = (data) => {
  let test_str = data.utf8Data.split('\n')[1];
  console.log(test_str.indexOf('|request|') !== -1);
  // if (test_str.includes('|request|')) {
  //   test_str = JSON.parse(test_str.split('|request|')[1]);
  //   console.log("VALUE OF TEST_STR", test_str);
  // }
};

const ParseResponseData = (data) => {
  if (data.utf8Data === undefined) {
    return { success: 'false' };
  }

  if (data.utf8Data.includes('battle-gen9randombattle')) {
    return handleBattleRequest(data);
  }

  const new_data = data.utf8Data.split('\n');
  // Process the challstr (for user authentication)
  new_data.forEach((element) => {
    if (element.includes('challstr')) {
      const parsed_challstr = element.split('|');
      const challstr = `${parsed_challstr[2]}|${parsed_challstr[3]}`;
      // Once the challstr is found, send the login request
      const request_body = {
        act: 'login',
        name: process.env.USERNAME,
        pass: process.env.PASSWORD,
        challstr: challstr,
      };

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const url = 'https://play.pokemonshowdown.com/~~showdown/action.php';

      return makeLoginRequest(url, headers, request_body);
    }
  });

  return { success: 'false' };
};

export { ParseResponseData };
