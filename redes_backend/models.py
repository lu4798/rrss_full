from django.db import models
# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100,blank=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100,blank=True)
    profile_photo = models.ImageField(blank=True)
    banner_photo = models.ImageField(blank=True)
    def __str__(self):
            return f'{self.username}: {self.email},{self.name},{self.description},{self.profile_photo},{self.banner_photo}'

class Social(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    youtube = models.CharField(max_length=100,blank=True)
    instagram = models.CharField(max_length=100,blank=True)
    twitter = models.CharField(max_length=100,blank=True)
    def __str__(self):
        return f'{self.youtube}: {self.twitter},{self.instagram}'

class Post(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    image = models.ImageField(blank=True)
    date = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    def __str__(self):
        return f'{self.user}: {self.title},{self.content},{self.image},{self.date},{self.likes}'

class Comment(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    post = models.ForeignKey(Post,on_delete=models.CASCADE)
    def __str__(self):
        return f'{self.user}:{self.content},{self.date},{self.likes}'


class Friend(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    friends = models.ManyToManyField(User,related_name='friends',blank=True)
    sent_requests = models.ManyToManyField(User,related_name='sent',blank=True)
    received_requests = models.ManyToManyField(User,related_name='received',blank=True)
    def __str__(self):
        return f'{self.user}:{self.friends},{self.sent_requests},{self.received_requests}'
#FALTA AMIGOS QUE NO SE COMO HACERLO TODAVIA

