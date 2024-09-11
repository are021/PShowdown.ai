/**
 * @file data_parser.js
 * @description This file contains the data parser for the showdown server.
 * @author Areeb Islam
 */

const { parse } = require('path');
const querystring = require('querystring');

const makeRequest = async (url, headers, request_body) => {
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
    Assertion = json_obj.assertion;
    Connection.send(`|/trn ${process.env.USERNAME},0,${Assertion}`);
    return { success: 'true' };
  } else {
    console.log('Failed to login! Response = ', json_obj);
    return { success: 'false' };
  }
};

const ParseResponseData = (data) => {
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

      headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      url = 'https://play.pokemonshowdown.com/~~showdown/action.php';

      makeRequest(url, headers, request_body);
    }
  });
};

module.exports = {
  ParseResponseData: ParseResponseData,
};
