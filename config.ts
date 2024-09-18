/**
 * @file config.js
 * @description This file contains the configuration for the showdown server.
 * @author Areeb Islam
 */


const PROJECT_CONFIG = {
    'url': 'wss://sim3.psim.us/showdown/websocket',
    'format': '[Gen 9] Random Battle',
    'challenger': 'pshowdown.ai',
    'clients': new Set(),
    'port': 8000
};


export default PROJECT_CONFIG;