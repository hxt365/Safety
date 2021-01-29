from datetime import timedelta

from django.conf import settings
from django.contrib.gis.measure import D
from django.db import transaction
from django.utils import timezone

from users import reposistories as user_repo
from .models import Notification


def bulk_create_notifications(users, warning, level):
    notifications = [Notification(user=user, warning=warning, level=level) for user in users]
    Notification.objects.bulk_create(notifications)


def create_notifications(warning):
    if timezone.now() - warning.time > timedelta(hours=settings.RECENT_TIME):
        return
    
    users_within_extreme_distance = user_repo.get_users_within_distance(point=warning.location,
                                                                        min_distance=None,
                                                                        max_distance=D(m=settings.EXTREME_DISTANCE))
    users_within_dangerous_distance = user_repo.get_users_within_distance(point=warning.location,
                                                                          min_distance=D(m=settings.EXTREME_DISTANCE),
                                                                          max_distance=D(m=settings.DANGEROUS_DISTANCE))
    users_within_near_distance = user_repo.get_users_within_distance(point=warning.location,
                                                                     min_distance=D(m=settings.DANGEROUS_DISTANCE),
                                                                     max_distance=D(m=settings.NEAR_DISTANCE))
    followers_far_away_near_distance = user_repo.get_followers_far_away_near_distance(user=warning.user,
                                                                                      point=warning.location)
    with transaction.atomic():
        # need to handle database errors
        for (users, warning, level) in zip([users_within_extreme_distance,
                                            users_within_dangerous_distance,
                                            users_within_near_distance,
                                            followers_far_away_near_distance],
                                           [warning] * 4,
                                           [Notification.Level.EXTREME,
                                            Notification.Level.DANGEROUS,
                                            Notification.Level.NEAR,
                                            Notification.Level.FROM_FOLLOWEES]):
            bulk_create_notifications(users=users, warning=warning, level=level)


def get_notifications_of_user(user):
    return Notification.objects.filter(user=user)