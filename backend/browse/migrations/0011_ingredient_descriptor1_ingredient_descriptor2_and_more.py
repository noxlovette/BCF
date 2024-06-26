# Generated by Django 5.0.3 on 2024-03-24 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("browse", "0010_remove_ingredient_associations_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="ingredient",
            name="descriptor1",
            field=models.ManyToManyField(
                related_name="descriptor1",
                to="browse.family",
                verbose_name="Descriptor 1",
            ),
        ),
        migrations.AddField(
            model_name="ingredient",
            name="descriptor2",
            field=models.ManyToManyField(
                related_name="descriptor2",
                to="browse.family",
                verbose_name="Descriptor 2",
            ),
        ),
        migrations.AddField(
            model_name="ingredient",
            name="descriptor3",
            field=models.ManyToManyField(
                related_name="descriptor3",
                to="browse.family",
                verbose_name="Descriptor 3",
            ),
        ),
    ]
