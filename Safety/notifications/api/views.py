from rest_framework import generics, permissions

import paginations as cus_paginations
import permissions as cus_permissions
from notifications import reposistories as repo
from .serializers import NotificationSerializer


class NotificationListAPIView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated, cus_permissions.IsOwner,)
    pagination_class = cus_paginations.StandardResultsSetPagination
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user = self.request.user
        return repo.get_notifications_of_user(user)
