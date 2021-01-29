from braces.views import CsrfExemptMixin
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenViewBase

import auths.helpers
from auths import services
from utils import cookies
from .serializers import FacebookSerializer
from ..helpers import get_token_for_user


class FacebookAuthView(CsrfExemptMixin, APIView):
    def post(self, request):
        serializer = FacebookSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = services.social_auth_by_token(request=request,
                                             backend='facebook',
                                             access_token=serializer.validated_data['token'])
        if user:
            access_token, refresh_token = get_token_for_user(user)
            data = {
                'message': 'successfully login',
                'uid': user.id,
            }
            response = Response(data=data, status=status.HTTP_200_OK)
            response = auths.helpers.set_cookies_with_tokens(response=response,
                                                             access_token=access_token,
                                                             refresh_token=refresh_token)
            return response
        else:
            return Response(data="wrong authentication token", status=status.HTTP_403_FORBIDDEN)


class TokenRefreshView(TokenViewBase):
    def post(self, request, *args, **kwargs):
        data = {'refresh': cookies.get_cookie(request=request, key='refresh_token')}
        serializer = TokenRefreshSerializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response(data={'message': 'refresh token not found'}, status=status.HTTP_403_FORBIDDEN)

        access_token = serializer.validated_data['access']
        response = Response(data={'message': 'refreshed token successfully'}, status=status.HTTP_200_OK)
        response = auths.helpers.set_cookies_with_access_token(response=response,
                                                               access_token=access_token)
        return response


class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        response = Response(data={'message': 'logout successfully'}, status=status.HTTP_200_OK)
        response = auths.helpers.rm_tokens_from_cookies(response)
        return response
