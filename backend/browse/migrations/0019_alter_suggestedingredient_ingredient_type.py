# Generated by Django 5.0.4 on 2024-05-01 21:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('browse', '0018_alter_suggestedingredient_constituents_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='suggestedingredient',
            name='ingredient_type',
            field=models.CharField(default='unchanged', max_length=15, null=True, verbose_name='Type'),
        ),
    ]
