from channels.generic.websocket import AsyncWebsocketConsumer, JsonWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

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
        if self._is_authenticated():
            print("intenta conectar")
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

    def receive(self, text_data=None, bytes_data=None):
        self.send(text_data)