from django.db.models import F, fields, functions, ExpressionWrapper
from django.shortcuts import get_object_or_404
from django.utils import timezone

from users import reposistories as user_repo
from utils import dtime
from .models import Warn


def get_warning_by_id(id):
    return get_object_or_404(Warn, id=id)


def filter_warnings_within_distance(qs, point, distance):
    return qs.filter(location__distance_lte=(point, distance))


def filter_warnings_by_timedelta(qs, timedelta):
    return qs.filter(time__gte=timezone.now() - timedelta)


def order_warnings_by_rank(qs):
    hours, rank = ranking_algorithm()
    qs = qs.annotate(hours=hours, rank=rank).order_by('-rank', 'hours')
    return qs


def ranking_algorithm():
    # Based on Hacker News' post rank formula
    time_diff = functions.Cast(functions.Now() - F('created_time'), fields.DurationField())
    hours = dtime.duration_to_hours(duration=time_diff)
    rank = ExpressionWrapper((F('upvote') - F('devote') + 1) / ((hours + 2) ** 1.8),
                             output_field=fields.FloatField())
    return hours, rank


def check_upvoted(user, warning):
    return warning.upvoters.filter(id=user.id).exists()


def check_devoted(user, warning):
    return warning.devoters.filter(id=user.id).exists()


def upvote_warning(warning, num_votes):
    warning.upvote = F('upvote') + num_votes
    warning.save()
    warning.refresh_from_db()


def devote_warning(warning, num_votes):
    warning.devote = F('devote') + num_votes
    warning.save()
    warning.refresh_from_db()


def undo_upvote(user, warning):
    upvote_warning(warning=warning, num_votes=-1)
    warning.upvoters.remove(user)
    user_repo.increase_credit(user=warning.user, num_credit=-1)


def undo_devote(user, warning):
    devote_warning(warning=warning, num_votes=-1)
    warning.devoters.remove(user)
    user_repo.decrease_credit(user=warning.user, num_credit=-1)


def upvote_then_increase_author_credit(user, warning):
    upvote_warning(warning=warning, num_votes=1)
    warning.upvoters.add(user)
    user_repo.increase_credit(user=warning.user, num_credit=1)


def devote_then_decrease_author_credit(user, warning):
    devote_warning(warning=warning, num_votes=1)
    warning.devoters.add(user)
    user_repo.decrease_credit(user=warning.user, num_credit=1)


def vote_warning(user, warning, upvote):
    if upvote:
        if not check_upvoted(user=user, warning=warning):
            upvote_then_increase_author_credit(user, warning)
        if check_devoted(user=user, warning=warning):
            undo_devote(user, warning)
    else:  # devote
        if not check_devoted(user=user, warning=warning):
            devote_then_decrease_author_credit(user, warning)
        if check_upvoted(user=user, warning=warning):
            undo_upvote(user, warning)
