from datetime import datetime, timedelta

from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from utils.cookies import set_cookie


def get_token_for_user(user):
    refresh_token = RefreshToken()
    refresh_token[api_settings.USER_ID_CLAIM] = getattr(user, api_settings.USER_ID_FIELD)
    return str(refresh_token.access_token), str(refresh_token)


def set_cookies_with_access_token(response, access_token):
    return set_cookie(response=response,
                      key='access_token',
                      value=access_token,
                      expires_in=api_settings.ACCESS_TOKEN_LIFETIME,
                      http_only=True,
                      secure=True,
                      samesite='none')


def set_cookies_with_tokens(response, access_token, refresh_token):
    response = set_cookies_with_access_token(response, access_token)

    response = set_cookie(response=response,
                          key='refresh_token',
                          value=refresh_token,
                          expires_in=api_settings.REFRESH_TOKEN_LIFETIME,
                          http_only=True,
                          secure=True,
                          samesite='none')
    return response


def rm_tokens_from_cookies(response):
    response.set_cookie(
        key='access_token',
        expires=datetime.utcnow() - timedelta(days=10),
        httponly=True,
        secure=True,
        samesite='none',
    )
    response.set_cookie(
        key='refresh_token',
        expires=datetime.utcnow() - timedelta(days=10),
        httponly=True,
        secure=True,
        samesite='none',
    )
    return response
