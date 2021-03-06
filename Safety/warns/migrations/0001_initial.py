# Generated by Django 3.1.4 on 2020-12-03 23:25

from django.conf import settings
import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion
import warns.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Warn',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('topic', models.CharField(choices=[('AI', 'Accident Incident'), ('TBR', 'Theft Burglary Robbery'), ('C', 'Catastrophe'), ('D', 'Disease'), ('O', 'Other')], max_length=3)),
                ('short_description', models.CharField(max_length=100)),
                ('long_description', models.CharField(max_length=1000)),
                ('location', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('vote', models.IntegerField(default=0)),
                ('devote', models.IntegerField(default=0)),
                ('time', models.DateTimeField()),
                ('created_time', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='warnings', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', models.ImageField(upload_to=warns.models.warning_photos_path)),
                ('warning', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='photos', to='warns.warn')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('photo', models.ImageField(upload_to=warns.models.comment_photo_path)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('warning', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='warns.warn')),
            ],
        ),
    ]
