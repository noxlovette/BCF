# Generated by Django 5.0.3 on 2024-03-24 16:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('browse', '0013_alter_ingredient_cas'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ingredient',
            name='family',
        ),
    ]