from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class Friend(models.Model):
    userr = models.CharField(max_length=100, blank=True)
    friendship = models.BooleanField(default=False)
    user_photo = models.ImageField(upload_to='media', default="default_profile.png")

    def __str__(self):
        return f'{self.userr}:{self.friendship}'


class User(AbstractUser):
    # username = models.CharField(max_length=100)
    email = models.CharField(max_length=100, blank=True)
    password = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100, blank=True)
    banner_photo = models.ImageField(upload_to='', default="default_banner.png")
    youtube = models.CharField(max_length=100, blank=True)
    instagram = models.CharField(max_length=100, blank=True)
    twitter = models.CharField(max_length=100, blank=True)
    friends = models.ManyToManyField(Friend, null=True)

    def str(self):
        return f'{self.username}: {self.password},{self.email},{self.name},{self.description},{self.banner_photo},{self.friends} '


class Messages(models.Model):
    user = models.CharField(max_length=100, blank=True)
    message = models.CharField(max_length=1024, blank=True)

    def __str__(self):
        return f'{self.user}:{self.message}'


class Chat(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user2')
    messages = models.ManyToManyField(Messages, null=True)

    def __str__(self):
        return f'{self.user1}:{self.user2}, {self.messages}'


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    image = models.ImageField(blank=True)
    date = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)

    def __str__(self):
        return f'{self.user}: {self.title},{self.content},{self.image},{self.date},{self.likes}'


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user}:{self.content},{self.date},{self.likes}'

# FALTA AMIGOS QUE NO SE COMO HACERLO TODAVIA
