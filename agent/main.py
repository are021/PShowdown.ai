import requests
from dotenv import load_dotenv
import os
import json
import asyncio
import websockets
port = 8000

# Connect the agent to the node.js server

web_url = f"ws://localhost:{port}"

async def send_message(ws, message):
    await ws.send(message)
    print(f"Sent: {message}")


async def connect_to_server():
    ws = await websockets.connect(web_url)
    await ws.send("|/challenge pshowdown.ai, [GEN 9] Random Battle")
    response = await ws.recv()

    print(f"Received: {response}")
    return ws

if __name__ == "__main__":
    ws = asyncio.run(connect_to_server())
    # while True:
    #     command = input("Enter 'start' to start the agent: ")
    #     if command.lower() == "start":
    #         asyncio.run(send_message(ws, "start"))