from os import link

from django.contrib.auth.hashers import make_password
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
import os
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny

from rest_framework.response import Response

from .serializers import CommentSerializer, PostSerializer, UserSerializer, FriendSerializer
from .models import *
from rest_framework_jwt.settings import api_settings
from rest_framework import serializers

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer

    def create(self, request, *args, **kwargs):
        print(request.data)
        p = Post.objects.create(
            title=request.data['title'],
            content=request.data['content'],
            image=request.data['image'],
            user=User.objects.filter(username=request.data['user'])[0]
        )
        print(p.image)
        serialized_data = self.get_serializer(p).data
        return HttpResponse(serialized_data)

    def get_queryset(self):
        username = self.request.query_params.get('user', None)
        print(username)
        if username:
            return Post.objects.filter(user__username=username)
        else:
            return Post.objects.all()

    def destroy(self, request,*args, **kwargs):
        url = request.build_absolute_uri()
        if url.endswith('/'):
            url = url[:-1]
        url = url.split('/')[-1]
        try:
            p = Post.objects.get(id=url)
            if request.user == p.author:
                p.delete()
                return Response(status=status.HTTP_200_OK)
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny, )

    '''def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)'''

    def create(self, request, *args, **kwargs):
        print(request.data)
        u = User.objects.create(
            username=request.data['username'],
            password=make_password(request.data['password']),
            name=request.data['name']
        )

        serialized_data = self.get_serializer(u)
        print(serialized_data)
        return Response(serialized_data.data,status=status.HTTP_201_CREATED)


    def retrieve(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return HttpResponse(serializer.data)


    def put(self, request):
        print(request.data)
        user_id = self.request.query_params.get('user', None)
        u = User.objects.filter(username=user_id).update(
            name=request.data['name'],
            description = request.data['description'],
            youtube = request.data['yt'],
            instagram = request.data['insta'],
            twitter = request.data['twitter'],
            banner_photo = request.data['banner_photo'],
        )
        file = request.FILES['banner_photo']
        path = default_storage.save(str(file), ContentFile(file.read()))
        return Response({"http_method": "PUT"})

    def get_queryset(self):
        user_id = self.request.query_params.get('user', None)
        print(user_id)
        if user_id:
            return User.objects.filter(username=user_id)
        else:
            return User.objects.all()


class FriendViewSet(viewsets.ModelViewSet):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer





 # queryset = Post.objects.all()
    # queryset = queryset.order_by('-date')
    '''def retrieve(self, request, *args, **kwargs):
        query = self.get_queryset()
        user = kwargs['pk']
        for post in query:
            if post.user.username == user:
                return Response(self.get_serializer(post).data)'''

    # Falta ver como filtrar directamente de bbdd
    #@action(methods=['get'], detail=True)
    #def get_user_post(self, request, *args, **kwargs, ):
    #    query = self.get_queryset()
    #    id = kwargs['id']
    #    for post in query:
    #        if post.user.id == id:
    #            return Response(self.get_serializer(post).data)