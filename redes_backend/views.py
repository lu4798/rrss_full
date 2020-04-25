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

    def create(self, request, *args, **kwargs):
        print(request)
        u = User.objects.create(
            username=request.data['username'],
            password=make_password(request.data['password']),
        )
        serialized_data = self.get_serializer(u).data
        return HttpResponse(serialized_data)

    def retrieve(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return HttpResponse(serializer.data)


class FriendViewSet(viewsets.ModelViewSet):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer
