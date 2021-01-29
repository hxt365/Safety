from social_django.utils import psa


@psa()
def social_auth_by_token(request, backend, access_token):
    try:
        user = request.backend.do_auth(access_token=access_token)
        return user
    except Exception:
        return None


