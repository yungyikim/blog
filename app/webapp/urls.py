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
#router.register(r'users', views.UserViewSet)
router.register(r'articles', views.ArticleViewSet)
router.register(r'categorys', views.CategoryViewSet)
router.register(r'boards', views.BoardViewSet)
router.register(r'profiles', views.ProfileViewSet)

urlpatterns = [
    url(r'^grappelli/', include('grappelli.urls')),
    url(r'^admin/', admin.site.urls),
	url(r'^docs/', include('rest_framework_swagger.urls')),
	#url(r'^auth/signin/', views.signin),
	#url(r'^auth/signout/', views.signout),
    url(r'^thirdauth', views.thirdauth, name='thirdauth'),
    url(r'^$', views.home, name='home'),
    url(r'^home', views.home, name='home'),
    url(r'^profile/edit', views.profile_edit, name='profile_edit'),
    url(r'^profile', views.profile, name='profile'),
    url(r'^tech/edit', views.tech_edit, name='tech_edit'),
    url(r'^tech/(\d+)/?$', views.tech_view, name='tech_view'),
    url(r'^tech', views.tech, name='tech'),
    url(r'^info/edit', views.info_edit, name='info_edit'),
    url(r'^info/(\d+)/?$', views.info_view, name='info_view'),
    url(r'^info', views.info, name='info'),
	url(r'^/', include(router.urls)),
    url('', include('social.apps.django_app.urls', namespace='social')),
    url('', include('django.contrib.auth.urls', namespace='auth')),
]
