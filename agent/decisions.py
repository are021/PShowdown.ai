from random import choice, randint


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

    def updated_message(self, message):
        if "battle_id" in message:
            self.battle_id = message["battle_id"][1:]
        if message["role"] == "server":
            self.good_to_move = True    
        self.current_message = message 
    
    def get_current_message(self):
        return self.current_message
    
    def ready_to_attack(self):
        return self.battle_id != "" and self.good_to_move





class DecisionMaker:
    def __init__(self, rqid):
        self.rqid = rqid
        # self.agent = agent
    
    def attack(self, bs):
        bs.good_to_move = False
        return (f"{bs.battle_id}|/choose move {randint(1, 4)}")

    
    def send_challenge(self):
        return f"|/challenge pshowdown.ai, gen9randombattle"
        
