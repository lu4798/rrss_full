from django import forms
from rest_framework.serializers import HyperlinkedModelSerializer
from rest_framework import serializers
from .models import *
from rest_framework_jwt.settings import api_settings


class UserTokenSerializer(HyperlinkedModelSerializer):
    token = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['username','token']
    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token



class FriendSerializer(HyperlinkedModelSerializer):
    user_photo = serializers.ImageField()
    class Meta:
        model = Friend
        fields = ['userr', 'friendship','user_photo']


class UserSerializer(HyperlinkedModelSerializer):
    '''profile_photo = serializers.ImageField()
    banner_photo = serializers.ImageField()'''
    token = serializers.SerializerMethodField()
    friends = FriendSerializer(many=True)

    class Meta:
        model = User
        widgets = {
            'password': forms.PasswordInput(),
        }
        fields = ['username', 'password', 'name', 'description', 'banner_photo', 'youtube',
                  'instagram', 'twitter', 'token', 'friends']

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token


class PostSerializer(HyperlinkedModelSerializer):
    user = UserSerializer()
    date = serializers.DateTimeField('%d-%m-%Y %H:%M:%S')
    image = serializers.ImageField()
    likes = serializers.IntegerField()

    class Meta:
        model = Post
        fields = ['user', 'title', 'content', 'image', 'date', 'likes', 'id']


class CommentSerializer(HyperlinkedModelSerializer):
    user = UserSerializer()
    date = serializers.DateTimeField('%d-%m-%Y %H:%M:%S')
    likes = serializers.IntegerField()
    post = PostSerializer()

    class Meta:
        model = Comment
        fields = ['user', 'date', 'content', 'likes', 'post', 'id']



