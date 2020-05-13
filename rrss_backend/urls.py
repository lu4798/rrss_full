"""rrss_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from redes_backend.views import *
from rrss_backend import settings
from rest_framework_jwt.views import obtain_jwt_token

router = routers.DefaultRouter()
router.register(r'posts', PostViewSet, basename='Post')
router.register(r'comments', CommentViewSet, basename='Comment')
router.register(r'users', UserViewSet, basename='User' ) #
router.register(r'friends', FriendViewSet)

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('', include(router.urls)),
                  path('auth/', obtain_jwt_token),
                  #path('posts/<int:id>/', PostViewSet.as_view({'get': 'get_user_post'}), name='get_user_post'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
