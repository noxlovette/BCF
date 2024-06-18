# Generated by Django 5.0.3 on 2024-04-18 21:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("collection", "0008_alter_customcollectioningredient_options_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="customcollectioningredient",
            name="use",
            field=models.CharField(
                blank=True, max_length=255, null=True, verbose_name="Use"
            ),
        ),
        migrations.AlterField(
            model_name="customcollectioningredient",
            name="cas",
            field=models.CharField(
                blank=True, max_length=255, null=True, verbose_name="CAS Number"
            ),
        ),
        migrations.AlterField(
            model_name="customcollectioningredient",
            name="volatility",
            field=models.CharField(
                blank=True, max_length=255, null=True, verbose_name="Volatility"
            ),
        ),
    ]
