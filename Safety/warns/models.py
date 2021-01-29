from django.contrib.gis.db import models

from users.models import User


class Warn(models.Model):
    class Topic(models.TextChoices):
        ACCIDENT_INCIDENT = 'AI'
        THEFT_BURGLARY_ROBBERY = 'TBR'
        CATASTROPHE = 'C'
        DISEASE = 'D'
        OTHER = 'O'

    user = models.ForeignKey(User, related_name='warnings', on_delete=models.CASCADE)
    topic = models.CharField(max_length=3, choices=Topic.choices)
    short_description = models.CharField(max_length=100)
    long_description = models.CharField(max_length=1000)
    location = models.PointField()
    upvote = models.IntegerField(default=0)
    devote = models.IntegerField(default=0)
    upvoters = models.ManyToManyField(User, related_name='upvoted_warnings')
    devoters = models.ManyToManyField(User, related_name='devoted_warnings')
    time = models.DateTimeField(db_index=True)
    created_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.short_description


def warning_photos_path(instance, filename):
    return 'user_{user}/warnings/{wid}/{filename}'.format(user=instance.warning.user.id,
                                                          wid=instance.warning.id,
                                                          filename=filename)


class Photo(models.Model):
    warning = models.ForeignKey(Warn, related_name='photos', on_delete=models.CASCADE)
    src = models.ImageField(upload_to=warning_photos_path)


def comment_photo_path(instance, filename):
    return 'user_{user}/warnings/{wid}/comments/{cid}_{filename}'.format(user=instance.user.id,
                                                                         wid=instance.warning.id,
                                                                         cid=instance.id,
                                                                         filename=filename)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    warning = models.ForeignKey(Warn, related_name='comments', on_delete=models.CASCADE)
    content = models.CharField(max_length=500)
    time = models.DateTimeField(auto_now_add=True)
    photo = models.ImageField(upload_to=comment_photo_path, null=True)

    class Meta:
        ordering = ['-id']
