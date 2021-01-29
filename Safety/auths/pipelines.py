import uuid

from users.models import User
from django.conf import settings


def create_user(details, user=None, *args, **kwargs):
    if user:
        return {'is_new': False}

    avatar = "{linkbase}{uid}/picture?type=large".format(linkbase=settings.FACEBOOK_GRAPH, uid=kwargs['uid'])
    user_data = kwargs.get('response', None)

    new_user = User.objects.create_user(
        username=user_data.get('id'),
        password=str(uuid.uuid4()),
        email=details.get('email'),
        first_name=details.get('first_name', ''),
        last_name=details.get('last_name', ''),
        gender=user_data.get('gender', User.Gender.OTHER),
        avatar=avatar,
    )

    return {
        'is_new': True,
        'user': new_user,
    }
