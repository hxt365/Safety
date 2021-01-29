from django.db.models import signals
from django.dispatch import receiver

from warns.models import Warn
from . import reposistories as repo


@receiver(signals.post_save, sender=Warn)
def create_notifications(sender, instance, created, **kwargs):
    if created:
        repo.create_notifications(warning=instance)
