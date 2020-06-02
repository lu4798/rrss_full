from django.contrib import admin
from .models import User,Comment,Post,Friend, Chat
# Register your models here.

admin.site.register(User)
admin.site.register(Comment)
admin.site.register(Post)
admin.site.register(Friend)
admin.site.register(Chat)