# Generated by Django 5.0.6 on 2024-09-09 10:30

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collection', '0002_customcollectioningredient_uuid_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customcollectioningredient',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
        migrations.AlterField(
            model_name='regularcollectioningredient',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
