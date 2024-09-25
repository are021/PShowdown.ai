/**
 * @file config.js
 * @description This file contains the configuration for the showdown server.
 * @author Areeb Islam
 */

import WebSocket from 'ws';

const PROJECT_CONFIG = {
  url: 'wss://sim3.psim.us/showdown/websocket',
  format: '[Gen 9] Random Battle',
  challenger: 'pshowdown.ai',
  clients: new Set<WebSocket>(),
  port: 8000,
  sample_team: `
  Landorus-Therian @ Rocky Helmet  
Ability: Intimidate  
Tera Type: Dragon  
EVs: 252 HP / 4 SpA / 252 Spe  
Timid Nature  
- Earth Power  
- U-turn  
- Stealth Rock  
- Taunt  

Zamazenta @ Leftovers  
Ability: Dauntless Shield  
Tera Type: Fire  
EVs: 252 HP / 80 Def / 176 Spe  
Jolly Nature  
- Iron Defense  
- Body Press  
- Roar  
- Crunch  

Raging Bolt @ Booster Energy  
Ability: Protosynthesis  
Tera Type: Fairy  
EVs: 4 HP / 252 SpA / 252 Spe  
Modest Nature  
IVs: 20 Atk  
- Calm Mind  
- Thunderbolt  
- Thunderclap  
- Dragon Pulse  

Darkrai @ Heavy-Duty Boots  
Ability: Bad Dreams  
Tera Type: Poison  
EVs: 252 SpA / 4 SpD / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Will-O-Wisp  
- Dark Pulse  
- Ice Beam  
- Sludge Bomb  

Gholdengo @ Air Balloon  
Ability: Good as Gold  
Tera Type: Fairy  
EVs: 252 HP / 196 Def / 60 Spe  
Bold Nature  
- Hex  
- Thunder Wave  
- Recover  
- Make It Rain  

Dragonite @ Heavy-Duty Boots  
Ability: Multiscale  
Tera Type: Normal  
EVs: 252 Atk / 4 SpD / 252 Spe  
Adamant Nature  
- Dragon Dance  
- Earthquake  
- Extreme Speed  
- Encore`,
};

export default PROJECT_CONFIG;
