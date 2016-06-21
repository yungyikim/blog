#-*- coding: utf-8 -*-

from rest_framework import serializers
from django import forms
from django.contrib.auth import get_user_model
from django.core.validators import validate_email
import api.models as models

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    class Meta:
        model = User
        #fields = ('id', User.USERNAME_FIELD, 'full_name', 'department', 'is_active')
        fields = ('id', User.USERNAME_FIELD, 'auth_type', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Profile
        fields = (
            'id',
            'content',
            'owner'
        )

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Board
        fields = (
            'id',
            'name'
        )

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = (
            'id',
            'name',
            'board'
        )

class ArticleSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source='owner.get_full_name', read_only=True)

    class Meta:
        model = models.Article
        fields = (
            'id',
            'board',
            'category',
            'title',
            'summary',
            'content_type',
            'content',
            'image_url',
            'group',
            'sequence',
            'depth',
            'created',
            'owner',
            'email'
        )
