import requests
import json
import h5py
from agent import Q_Table


class Q_Table_Manager():
    @staticmethod
    def get_pokemon_info(pokemon_list):
        body = {"pokemon": pokemon_list}
        try:
            types = requests.post('http://localhost:8000/get_types', json=body)
        except requests.exceptions.RequestException as e:
            print(e)
            print("Error: Could not connect to the server")
            return None
        if types.status_code != 200:
            print("Error: Could not get types from server")
            return None
        return types.json()

    @staticmethod
    def save_q_tables(q_tables, filename):
        with h5py.File(filename, 'w') as hf:
            for pokemon, q_table in q_tables.items():
                hf.create_dataset(pokemon, data=q_table.get_q_table())

    @staticmethod
    def load_q_tables(filename):
        q_tables = {}
        with h5py.File (filename, 'r') as hf:
            for pokemon in hf.keys():
                q_tables[pokemon] = hf.get(pokemon)[:]
        return q_tables



    
