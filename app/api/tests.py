#-*- coding: utf-8 -*-

from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Article
from django.db.models import F
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()

class UserTests(APITestCase):
    email = 'test@example.com'
    password = '1234'

    def setUp(self):
        data = {
            'email': self.email,
            'password': self.password
        }
        self.client.post('/api/users/', data, format='json')
        self.client.login(email=self.email, password=self.password)

    # 사용자 신규 등록
    def test_create_user(self):
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.last().get_full_name(), self.email)

    # 본인(사용자) 정보 조회
    def test_get_user_info(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.data['email'], self.email)

class ArticleTests(APITestCase):
    email = 'test@example.com'
    password = '1234'
    article = {
        'contentType': 'A',
        'title': 'test-title',
        'content': 'test-content',
        'updatedTitle': 'test-updated-title',
        'updatedContent': 'test-updated-content'
    }
    comment = {
        'contentType': 'C',
        'content': 'test-comment-content',
        'updatedContent': 'test-updated-comment-content'
    }

    def setUp(self):
        data = {
            'email': self.email,
            'password': self.password
        }
        self.client.post('/api/users/', data, format='json')
        self.client.login(email=self.email, password=self.password)

    def createArticle(self):
        data = {
            'title': self.article['title'],
            'content_type': self.article['contentType'],
            'content': self.article['content']
        }
        return self.client.post('/api/articles/', data, format='json')

    # 게시물 등록
    def test_create_article(self):
        self.createArticle()
        self.assertEqual(Article.objects.count(), 1)

    def readArticle(self, id):
        return self.client.get('/api/articles/'+str(id)+'/')

    # 게시물 조회
    def test_read_article(self):
        response = self.createArticle()
        articleId = response.data['id']
        response = self.readArticle(articleId)
        self.assertEqual(response.data['title'], self.article['title'])
        self.assertEqual(response.data['content'], self.article['content'])
        return response

    def updateArticle(self, id):
        data = {
            'title': self.article['updatedTitle'],
            'content_type': self.article['contentType'],
            'content': self.article['updatedContent']
        }
        return self.client.put('/api/articles/'+str(id)+'/', data, format='json')


    # 게시물 수정
    ## 소유자 또는 관리자만 가능
    def test_update_article(self):
        response = self.createArticle()
        articleId = response.data['id']
        response = self.updateArticle(articleId)
        self.assertEqual(response.data['title'], self.article['updatedTitle'])
        self.assertEqual(response.data['content'], self.article['updatedContent'])

    def deleteArticle(self, id):
        return self.client.delete('/api/articles/'+str(id)+'/')

    # 게시물 삭제
    ## 소유자 또는 관리자만 가능
    def test_delete_article(self):
        response = self.createArticle()
        articleId = response.data['id']
        response = self.deleteArticle(articleId)
        self.assertEqual(Article.objects.count(), 0)

    def createComment(self, parentId):
        data = {
            'content_type': self.comment['contentType'],
            'content': self.comment['content']
        }
        return self.client.post('/api/articles/'+str(parentId)+'/comment/', data, format='json')

    # 댓글 등록
    def test_create_comment(self):
        response = self.createArticle()
        articleId = response.data['id']
        response = self.createComment(articleId)
        self.assertEqual(Article.objects.count(), 2)
        self.assertEqual(response.data['content'], self.comment['content'])
        self.assertEqual(response.data['sequence'], 2)
        self.assertEqual(response.data['depth'], 1)

    # 댓글에 댓글 등록
    def test_create_comment_comment(self):
        response = self.createArticle()
        articleId = response.data['id']
        response = self.createComment(articleId)
        commentId = response.data['id']
        response = self.createComment(commentId)
        self.assertEqual(Article.objects.count(), 3)
        self.assertEqual(response.data['content'], self.comment['content'])
        self.assertEqual(response.data['sequence'], 3)
        self.assertEqual(response.data['depth'], 2)
