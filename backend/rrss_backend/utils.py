from http import cookies

import jwt
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

from django.db import close_old_connections
from jwt import InvalidSignatureError, ExpiredSignatureError, DecodeError
from rest_framework_jwt.authentication import BaseJSONWebTokenAuthentication, jwt_get_username_from_payload

from redes_backend.models import User

from redes_backend.serializers import UserTokenSerializer
from rrss_backend import settings


def custom_jwt_response_handler(token, user=None, request=None):
    print("Error:", request.data)
    a = UserTokenSerializer(user, context=('request', request))
    print("Error:", UserTokenSerializer(user, context=('request', request)))
    return {
        'token': token,
        'user': UserTokenSerializer(user, context=('request', request)).data
    }

@database_sync_to_async
def close_connections():
    close_old_connections()

@database_sync_to_async
def get_user_by_username(username):
    try:
        return User.objects.get(username=username)
    except:
        return AnonymousUser()


class JWTAuthFromScope(BaseJSONWebTokenAuthentication):
    def get_jwt_value(self, scope):
        print("intentando cookie")
        cookie = scope['subprotocols'][1]
        print(cookie)
        return cookie

    def authenticate_credentials(self, payload):
        username = jwt_get_username_from_payload(payload)

        if not username:
            raise Exception('Payload no válido')

        try:
            user = get_user_by_username(username)
        except:
            raise Exception('Error obteniendo usuario')
        return user


class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        print(scope)
        auth_header = None
        if 'subprotocols' in scope:
            try:
                auth_header = scope['subprotocols'][1]
            except:
                pass
        if auth_header:
            try:
                user_jwt = jwt.decode(
                    auth_header,
                    settings.SECRET_KEY,
                )
                print("user_jwt", user_jwt)
                scope['user'] = User.objects.get(
                    id=user_jwt['username']
                )
                close_old_connections()
            except (InvalidSignatureError, KeyError, ExpiredSignatureError, DecodeError):
                scope['auth_error'] = 'KeyError'
                pass
            except Exception as e:  # NoQA
                scope['auth_error'] = 'Unknown'

        return self.inner(scope)


def my_auth_middleware_stack(inner):
    return TokenAuthMiddleware(AuthMiddlewareStack(inner))


'''
class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        close_connections()
        user, jwt_value = JWTAuthFromScope().authenticate(scope)
        print("user", user)
        scope['user_task'] = user
        print(scope)
        return self.inner(scope)

def my_auth_middleware_stack(inner):
    return MyAuthMiddleWare(AuthMiddlewareStack(inner))
    
class JWTAuthFromScope(BaseJSONWebTokenAuthentication):
    def get_jwt_value(self, scope):
        cookie = next(x for x in scope['headers'] if x[0].decode('utf-8') == 'cookie')[1].decode('utf-8')
        return cookies.SimpleCookie(cookie)['JWT'].value

    def authenticate_credentials(self, payload):
        username = jwt_get_username_from_payload(payload)

        if not username:
            raise Exception('Payload no válido')

        try:
            user = get_user_by_username(username)
        except:
            raise Exception('Error obteniendo usuario')
        return user
    
'''

