from redes_backend.serializers import UserTokenSerializer


def custom_jwt_response_handler(token, user=None, request=None):
    print("Error:", request.data)
    a = UserTokenSerializer(user, context=('request', request))
    print("Error:", UserTokenSerializer(user, context=('request', request)))
    return {
        'token': token,
        'user': UserTokenSerializer(user, context=('request', request)).data
    }