# Generated by Django 5.0.3 on 2024-03-17 09:50

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("browse", "0010_remove_ingredient_associations_and_more"),
        ("collection", "0002_alter_usercollectioning_amount_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="usercollectioning",
            options={
                "ordering": ["user", "ingredient"],
                "verbose_name": "Ingredient in Collection",
                "verbose_name_plural": "Ingredients in Collection",
            },
        ),
        migrations.AlterUniqueTogether(
            name="usercollectioning",
            unique_together={("user", "ingredient")},
        ),
    ]
