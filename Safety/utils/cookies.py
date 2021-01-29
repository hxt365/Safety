from datetime import datetime


def set_cookie(response, key, value, expires_in, http_only=False, secure=False, samesite=None):
    expires = datetime.utcnow() + expires_in
    response.set_cookie(
        key=key,
        value=value,
        expires=expires,
        httponly=http_only,
        secure=secure,
        samesite=samesite,
    )
    return response


def get_cookie(request, key):
    return request.COOKIES.get(key, None)
