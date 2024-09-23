import numpy as np
class ModelFree_Q():
    def __init__(self, discount = 0.9, lr = 0.1, epsilon = 0.1, states = 18, brm = 1):

        if lr < 0 or lr > 1:
            raise ValueError("Lambda must be between 0 and 1")
        
        if discount < 0 or discount > 1:
            raise ValueError("Discount must be between 0 and 1")
        
        self.discount = discount
        self.lr = lr
        self.epsilon = epsilon
        self.q_table = np.random.uniform(low=-2, high=0, size=(states, 5))
        pokemon_types = [
            "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", 
            "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", 
            "Steel", "Fairy"
        ]
        self.type_map = { pokemon_types[i] : i for i in range(len(pokemon_types)) }
        self.base_reward_multiplier = brm

    def update_q_table(self, state, action, reward, next_state):
        q_value = self.q_table[action]
        max_next_q_value = np.max(self.q_table[next_state])
        new_q_value = (1 - self.lr) * q_value + self.lr * (reward + self.discount * max_next_q_value)
        self.q_table[action] = new_q_value