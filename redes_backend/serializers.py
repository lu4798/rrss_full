from django import forms
from rest_framework.serializers import HyperlinkedModelSerializer
from rest_framework import serializers
from .models import *
from rest_framework_jwt.settings import api_settings


class UserSerializer(HyperlinkedModelSerializer):
    profile_photo = serializers.ImageField()
    banner_photo = serializers.ImageField()
    token = serializers.SerializerMethodField()

    class Meta:
        model = User
        widgets = {
            'password': forms.PasswordInput(),
        }
        fields = ['username', 'password', 'name', 'description', 'banner_photo', 'profile_photo', 'youtube',
                  'instagram', 'twitter', 'token']

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
        fields = ['user', 'title', 'content', 'image', 'date', 'likes']


class CommentSerializer(HyperlinkedModelSerializer):
    user = UserSerializer()
    date = serializers.DateTimeField('%d-%m-%Y %H:%M:%S')
    likes = serializers.IntegerField()
    post = PostSerializer()

    class Meta:
        model = Comment
        fields = ['user', 'date', 'content', 'likes', 'post']


class FriendSerializer(HyperlinkedModelSerializer):
    user = UserSerializer()
    friends = UserSerializer(many=True)
    sent_requests = UserSerializer(many=True)
    received_requests = UserSerializer(many=True)

    class Meta:
        model = Friend
        fields = ['user', 'friends', 'sent_requests', 'received_requests']
