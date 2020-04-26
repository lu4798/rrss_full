from os import link

from django.contrib.auth.hashers import make_password
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404

# Create your views here.
from rest_framework import viewsets
from rest_framework.decorators import action

from rest_framework.response import Response

from .serializers import CommentSerializer, PostSerializer, UserSerializer, FriendSerializer
from .models import *
from rest_framework_jwt.settings import api_settings
from rest_framework import serializers


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    queryset = queryset.order_by('-date')
    serializer_class = PostSerializer
    '''def retrieve(self, request, *args, **kwargs):
        query = self.get_queryset()
        user = kwargs['pk']
        for post in query:
            if post.user.username == user:
                return Response(self.get_serializer(post).data)'''

    # Falta ver como filtrar directamente de bbdd
    @action(methods=['get'], detail=True)
    def get_user_post(self, request, *args, **kwargs, ):
        query = self.get_queryset()
        id = kwargs['id']
        for post in query:
            if post.user.id == id:
                return Response(self.get_serializer(post).data)

    def create(self, request, *args, **kwargs):
        print(request)
        p = Post.objects.create(
            title=request.data['title'],
            content=request.data['content'],
            image=request.data['image'],
            user=User.objects.first()
        )
        print(p.image)
        serialized_data = self.get_serializer(p).data
        return HttpResponse(serialized_data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    #token = serializers.SerializerMethodField()

    def create(self, request, *args, **kwargs):
        print(request.data)
        u = User.objects.create(
            username=request.data['username'],
            password=make_password(request.data['password']),
            name=request.data['name'],
        )
        serialized_data = self.get_serializer(u).data
        print(serialized_data)
        if self.get_serializer(data=u).is_valid():
            serialized_data.save()
            print("hola")
        return HttpResponse(serialized_data)

    #def get_token(self, obj):
    #    jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
    #    jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
    #    payload = jwt_payload_handler(obj)
    #    token = jwt_encode_handler(payload)
    #    return token

    def retrieve(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return HttpResponse(serializer.data)


class FriendViewSet(viewsets.ModelViewSet):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer
