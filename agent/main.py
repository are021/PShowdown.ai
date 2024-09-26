import asyncio
import websockets
from decisions import BattleState, DecisionMaker
import json

battle_state = BattleState()
decision_maker = DecisionMaker(3)

# Event to signal shutdown
shutdown_event = asyncio.Event()

async def receive_message(ws):
    try:
        async for message in ws:
            battle_state.updated_message(json.loads(message))
    except websockets.ConnectionClosedOK:
        print("Connection closed by the server.")
    except websockets.ConnectionClosedError as e:
        print(f"Connection error: {e}")

async def get_user_input():
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, input, "1 to start challenge, 2 to choose order, 'exit' to quit: ")

async def send_user_messages(ws):
    while not shutdown_event.is_set():
        message = await get_user_input()
        if message.lower() == "exit":
            print("Shutting down...")
            shutdown_event.set()
            # agent.save_q_tables() Call this when the agent is created, and saved (later add a toggle to save state)
            await ws.close()
            break
        if message == "1":
            messages = decision_maker.send_challenge()
            for message in messages:
                await ws.send(message)
        if message == "2":
            choices = decision_maker.choose_order(battle_state)
            await ws.send(choices)

async def periodic_attack(ws):
    while not shutdown_event.is_set():
        if battle_state.ready_to_attack():
            await ws.send(decision_maker.attack(battle_state))
        await asyncio.sleep(5)  # Wait between attacks

async def watch_for_exit():
    await shutdown_event.wait()

async def main():
    uri = "ws://localhost:8000"
    try:
        async with websockets.connect(uri) as websocket:
            await asyncio.gather(
                receive_message(websocket),
                send_user_messages(websocket),
                periodic_attack(websocket),
                watch_for_exit()
            )
    except websockets.InvalidURI:
        print("Invalid URI")
    except OSError as e:
        print(f"Connection error: {e}")

asyncio.run(main())