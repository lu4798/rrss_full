from django.contrib import admin
from .models import Social,User,Comment,Post,Friend
# Register your models here.

admin.site.register(Social)
admin.site.register(User)
admin.site.register(Comment)
admin.site.register(Post)
admin.site.register(Friend)