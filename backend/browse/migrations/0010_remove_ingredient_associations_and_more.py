# Generated by Django 5.0.3 on 2024-03-16 07:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("browse", "0009_remove_ingredient_ifra"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="ingredient",
            name="associations",
        ),
        migrations.RemoveField(
            model_name="ingredient",
            name="colour",
        ),
        migrations.RemoveField(
            model_name="ingredient",
            name="impression",
        ),
        migrations.RemoveField(
            model_name="ingredient",
            name="is_collection",
        ),
    ]
