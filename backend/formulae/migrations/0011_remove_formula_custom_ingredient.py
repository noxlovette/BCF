# Generated by Django 5.0.4 on 2024-04-27 15:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('formulae', '0010_formulaingredient_percentage'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='formula',
            name='custom_ingredient',
        ),
    ]
