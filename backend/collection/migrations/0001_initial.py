# Generated by Django 5.0.3 on 2024-03-16 07:46

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("browse", "0010_remove_ingredient_associations_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="UserCollectionIng",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("amount", models.IntegerField()),
                ("unit", models.CharField(default="g", max_length=50)),
                (
                    "colour",
                    models.CharField(
                        blank=True, max_length=10, null=True, verbose_name="Colour"
                    ),
                ),
                (
                    "impression",
                    models.TextField(blank=True, null=True, verbose_name="Impression"),
                ),
                (
                    "associations",
                    models.TextField(
                        blank=True, null=True, verbose_name="Associations"
                    ),
                ),
                (
                    "notes",
                    models.TextField(blank=True, null=True, verbose_name="Notes"),
                ),
                (
                    "is_collection",
                    models.BooleanField(default=False, verbose_name="In Collection"),
                ),
                ("date_added", models.DateTimeField(auto_now_add=True)),
                (
                    "ingredient",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="browse.ingredient",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
