from django.http import HttpResponse
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.hashers import make_password

from .models import *
from .serializers import *


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)


    def get_serializer_class(self, *args, **kwargs):
        return UserSerializer

    def create(self, request, *args, **kwargs):
        print(request)
        u = User.objects.create(
            name=request.data['name'],
            username=request.data['content'],
            email=request.data['user'],
            password=make_password(request.data['password']),
            description=request.data['description'],
            profile_photo=request.data['profile_photo'],
            banner_photo=request.data['banner_photo'],
        )
        serialized_data = self.get_serializer(u).data

        if serialized_data.is_valid():
            serialized_data.save()
        #    return Response(serializer.data, status=status.HTTP_201_CREATED)
        #return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return HttpResponse(serialized_data)
    def retrieve(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    def get_serializer_class(self):
        return PostSerializer

    def create(self, request, *args, **kwargs):
        print(request)
        p = Post.objects.create(
            title=request.data['title'],
            content=request.data['content'],
            author=request.data['user'],
            image=request.data['image'],
            likes=request.data['likes'],
            comments=request.data['comments']
        )
        serialized_data = self.get_serializer(p).data
        return HttpResponse(serialized_data)

    def destroy(self, request, *args, **kwargs):
        url = request.build_absolute_uri()
        if url.endswith('/'):
            url = url[:-1]
        url = url.split('/')[-1]
        try:
            p = Post.objects.get(id=url)
            if request.user == p.author:
                p.delete()
                return Response(status = status.HTTP_200_OK)
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    def get_serializer_class(self):
        return CommentSerializer

    def create(self, request, *args, **kwargs):
        print(request)
        c = Post.objects.create(
           content=request.data['content'],
           author=request.data['user'],
           likes=request.data['likes'],
        )
        serialized_data = self.get_serializer(c).data
        return HttpResponse(serialized_data)

    def destroy(self, request, *args, **kwargs):
        url = request.build_absolute_uri()
        if url.endswith('/'):
            url = url[:-1]
        url = url.split('/')[-1]
        try:
            c = Comment.objects.get(id=url)
            if request.user == c.author:
                c.delete()
                return Response(status = status.HTTP_200_OK)
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
