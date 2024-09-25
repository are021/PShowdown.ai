import numpy as np
from team_setup import Q_Table_Manager

class Q_Table():
    def __init__(self, states = (18**2) * 10, actions = 5):
        self.q_table = np.random.uniform(low=-2, high=0, size=(states, actions))

    def get_q_table(self):
        return self.q_table
    
class ModelFree_Q():
    def __init__(self, discount = 0.9, lr = 0.1, epsilon = 0.1, states = 18**2, brm = 1):

        if lr < 0 or lr > 1:
            raise ValueError("Lambda must be between 0 and 1")
        
        if discount < 0 or discount > 1:
            raise ValueError("Discount must be between 0 and 1")
        
        self.discount = discount
        self.lr = lr
        self.epsilon = epsilon

        # Load the Q_Tables from file
        try:
            self.q_table = Q_Table_Manager.load_q_tables("./model_free_tables/q_tables.h5")
        except:
            default_team = [
                "Landorus-Therian",
                "Zamazenta",
                "Raging Bolt",
                "Darkrai",
                "Gholdengo",
                "Dragonite"
            ]
            example_map = { pokemon : Q_Table() for pokemon in default_team}
            Q_Table_Manager.save_q_tables(example_map, "./model_free_tables/q_tables.h5")
            self.q_table = Q_Table_Manager.load_q_tables("./model_free_tables/q_tables.h5")
        
        self.team_types = Q_Table_Manager.get_pokemon_info(list(self.q_table.keys()))
        

        ### Create pokemon types to indices map
        pokemon_types = [
            "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", 
            "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", 
            "Steel", "Fairy"
        ]
        self.type_map = { pokemon_types[i - 1] : i for i in range(1, len(pokemon_types) + 1) }

        # Base reward - We will scale between 0 - 1
        self.base_reward_multiplier = brm

    
    '''
    Map the type names to their respective indices in the Q-table
    '''
    def type_names_to_indices(self, type1, type2):
        return self.type_map[type1], self.type_map[type2]

    '''
    Map the type tuples to their respective state in the Q-table
    '''
    def type_to_state_from_names(self, type1, type2):
        i, j = self.type_names_to_indices(type1, type2)
        return (i - 1) * 18 + (j - 1)


    def update_q_table(self, state, reward, next_state):
        action = self.type_to_state_from_names(state[0], state[1])
        q_value = self.q_table[action]
        max_next_q_value = np.max(self.q_table[next_state])
        new_q_value = (1 - self.lr) * q_value + self.lr * (reward + self.discount * max_next_q_value)
        self.q_table[action] = new_q_value


if __name__ == "__main__":
    mfq = ModelFree_Q()
    print(mfq.type_map)