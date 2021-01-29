from rest_framework import serializers
from rest_framework_gis import serializers as gis_serializers

from users import reposistories as repo
from users.models import User


class UserSerializer(gis_serializers.GeoFeatureModelSerializer):
    num_followers = serializers.SerializerMethodField(read_only=True)
    is_followee = serializers.SerializerMethodField(read_only=True)
    warnings_url = serializers.HyperlinkedIdentityField(view_name='warnings:user',
                                                        lookup_field='id',
                                                        lookup_url_kwarg='uid',
                                                        read_only=True)

    class Meta:
        model = User
        fields = ['id', 'fullname', 'first_name', 'last_name', 'gender', 'age', 'avatar', 'warnings_url',
                  'is_followee', 'credit_upvote', 'credit_devote', 'num_followers', 'location']
        read_only_fields = ['id', 'fullname', 'credit_upvote', 'credit_devote', 'avatar']
        geo_field = 'location'

    def get_num_followers(self, obj):
        return repo.get_number_of_followers(user=obj)

    def get_is_followee(self, obj):
        cur_user = self.context['request'].user
        if not cur_user.is_authenticated:
            return False
        return repo.check_is_following(follower=cur_user, followee=obj)

    def update(self, instance, validated_data):
        for attr, val in validated_data.items():
            if val is None:
                val = getattr(instance, attr)
            setattr(instance, attr, val)
        instance.save()
        return instance
