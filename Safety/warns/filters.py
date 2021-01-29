from datetime import timedelta

from django.conf import settings
from django.contrib.gis.measure import D
from django_filters import rest_framework as filters

from warns import reposistories as repo
from warns.models import Warn


class BaseFilterSet(filters.FilterSet):
    def __init__(self, data=None, *args, **kwargs):
        if data is not None:
            data = data.copy()
            for name, f in self.base_filters.items():
                initial = f.extra.get('initial')
                if not data.get(name) and initial:
                    data[name] = initial

        super().__init__(data, *args, **kwargs)


class WarningFilter(BaseFilterSet):
    distance = filters.NumberFilter(method='filter_by_distance', label='distance', initial=settings.MIN_DISTANCE)
    in_hours = filters.NumberFilter(method='filter_by_timedelta', label='in_hours', initial=settings.MIN_TIMEDELTA)
    from_followees = filters.BooleanFilter(method='filter_from_followees', label='from_followees')

    class Meta:
        model = Warn
        fields = ['distance', 'in_hours', 'from_followees']

    def filter_by_distance(self, queryset, name, value):
        value = max(value, settings.MIN_DISTANCE)
        value = min(value, settings.MAX_DISTANCE)

        user = self.request.user
        queryset = repo.filter_warnings_within_distance(qs=queryset,
                                                        point=user.location,
                                                        distance=D(m=value))
        return queryset

    def filter_by_timedelta(self, queryset, name, value):
        value = float(value)
        value = max(value, settings.MIN_TIMEDELTA)
        value = min(value, settings.MAX_TIMEDELTA)

        queryset = repo.filter_warnings_by_timedelta(qs=queryset,
                                                     timedelta=timedelta(hours=value))
        return queryset

    def filter_from_followees(self, queryset, name, value):
        if value:
            user = self.request.user
            followees = user.followees.all()
            queryset = queryset.filter(user__in=followees)
        return queryset

    def filter_queryset(self, queryset):
        if not queryset:
            return queryset

        queryset = super().filter_queryset(queryset)
        queryset = repo.order_warnings_by_rank(queryset)
        return queryset
