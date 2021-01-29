from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models
from django.core import validators
from rest_framework.reverse import reverse


class User(AbstractUser):
    class Gender(models.TextChoices):
        MALE = 'M'
        FEMALE = 'F'
        OTHER = 'O'

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    avatar = models.URLField()
    gender = models.CharField(max_length=1, choices=Gender.choices, default=Gender.OTHER)
    age = models.IntegerField(null=True, validators=[validators.MinValueValidator(13)])
    location = models.PointField(null=True)
    credit_upvote = models.IntegerField(default=0)
    credit_devote = models.IntegerField(default=0)
    followees = models.ManyToManyField('self', related_name='followers', symmetrical=False)

    def __str__(self):
        return self.get_full_name()

    @property
    def fullname(self):
        return self.get_full_name()

    def get_absolute_path(self):
        return reverse('users::detail', kwargs={'pk': self.id})
