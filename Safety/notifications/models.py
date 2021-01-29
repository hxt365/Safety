from django.contrib.gis.db import models

from users.models import User
from warns.models import Warn


class Notification(models.Model):
    class Level(models.TextChoices):
        EXTREME = 'E'
        DANGEROUS = 'D'
        NEAR = 'N'
        FROM_FOLLOWEES = 'F'

    user = models.ForeignKey(User, related_name='notifications', on_delete=models.CASCADE)
    warning = models.ForeignKey(Warn, on_delete=models.CASCADE)
    level = models.CharField(max_length=1, choices=Level.choices)
    time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-id']
