# Generated by Django 4.2.6 on 2024-04-22 15:40

import Account.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Account', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='profile_photo',
            field=models.ImageField(blank=True, null=True, upload_to=Account.models.user_profilephoto_file_path),
        ),
    ]
