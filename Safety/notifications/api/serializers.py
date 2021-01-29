from rest_framework import serializers

from notifications.models import Notification
from warns.api.serializers import AuthorSerializer
from warns.models import Warn


class WarningSerializer(serializers.HyperlinkedModelSerializer):
    user = AuthorSerializer(read_only=True)

    class Meta:
        model = Warn
        fields = ['user', 'topic', 'short_description', 'time', 'url']
        extra_kwargs = {
            'url': {'view_name': 'warnings:detail', 'lookup_field': 'pk'},
        }


class NotificationSerializer(serializers.ModelSerializer):
    warning = WarningSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['warning', 'level', 'time']
        read_only_fields = ['warning', 'level', 'time']
