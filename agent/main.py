import asyncio
from concurrent.futures import process
import websockets
from decisions import BattleState, DecisionMaker
import json
import asyncio
import requests

battle_state = BattleState()
decision_maker = DecisionMaker(3)

async def receive_message(ws):
    try:
        async for message in ws:
            battle_state.updated_message(json.loads(message))

    except websockets.ConnectionClosedOK:
        print("Connection closed by the server.")

async def get_user_input():
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, input, "1 to start challenge: ")

async def send_message(ws):
    started = False
    while True:
        if started:
            await asyncio.sleep(5)
            if battle_state.ready_to_attack():
                await ws.send(decision_maker.attack(battle_state))
        else:
            message = await get_user_input()  # Non-blocking user input
            if message.lower() == "exit":
                await ws.close()  # Close connection if user types 'exit'
                break
            if message == "1":
                message = decision_maker.send_challenge()
                started = True
            await ws.send(message)

async def main():
    uri = "ws://localhost:8000"  # Replace with your WebSocket server URI
    async with websockets.connect(uri) as websocket:
        await asyncio.gather(receive_message(websocket), send_message(websocket))

asyncio.run(main())
