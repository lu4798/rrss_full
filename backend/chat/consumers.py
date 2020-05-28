from channels.generic.websocket import AsyncWebsocketConsumer, JsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
import json

'''
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = await self.scope['user']
        self.scope['user'] = user

        if user.is_anonymous:
            await self.close()
        else:
            await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        await self.send(text_data)

    async def disconnect(self, code):
        pass
        '''


class ChatConsumer(JsonWebsocketConsumer):
    def connect(self):
        print(self.scope)
        self.room_name = 'general'
        self.room_group_name = 'chat_general'
        print(self.channel_name)

        if self._is_authenticated():
            print("intenta conectar")
            self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            self.accept('auth_token')
        else:
            print("ws client auth error")
            self.close(code=4003)

    def _is_authenticated(self):
        if hasattr(self.scope['headers'], 'auth_error'):
            print("error1")
            return False
        if type(self.scope['user']) is AnonymousUser or not self.scope['user']:
            print("error2")
            return False
        return True

    def receive(self, text_data=None, bytes_data=None, **kwargs):
        print("Mensaje, ", text_data)
        print("Enviado por ", self.scope['user'].username)
        self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'message',
                'message': text_data,
                'username': self.scope['user'].username
            }
        )

    def message(self, event):
        self.send(text_data=json.dumps({
            'message': event['message'],
            'username': event['username']
        }))

    def disconnect(self, code):
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
