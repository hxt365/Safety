from django.conf import settings
from django.contrib.gis.measure import D
from django.db.models import F
from django.shortcuts import get_object_or_404

from users.models import User


def get_number_of_followers(user):
    return user.followers.count()


def get_user_by_id(id):
    return get_object_or_404(User, id=id)


def follow(user, followee):
    user.followees.add(followee)


def get_users_within_distance(point, min_distance, max_distance):
    if min_distance is None:
        return User.objects.filter(location__distance_lte=(point, max_distance))
    return User.objects \
        .filter(location__distance_lte=(point, max_distance)) \
        .exclude(location__distance_lte=(point, min_distance))


def get_followers_far_away_near_distance(user, point):
    return user.followers.exclude(location__distance_lte=(point, D(m=settings.NEAR_DISTANCE)))


def increase_credit(user, num_credit):
    user.credit_upvote = F('credit_upvote') + num_credit
    user.save()
    user.refresh_from_db()


def decrease_credit(user, num_credit):
    user.credit_devote = F('credit_devote') + num_credit
    user.save()
    user.refresh_from_db()


def check_is_following(follower, followee):
    return follower.followees.filter(id=followee.id).exists()
