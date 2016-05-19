#-*- coding: utf-8 -*-

from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django import forms
from django.core.validators import validate_email

# Create your models here.
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
    group = models.IntegerField(null=False, unique=False)
    sequence = models.IntegerField(null=False, unique=False)
    depth = models.IntegerField(null=False)
    created = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return "%d" % (self.id)


class CustomUserManager(BaseUserManager):
    def create_user(self, email, department, password):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        try:
            validate_email(email)
        except forms.ValidationError as e:
            raise e

        if not password:
            raise ValueError('Users must have an password')

        user = self.model(
            email=self.normalize_email(email),
			department=department,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, department, password):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            department=department
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    department = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['department']

    def get_id(self):
        return self.id

    def get_full_name(self):
        # The user is identified by their email address
        return self.email

    def get_short_name(self):
        # The user is identified by their email address
        return self.email

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
