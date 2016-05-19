#-*- coding: utf-8 -*-

"""webapp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, patterns, include
from django.contrib import admin
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'articles', views.ArticleViewSet)
router.register(r'categorys', views.CategoryViewSet)
router.register(r'boards', views.BoardViewSet)

urlpatterns = [
    url(r'^api/grappelli/', include('grappelli.urls')),
    url(r'^api/admin/', admin.site.urls),
	url(r'^api/', include(router.urls)),
	url(r'^api/docs/', include('rest_framework_swagger.urls')),
	url(r'^api/auth/signin/', views.signin),
	url(r'^api/auth/signout/', views.signout),
]
