#-*- coding: utf-8 -*-

from rest_framework import permissions
import logging


logger = logging.getLogger('command')

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        print request.user

        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return obj.owner == request.user

# 소유자를 제외하고는 POST, Get만 가능
class IsAdminOrIsOwnerOrPostGet(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_permission(self, request, view):
        logger.info('has_permission')
        if request.method == 'POST':
            return True

        if request.method == 'GET':
            return True

        if request.user.is_staff:
            return True

        return False
        """
        if request.method == 'POST':
            return True

        return obj.get_id() == request.user.get_id()
        """

    def has_object_permission(self, request, view, obj):
        logger.info('has_object_permission')
        if request.method == 'POST':
            return True

        return obj.get_id() == request.user.get_id()
