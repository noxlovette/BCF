# Generated by Django 5.0.4 on 2024-05-04 12:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collection', '0011_customcollectioningredient_content_type_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='collectioningredient',
            name='encrypted_impression',
            field=models.BinaryField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='customcollectioningredient',
            name='encrypted_impression',
            field=models.BinaryField(blank=True, null=True),
        ),
    ]
