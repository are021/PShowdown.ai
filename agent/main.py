import requests
from dotenv import load_dotenv
import os
import json


# Connect the agent to the node.js server

if __name__ == "__main__":
    while True:
        command = input("Enter 'start' to start the agent: ")
        if command.lower() == "start":
            break