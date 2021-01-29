from rest_framework import generics, views, permissions, status
from rest_framework.response import Response

import permissions as cus_permissions
from auths import helpers as auth_helpers
from users import reposistories as repo
from users.models import User
from .serializers import UserSerializer


class UserRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permissions = (cus_permissions.IsOwnerOrReadOnly,)
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'pk'

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        response = auth_helpers.rm_tokens_from_cookies(response)
        return response


class FollowUserAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        followee = repo.get_user_by_id(id=kwargs['followee_id'])
        if request.user == followee:
            return Response(data={'message': 'could not follow'}, status=status.HTTP_400_BAD_REQUEST)
        repo.follow(user=request.user, followee=followee)
        return Response(data={'message': 'followed successfully'}, status=status.HTTP_200_OK)
