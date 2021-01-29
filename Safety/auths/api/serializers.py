from rest_framework import serializers


class FacebookSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=255, required=True)
