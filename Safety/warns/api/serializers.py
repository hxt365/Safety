from rest_framework import serializers
from rest_framework_gis import serializers as gis_serializers

from users import reposistories as user_repo
from users.models import User
from warns import reposistories as warn_repo
from warns.models import Warn, Photo, Comment


class AuthorSerializer(serializers.HyperlinkedModelSerializer):
    is_followee = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['fullname', 'avatar', 'url', 'is_followee', 'credit_upvote', 'credit_devote']
        extra_kwargs = {
            'url': {'view_name': 'users:detail', 'lookup_field': 'pk'},
        }

    def get_is_followee(self, obj):
        cur_user = self.context['request'].user
        return user_repo.check_is_following(follower=cur_user, followee=obj)


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'src']
        read_only_fields = ['id']

    def save(self, warning, **kwargs):
        photo = Photo.objects.create(warning=warning, src=self.validated_data['src'])
        print(photo)
        return photo


class CommentSerializer(serializers.ModelSerializer):
    user = AuthorSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['user', 'time', 'content', 'photo']
        read_only_fields = ['time']

    def create(self, validated_data):
        context = self.context
        comment = Comment(user=context['request'].user,
                          warning_id=context['warning_id'],
                          content=validated_data['content'],
                          photo=validated_data.get('photo', None), )
        comment.save()
        return comment


class WarningSerializer(gis_serializers.GeoFeatureModelSerializer):
    user = AuthorSerializer(read_only=True)
    url = serializers.HyperlinkedIdentityField(read_only=True, view_name='warnings:detail', lookup_field='pk')
    photos = PhotoSerializer(many=True, required=False, read_only=True)
    comments_url = serializers.HyperlinkedIdentityField(view_name='warnings:comments',
                                                        lookup_field='id',
                                                        lookup_url_kwarg='warning_id',
                                                        read_only=True)
    upvoted = serializers.SerializerMethodField(read_only=True)
    devoted = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Warn
        fields = ['id', 'user', 'topic', 'short_description', 'long_description', 'time', 'url', 'location', 'photos',
                  'comments_url', 'upvote', 'devote', 'created_time', 'upvoted', 'devoted']
        geo_field = 'location'
        read_only_fields = ['id', 'upvote', 'devote', 'comments', 'next_comments', 'created_time']

    def get_upvoted(self, warning):
        user = self.context['request'].user
        return warn_repo.check_upvoted(user=user, warning=warning)

    def get_devoted(self, warning):
        user = self.context['request'].user
        return warn_repo.check_devoted(user=user, warning=warning)

    def create(self, validated_data):
        user = self.context['request'].user
        warning = Warn.objects.create(user=user, **validated_data)

        if 'photos' in self.context['request'].data:
            photos = self.context['request'].data.pop('photos', None)
            for photo in photos:
                p = Photo(warning=warning, src=photo)
                p.save()
        return warning


class NullSerializer(serializers.Serializer):
    pass
