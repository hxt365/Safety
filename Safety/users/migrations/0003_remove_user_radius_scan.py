# Generated by Django 3.1.4 on 2020-12-04 23:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20201204_0111'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='radius_scan',
        ),
    ]
