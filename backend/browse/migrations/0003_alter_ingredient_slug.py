# Generated by Django 5.0.6 on 2024-09-07 17:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("browse", "0002_ingredient_slug"),
    ]

    operations = [
        migrations.AlterField(
            model_name="ingredient",
            name="slug",
            field=models.SlugField(blank=True, max_length=255),
        ),
    ]
