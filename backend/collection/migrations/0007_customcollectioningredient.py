# Generated by Django 5.0.3 on 2024-04-18 19:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("collection", "0006_alter_collectioningredient_colour"),
    ]

    operations = [
        migrations.CreateModel(
            name="CustomCollectionIngredient",
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
                (
                    "common_name",
                    models.CharField(max_length=255, verbose_name="Common Name"),
                ),
                ("cas", models.CharField(max_length=255, verbose_name="CAS Number")),
                (
                    "volatility",
                    models.CharField(max_length=255, verbose_name="Volatility"),
                ),
            ],
            options={
                "verbose_name": "Custom Ingredient",
                "verbose_name_plural": "Custom Ingredients",
                "db_table": "custom_collection_ing",
                "ordering": ["common_name"],
            },
        ),
    ]
