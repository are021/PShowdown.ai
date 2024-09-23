import PROJECT_CONFIG from './config';
import { parse } from 'path';

export const processChallengeRequest = (
  battle_id: string,
  battle_data: string
) => {
  battle_data = battle_data.split('|request|')[1];
  // Check if battle_data is a valid JSON string
  let requestData;
  try {
    requestData = JSON.parse(battle_data);
  } catch (e) {
    console.error('Invalid JSON string:', battle_data);
    return; // Handle error appropriately
  }
  const response = {
    role : "server",
    battle_id: battle_id,
    request: requestData,
  };
  sendToClients(JSON.stringify(response));
};

export const sendToClients = (data: any) => {
  PROJECT_CONFIG.clients.forEach((client) => {
    if (client !== null) {
      client.send(data);
    }
  });
};
