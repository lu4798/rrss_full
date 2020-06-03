

from django.contrib.auth.hashers import make_password
from django.db.models import Q
from django.http import HttpResponse

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny

from rest_framework.response import Response

from .serializers import CommentSerializer, PostSerializer, UserSerializer, FriendSerializer, ChatSerializer
from .models import *



class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):

        c = Comment.objects.create(
            content=request.data['content'],
            user=User.objects.filter(username=request.data['user'])[0],
            post=Post.objects.filter(id=request.data['post'])[0]
        )
        serialized_data = self.get_serializer(c).data
        return HttpResponse(serialized_data)

    def get_queryset(self):
        post = self.request.query_params.get('post', None)

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


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    def create(self, request, *args, **kwargs):

        user1 = User.objects.get(username=self.request.query_params.get('user1', None))
        user2 = User.objects.get(username=self.request.query_params.get('user2', None))

        try:
            serialized_data = self.get_serializer(Chat.objects.get(user1=user1, user2=user2)).data
            return HttpResponse("NO")
        except:
            try:
                serialized_data = self.get_serializer(Chat.objects.get(user1=user2, user2=user1)).data
                return HttpResponse("NO")
            except:
                c = Chat.objects.create(
                    user1=user1,
                    user2=user2
                )
                serialized_data = self.get_serializer(c).data
                return HttpResponse(serialized_data)

    def retrieve(self, request, *args, **kwargs):
        serializer = ChatSerializer(request.user)
        return HttpResponse(serializer.data)

    def get_queryset(self):
        user1 = self.request.query_params.get('user1', None)
        user2 = self.request.query_params.get('user2', None)
        user_chat = self.request.query_params.get('user_chat', None)

        if user1 and user2:
            try:
                return Chat.objects.filter(user1__username=user1, user2__username=user2)
            except:
                return Chat.objects.filter(user1__username=user2, user2__username=user1)
        elif user_chat:
            try:
                return Chat.objects.filter(Q(user1__username=user_chat) | Q(user2__username=user_chat))
            except:
                pass


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
        u = User.objects.create(
            username=request.data['username'],
            password=make_password(request.data['password']),
            name=request.data['name']
        )


        serialized_data = self.get_serializer(u)

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

    # Cambiarlo para que sea un poquito mas seguro
    def put(self, request):

        user_id = self.request.query_params.get('user', None)
        friend = self.request.query_params.get('friendship', None)

        if friend != None:
            if friend == "add_friend":
                f = Friend.objects.filter(userr=request.data['friend'], friendship=False)
                u = User.objects.get(username=user_id)
                u.friends.add(f[0])
                u.save()
            if friend == "refuse_friend":

                u = User.objects.get(username=user_id)
                f = Friend.objects.get(userr=request.data['friend'], friendship=False)
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

        if user_id:
            return User.objects.filter(username=user_id)
        else:
            return User.objects.all()
