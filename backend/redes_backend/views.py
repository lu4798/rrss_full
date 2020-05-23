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
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        print(request.data)
        c = Comment.objects.create(
            content=request.data['content'],
            user=User.objects.filter(username=request.data['user'])[0],
            post=Post.objects.filter(id=request.data['post'])[0]
        )
        serialized_data = self.get_serializer(c).data
        return HttpResponse(serialized_data)

    def get_queryset(self):
        post = self.request.query_params.get('post', None)
        print(post)
        if post:
            return Comment.objects.filter(post=post)
        else:
            return Comment.objects.all()

    def destroy(self, request, *args, **kwargs):
        url = request.build_absolute_uri()
        if url.endswith('/'):
            url = url[:-1]
        url = url.split('/')[-1]
        try:
            c = Comment.objects.get(id=url)
            if request.user == c.user:
                c.delete()
                return Response(status=status.HTTP_200_OK)
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer

    def create(self, request, *args, **kwargs):
        print(request.data)
        try:
            p = Post.objects.create(
                title=request.data['title'],
                content=request.data['content'],
                image=request.data['image'],
                user=User.objects.filter(username=request.data['user'])[0]
            )
        except:
            p = Post.objects.create(
                title=request.data['title'],
                content=request.data['content'],
                user=User.objects.filter(username=request.data['user'])[0]
            )
        serialized_data = self.get_serializer(p).data
        return HttpResponse(serialized_data)

    def get_queryset(self):
        username = self.request.query_params.get('user', None)
        print(username)
        if username:
            return Post.objects.filter(user__username=username).order_by('-date')
        else:
            return Post.objects.all().order_by('-date')

    def destroy(self, request, *args, **kwargs):
        url = request.build_absolute_uri()
        if url.endswith('/'):
            url = url[:-1]
        url = url.split('/')[-1]
        try:
            p = Post.objects.get(id=url)
            if request.user == p.user:
                p.delete()
                return Response(status=status.HTTP_200_OK)
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class FriendViewSet(viewsets.ModelViewSet):
    queryset = Friend.objects.all()
    serializer_class = FriendSerializer

    def create(self, request, *args, **kwargs):
        print(request.data)
        f = Friend.objects.create(
            userr=request.data['user'],
            user_photo=request.data['image'],
            friendship=request.data['friendship'],
        )

        serialized_data = self.get_serializer(f).data
        return HttpResponse(serialized_data)
    # queryset = Post.objects.all()
    # queryset = queryset.order_by('-date')
    '''def retrieve(self, request, *args, **kwargs):
        query = self.get_queryset()
        user = kwargs['pk']
        for post in query:
            if post.user.username == user:
                return Response(self.get_serializer(post).data)'''

    # Falta ver como filtrar directamente de bbdd
    # @action(methods=['get'], detail=True)
    # def get_user_post(self, request, *args, **kwargs, ):
    #    query = self.get_queryset()
    #    id = kwargs['id']
    #    for post in query:
    #        if post.user.id == id:
    #            return Response(self.get_serializer(post).data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

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
        print("COMPLETE_USER",u)


        serialized_data = self.get_serializer(u)
        print(serialized_data.data)
        f = Friend.objects.create(
            userr=serialized_data.data['username'],
            user_photo=serialized_data.data['banner_photo'].split('/')[-1],
            friendship=False
        )
        f = Friend.objects.create(
            userr=serialized_data.data['username'],
            user_photo=serialized_data.data['banner_photo'].split('/')[-1],
            friendship=True
        )
        return Response(serialized_data.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return HttpResponse(serializer.data)

    #Cambiarlo para que sea un poquito mas seguro
    def put(self, request):
        print("DATOS",request.data['friend'])

        print(self.request.query_params)
        user_id = self.request.query_params.get('user', None)
        friend = self.request.query_params.get('friendship', None)

        if friend != None:
            if friend == "add_friend":
                f = Friend.objects.filter(userr=request.data['friend'],friendship=False)
                u = User.objects.get(username=user_id)
                u.friends.add(f[0])
                u.save()
            if friend == "refuse_friend":
                print(user_id,request.data['friend'])
                u = User.objects.get(username=user_id)
                f = Friend.objects.get(userr=request.data['friend'],friendship=False)
                u.friends.remove(f)
            if friend == "accept_friend":
                u = User.objects.get(username=user_id)
                u1 = User.objects.get(username=request.data['friend'])
                f = Friend.objects.get(userr=request.data['friend'], friendship=False)
                ft = Friend.objects.get(userr=request.data['friend'], friendship=True)
                ft2 = Friend.objects.get(userr=user_id, friendship=True)
                u.friends.remove(f)
                u.friends.add(ft)
                u1.friends.add(ft2)
            if friend == "delete_friend":
                u = User.objects.get(username=user_id)
                u1 = User.objects.get(username=request.data['friend'])
                ft = Friend.objects.get(userr=request.data['friend'], friendship=True)
                ft2 = Friend.objects.get(userr=user_id, friendship=True)
                u.friends.remove(ft)
                u1.friends.remove(ft2)
        else:
            try:
                u = User.objects.filter(username=user_id).update(
                    name=request.data['name'],
                    description=request.data['description'],
                    youtube=request.data['yt'],
                    instagram=request.data['insta'],
                    twitter=request.data['twitter'],
                    banner_photo=request.data['banner_photo'],
                )
                serialized_data = self.get_serializer(self.get_queryset()[0])
                f = Friend.objects.filter(userr=user_id, friendship=False).update(
                    user_photo=serialized_data.data['banner_photo'].split('/')[-1]
                )
                f = Friend.objects.filter(userr=user_id, friendship=True).update(
                    user_photo=serialized_data.data['banner_photo'].split('/')[-1]
                )
                file = request.FILES['banner_photo']
                path = default_storage.save(str(file), ContentFile(file.read()))
            except:
                u = User.objects.filter(username=user_id).update(
                    name=request.data['name'],
                    description=request.data['description'],
                    youtube=request.data['yt'],
                    instagram=request.data['insta'],
                    twitter=request.data['twitter'],
                )
        return Response({"http_method": "PUT"})

    def get_queryset(self):
        user_id = self.request.query_params.get('user', None)
        print(user_id)
        if user_id:
            return User.objects.filter(username=user_id)
        else:
            return User.objects.all()


