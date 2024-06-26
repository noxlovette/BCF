# Generated by Django 5.0.3 on 2024-03-15 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("browse", "0006_remove_family_parent_ingredient_associations_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="ingredient",
            name="strip",
        ),
        migrations.AddField(
            model_name="ingredient",
            name="IFRA",
            field=models.TextField(blank=True, null=True, verbose_name="IFRA"),
        ),
        migrations.AddField(
            model_name="ingredient",
            name="is_restricted",
            field=models.BooleanField(
                default=False, null=True, verbose_name="Restricted"
            ),
        ),
        migrations.AddField(
            model_name="ingredient",
            name="volatility",
            field=models.CharField(
                blank=True, max_length=20, null=True, verbose_name="Volatility"
            ),
        ),
        migrations.AlterField(
            model_name="ingredient",
            name="family",
            field=models.ManyToManyField(
                related_name="ingredients", to="browse.family", verbose_name="Family"
            ),
        ),
    ]
