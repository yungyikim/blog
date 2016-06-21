#-*- coding: utf-8 -*-

from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django import forms
from django.core.validators import validate_email

# Create your models here.
class Profile(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='profiles')
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "%d" % (self.id)

class Board(models.Model):
    name = models.CharField(max_length=32, null=False)

    def __str__(self):
        return "%d" % (self.id)

class Category(models.Model):
    name = models.CharField(max_length=32, null=False)
    board = models.ForeignKey('Board', related_name='categorys')

    def __str__(self):
        return "%d" % (self.id)

class Article(models.Model):
    class Meta(object):
        index_together = [
            ["group", "sequence"],
        ]

    CONTENT_TYPES = (
        ('A', 'Article'),
        ('C', 'Comment'),
    )
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='articles')
    board = models.ForeignKey('Board', related_name='articles')
    category = models.ForeignKey('Category', related_name='articles')
    title = models.CharField(blank=True, max_length=100)
    summary = models.TextField()
    content_type = models.CharField(max_length=1, choices=CONTENT_TYPES)
    content = models.TextField()
    image_url = models.CharField(blank=True, max_length=128)
    group = models.IntegerField(null=False, unique=False)
    sequence = models.IntegerField(null=False, unique=False)
    depth = models.IntegerField(null=False)
    created = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return "%d" % (self.id)


class CustomUserManager(BaseUserManager):
    def create_user(self, username, auth_type, email, password):
        user = self.model(
            username=username,
            auth_type=auth_type,
            email=self.normalize_email(email),
        )

        user.save(using=self._db)
        return user

    def create_superuser(self, username, auth_type, email, password):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            username,
            auth_type,
            email,
            password=password,
        )
        user.is_admin = True
        user.set_password(password)
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser):
    AUTH_TYPES = (
        ('C', 'Custom'),
        ('S', 'Social'),
    )

    username = models.CharField(
        null=False,
        max_length=64,
        unique=True
    )
    auth_type = models.CharField(max_length=1, choices=AUTH_TYPES)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
    )

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['auth_type', 'email']

    def get_id(self):
        return self.id

    def get_full_name(self):
        # The user is identified by their email address
        return self.username

    def get_short_name(self):
        # The user is identified by their email address
        return self.username

    def __str__(self):              # __unicode__ on Python 2
        return "%d - %s" % (self.id, self.email,)

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin
