# Generated by Django 5.0.3 on 2024-03-24 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('browse', '0012_alter_ingredient_common_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingredient',
            name='cas',
            field=models.CharField(blank=True, max_length=30, null=True, verbose_name='CAS'),
        ),
    ]