# Generated by Django 5.0.3 on 2024-03-24 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("browse", "0011_ingredient_descriptor1_ingredient_descriptor2_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="ingredient",
            name="common_name",
            field=models.CharField(max_length=200, verbose_name="Name"),
        ),
    ]
