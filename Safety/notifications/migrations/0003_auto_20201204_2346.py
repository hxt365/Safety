# Generated by Django 3.1.4 on 2020-12-04 23:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0002_notification_level'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='notification',
            options={'ordering': ['-id']},
        ),
    ]
