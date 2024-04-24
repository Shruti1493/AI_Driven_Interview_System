from channels.consumer import AsyncConsumer, SyncConsumer
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MyASyncConsumerClass(AsyncConsumer):
    async def websocket_connect(self, event):
        print('websocket connected...', event)
        await self.send({
            'type': 'websocket.accept'
        })
    
    
    async def websocket_receive(self, event):
        print('message received...', event)
        
        try:
            # Extract the message text from the event
            text_data_json = json.loads(event['text'])
            user_input = text_data_json.get('text_data', '')

            # Convert the input text to lower case
            user_input_lower = user_input.lower()

            # Send the lowercased input text back to the client
            await self.send({
                'type': 'websocket.send',
                'text': json.dumps({'message': user_input_lower})
            })
        except json.JSONDecodeError:
            print("Invalid JSON format for the received message.")
            # If JSON decoding fails, send an error message back to the client
            await self.send({
                'type': 'websocket.send',
                'text': json.dumps({'error': 'Invalid JSON format'})
            })


    async def websocket_disconnect(self, event):
        print('Websocket Disconnected....')
        raise StopConsumer()


class MySyncConsumerClass(SyncConsumer):
    def websocket_connect(self, event):
        print('websocket connected...', event)
        self.send({
            'type': 'websocket.accept'
        })
    
    
    def websocket_receive(self, event):
        print('message received...', event)
        
        try:
            # Extract the message text from the event
            text_data_json = json.loads(event['text'])
            user_input = text_data_json.get('text_data', '')

            # Convert the input text to lower case
            user_input_lower = user_input.lower()

            # Send the lowercased input text back to the client
            self.send({
                'type': 'websocket.send',
                'text': json.dumps({'message': user_input_lower})
            })
        except json.JSONDecodeError:
            print("Invalid JSON format for the received message.")
            # If JSON decoding fails, send an error message back to the client
            self.send({
                'type': 'websocket.send',
                'text': json.dumps({'error': 'Invalid JSON format'})
            })

    def websocket_disconnect(self, event):
        print('Websocket Disconnected....')
        raise StopConsumer()
