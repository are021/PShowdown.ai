from random import randint
import requests
import json
import configparser


class BattleState():
    def __init__(self, single = True):
        self.battle_id = ""
        self.single = True
        self.moves = None
        self.current_message = ""
        self.good_to_move = False
        self.user_pokemon = None
        self.enemy_pokemon = None

        # Single of Double Battle
        # List of the pokemon
        # Active Pokemon, Opposing and Agent
        # List of moves
        # List of base stats
        # List of known items
    
    def add_moves(self, moves):
        self.moves = moves

    def get_pokemon_name(self, message):
        pkmn_info = message[0].split('|')
        return pkmn_info[2].split(': ')[1].lower()

    def updated_message(self, message):
        if "battle_id" in message:
            self.battle_id = message["battle_id"][1:]
        if message["role"] == "server":
            self.good_to_move = True    
        if "message" in message:
            parsed_list = message["message"].split("\n")
            print("Server Message", parsed_list)

            # Find the Player 1 and Player 2
            resultp1a = list(filter(lambda x: "p1a" in x, parsed_list))
            resultp2a = list(filter(lambda x: "p2a" in x, parsed_list))
            if len(resultp1a) >= 1 and len(resultp2a) >= 1:
                self.user_pokemon = self.get_pokemon_name(resultp1a)
                self.enemy_pokemon = self.get_pokemon_name(resultp2a)

            # TODO need to add some kind of parser for the damage done
        self.current_message = message 
    
    def get_current_message(self):
        return self.current_message
    
    def ready_to_attack(self):
        return self.battle_id != "" and self.good_to_move and self.user_pokemon and self.enemy_pokemon





class DecisionMaker:
    def __init__(self, rqid):
        self.rqid = rqid
        self.cf = configparser.ConfigParser()
        self.cf.read("config.ini")
        
    def attack(self, bs):
        bs.good_to_move = False
        return (f"{bs.battle_id}|/choose move {randint(1, 4)}")

    
    def send_challenge(self):
        team_string = requests.get("http://localhost:8000/get_team").json()
        return [f"|/utm {json.dumps(team_string)}", f"|/challenge {self.cf.get("PLAYER", "Challenger")}, {self.cf.get("BATTLE", 'Format')}"]
    
    def choose_order(self, bs):
        return f"{bs.battle_id}|/choose team {self.cf.getint("BATTLE", "PokemonOrder")}"
        
