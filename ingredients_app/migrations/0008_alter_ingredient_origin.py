# Generated by Django 5.0.3 on 2024-03-15 20:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ingredients_app', '0007_remove_ingredient_strip_ingredient_ifra_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingredient',
            name='origin',
            field=models.TextField(blank=True, null=True, verbose_name='Origin'),
        ),
    ]
