/**
 * @file data_parser.js
 * @description This file contains the data parser for the showdown server.
 * @author Areeb Islam
 */

import PROJECT_CONFIG from './config';
import { parse } from 'path';
import { LoginRequest } from './schemas/client_to_server';
import { processChallengeRequest, sendToClients } from './data_parser';

const makeLoginRequest = async (
  url: string,
  headers: { 'Content-Type': string },
  request_body: LoginRequest
) => {
  const params = new URLSearchParams(request_body as any); // Type assertion
  const url_params = params.toString();
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: url_params,
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

/**
 * Send back the battle request information to client
 * @param data request body
 */
const handleBattleRequest = async (data: any) => {
  const parsed_response: string = data.utf8Data.split('\n') || '';
  // Check if the response is for a battle request
  if (parsed_response.length == 2) {
    const battle_id = parsed_response[0] || '';
    let battle_data = parsed_response[1] || '';
    if (battle_data.includes('|request|')) {
      processChallengeRequest(battle_id, battle_data);
    }
  }
  else if (parsed_response.length > 2) {
    sendToClients(data.utf8Data);
  }
};

/**
 *
 * @param data Server response data
 * @returns JSON object indicating success or failure
 */
const ParseResponseData = (data: any) => {
  if (data.utf8Data === undefined) {
    return { success: 'false' };
  }

  // Send the battle information data back to the client
  if (data.utf8Data.includes('battle')) {
    return handleBattleRequest(data);
  }

  // Login Validation
  const new_data = data.utf8Data.split('\n');
  new_data.forEach((element: string) => {
    if (element.includes('challstr')) {
      const parsed_challstr = element.split('|');
      const challstr = `${parsed_challstr[2]}|${parsed_challstr[3]}`;
      // Once the challstr is found, send the login request
      const request_body: LoginRequest = {
        act: 'login',
        name: process.env.USERNAME || '',
        pass: process.env.PASSWORD || '',
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
