#-*- coding: utf-8 -*-

from django.shortcuts import render, render_to_response, redirect, get_object_or_404
from django.template.context import RequestContext
from django.conf import settings
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.decorators import detail_route
from django.contrib.auth import get_user_model
from api.permissions import IsOwnerOrReadOnly
from api.permissions import IsAdminOrIsOwnerOrPostGet
from django.db.models import F
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import QueryDict
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.core.validators import validate_email
from django.core import mail
from django.core.exceptions import ObjectDoesNotExist
from django import forms
from datetime import datetime
import api.models as models
import api.serializers as serializers
import os
import json
import logging
import shutil

User = get_user_model()
logger = logging.getLogger('command')
host = 'http://www.yungyikim.com'

def profile_edit(request):
    profile = models.Profile.objects.last()
    logger.info(profile)

    context = RequestContext(
        request,
        {
            'request': request,
            'user': request.user,
            'profile': profile
        })
        
    logger.info(context)
    logger.info(request.user)

    return render_to_response('profile/edit.html', context_instance=context)

def profile(request):
    profile = models.Profile.objects.last()
    logger.info(profile)

    queryset = models.Profile.objects.all().order_by('-id')
    logger.info(queryset)

    context = RequestContext(
        request,
        {
            'request': request,
            'user': request.user,
            'profile': profile
        })

    logger.info(context)
    logger.info(request.user)

    return render_to_response('profile/view.html', context_instance=context)

def home(request):
    context = RequestContext(request, {'request': request, 'user': request.user})
    logger.info(context)
    logger.info(request.user)

    return render_to_response('home.html', context_instance=context)

def thirdauth(request):
   context = RequestContext(request, {'request': request, 'user': request.user})
   logger.info(context)
   logger.info(request.user)

   return render_to_response('thirdauth/main.html',
                             context_instance=context)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = models.Profile.objects.all().order_by('-id')
    serializer_class = serializers.ProfileSerializer
    permission_classes = (IsOwnerOrReadOnly,)

class BoardViewSet(viewsets.ModelViewSet):
    queryset = models.Board.objects.all()
    serializer_class = serializers.BoardSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def list(self, request, *args, **kwargs):
        board_id = request.GET['board_id']
        logger.info('board_id:'+board_id)

        queryset = self.filter_queryset(self.get_queryset()).filter(board=board_id)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ArticleViewSet(viewsets.ModelViewSet):
    #queryset = models.Article.objects.all()
    queryset = models.Article.objects.filter(content_type='A').order_by('-id')
    serializer_class = serializers.ArticleSerializer

    # 객체의 주인만 편집이 가능하다.
    # 나머지 인증된 사용자들은 읽기만 가능하다.
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnly,)

    def createStaticFile(self, id, request):
        logger.info('createStaticFile')
        project_dir = os.path.abspath(os.path.join(os.path.dirname(os.path.realpath(__file__)), '../..'))
        dist_dir = project_dir + '/dist/'

        logger.info(request)

        # SEO
        f = open(dist_dir+'/view.html', 'r')
        data = f.read()
        f.close()

        data = data.decode("utf-8")
        data = data.replace('$title$', request.data['title'])
        data = data.replace('$description$', request.data['summary'])
        data = data.replace('$content$', request.data['content'])
        data = data.encode("utf-8")

        logger.info(data)

        obj = models.Board.objects.get(pk=request.data['board'])
        target_link = '/'+obj.name+'/'+str(id)

        logger.info(obj.name)

        f = open(dist_dir+target_link+'.html', 'w')
        f.write(data)
        f.close()

        # sitemap에 링크 추가
        sitemap_file = '/sitemap.txt'

        if os.path.isfile(dist_dir+sitemap_file) == False:
            shutil.copy(dist_dir+sitemap_file+'.bak', dist_dir+sitemap_file)

        f = open(dist_dir+sitemap_file, 'a')
        f.write(host+target_link+'\n')
        f.close()

    def create(self, request, *args, **kwargs):
        id = 1
        obj = models.Article.objects.last()

        if obj:
            id = obj.id + 1

        request.data['group'] = id
        request.data['sequence'] = 1
        request.data['depth'] = 0
        request.data['owner'] = request.user.get_id()

        logger.info(request.data['board'])

        # 정적파일 생성
        self.createStaticFile(id, request)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        board_id = None
        try:
            board_id = request.GET['board_id']
        except:
            board_id = None

        queryset = None
        if board_id:
            logger.info('board_id:'+board_id)
            queryset = self.filter_queryset(self.get_queryset()).filter(board=board_id)
        else:
            queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        logger.info('retrieve')
        try:
            logger.info('retrieve')
            obj = models.Article.objects.get(pk=pk)
            serializer = self.get_serializer(obj)
            return Response(serializer.data)
        except ObjectDoesNotExist as e:
            logger.info('retrieve')
            return Response(json.dumps('{}'), status=status.HTTP_204_NO_CONTENT, content_type='application/json')

    def update(self, request, *args, **kwargs):
        request.data['owner'] = request.user.get_id()
        partial = kwargs.pop('partial', False)
        obj = self.get_object()
        request.data['group'] = obj.id
        request.data['sequence'] = 1
        request.data['depth'] = 0

        serializer = self.get_serializer(obj, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    @detail_route(methods=['post', 'get'])
    def comment(self, request, pk):
        if request.method == 'POST':
            obj = models.Article.objects.get(pk=pk)

            request.data['group'] = obj.id
            request.data['title'] = 'unused'
            request.data['summary'] = 'unused'

            group = int(obj.group)
            sequence = int(obj.sequence)
            depth = int(obj.depth)

            # 같은 그룹에 속해있는 요소들의 우선순위를 조정한다.
            models.Article.objects.filter(group=group).filter(sequence__gt=sequence).update(sequence=F('sequence')+1)

            newData = QueryDict('', mutable=True)
            newData.update(request.data)
            newData.update({'group':group})
            newData.update({'sequence':sequence+1})
            newData.update({'depth':depth+1})
            newData.update({'owner':request.user.get_id()})

            serializer = self.get_serializer(data=newData)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        elif request.method == 'GET':
            obj = models.Article.objects.get(pk=pk)
            queryset = models.Article.objects.filter(group=obj.group).filter(content_type='C').order_by('sequence')
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
"""
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.order_by(User.USERNAME_FIELD)
    serializer_class = serializers.UserSerializer
    #permission_classes = (permissions.IsAuthenticated,)
    permission_classes = (IsAdminOrIsOwnerOrPostGet,)

    # signup
    @csrf_exempt
    def create(self, request, *args, **kwargs):
        print('create')
        logger.info('create')
        data = {
            'msg': 'success',
            'status': 201
        }
        try:
            if User.objects.filter(email=request.data['email']).exists():
                # 이미 존재하는 이메일이다.
                data['msg'] = 'The email already exists.'
                data['status'] = 400
            else:
                # 신규 사용자 등록
                user = User.objects.create_user(
                    email=request.data['email'],
                    department=1,
                    password=request.data['password']
                )

                # 로그인
                user = authenticate(username=request.data['email'], password=request.data['password'])
                if user is not None:
                    login(request, user)
        except ValueError as e:
            data['msg'] = 'valueError'
            data['status'] = 400
        except KeyError as e:
            data['msg'] = 'required `email` and `password`'
            data['status'] = 400
        except forms.ValidationError as e:
            data['msg'] = 'valueError'
            data['status'] = 400

        return HttpResponse(json.dumps(data), status=data['status'], content_type='application/json')


    # 회원정보 목록이 아니라
    # 로그인된 본인 정보만을 반환한다
    def list(self, request, *args, **kwargs):
        if request.user.is_authenticated() is False:
            return HttpResponse(status=status.HTTP_403_FORBIDDEN)

        obj = User.objects.get(pk=request.user.get_id())
        serializer = self.get_serializer(obj)
        return Response(serializer.data)
"""


"""
def signout(request):
    logout(request)
    return redirect('/')
"""

"""
@csrf_exempt
def signout(request):
    data = {
        'msg': '',
        'status': 400
    }

    if request.method == 'POST':
        if request.user.is_authenticated():
            logout(request)
            data['msg'] = 'success'
            data['status'] = 200
    else:
        data['msg'] = 'post only'

    return HttpResponse(json.dumps(data), status=data['status'], content_type='application/json')
"""

"""
@csrf_exempt
def signin(request):
    data = {
        'msg': '',
        'status': 400
    }

    if request.method == 'POST':
        try:
            requestData = json.loads(request.body.decode('utf-8'))

            if requestData and type(requestData).__name__ == 'dict':
                email = requestData['email']
                password = requestData['password']

                user = authenticate(username=email, password=password)
                if user is not None:
                    if user.is_active:
                        login(request, user)
                        data['msg'] = 'success'
                        data['status'] = 200
                    else:
                        data['msg'] = 'DisabledAccount'
                else:
                    data['msg'] = 'InvalidAccount'
            else:
                data['msg'] = 'invalid parameters'
        except ValueError as e:
            data['msg'] = 'invalid parameters'
        except KeyError as e:
            data['msg'] = 'required `email` and `password`'
    else:
        data['msg'] = 'post only'

    return HttpResponse(json.dumps(data), status=data['status'], content_type='application/json')
"""
