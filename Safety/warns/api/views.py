from rest_framework import generics, permissions, status
from rest_framework.response import Response

import paginations as cus_pagination
import permissions as cus_permissions
from users import reposistories as user_repo
from warns import filters, reposistories as warn_repo
from warns.models import Warn
from .serializers import WarningSerializer, CommentSerializer


class WarningListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = cus_pagination.LargeResultsSetPagination
    serializer_class = WarningSerializer
    filterset_class = filters.WarningFilter
    queryset = Warn.objects.all()


class UsersWarningListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = cus_pagination.LargeResultsSetPagination
    serializer_class = WarningSerializer

    def get_queryset(self):
        uid = self.kwargs['uid']
        qs = Warn.objects.filter(user=user_repo.get_user_by_id(uid))
        return qs


class WarningRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated, cus_permissions.IsOwnerOrReadOnly,)
    serializer_class = WarningSerializer
    queryset = Warn.objects.all()
    lookup_field = 'pk'


class WarningUpvoteAPIView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Warn.objects.all()
    lookup_field = 'pk'
    serializer_class = WarningSerializer

    def post(self, request, *args, **kwargs):
        warning = self.get_object()
        warn_repo.vote_warning(user=request.user, warning=warning, upvote=True)
        serializer = self.serializer_class(warning, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class WarningDevoteAPIView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Warn.objects.all()
    lookup_field = 'pk'
    serializer_class = WarningSerializer

    def post(self, request, *args, **kwargs):
        warning = self.get_object()
        warn_repo.vote_warning(user=request.user, warning=warning, upvote=False)
        serializer = self.serializer_class(warning, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class CommentListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = cus_pagination.StandardResultsSetPagination
    serializer_class = CommentSerializer

    def get_queryset(self):
        warning = warn_repo.get_warning_by_id(id=self.kwargs['warning_id'])
        return warning.comments.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['warning_id'] = self.kwargs['warning_id']
        return context
