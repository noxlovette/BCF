# Generated by Django 5.0.2 on 2024-03-08 14:56

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('common_name', models.CharField(max_length=100, verbose_name='Name')),
                ('latin_name', models.CharField(blank=True, max_length=100, verbose_name='Latin')),
                ('cas', models.CharField(blank=True, max_length=20, verbose_name='CAS')),
                ('family', models.CharField(max_length=50, verbose_name='Olfactory Family')),
                ('ingredient_type', models.CharField(choices=[('synthetic', 'Synthetic'), ('essential_oil', 'Essential Oil'), ('resinoid', 'Resinoid'), ('cold_pressed', 'Cold Pressed'), ('absolute', 'Absolute')], max_length=15, verbose_name='Type')),
                ('origin', models.CharField(blank=True, max_length=100, verbose_name='Origin')),
                ('constituents', models.TextField(blank=True, verbose_name='Components')),
                ('strip', models.DurationField(blank=True, verbose_name='Strip life')),
                ('colour', models.CharField(blank=True, max_length=10, verbose_name='Colour')),
                ('olfactory_profile', models.TextField(blank=True, verbose_name='Olfactory Profile')),
                ('use', models.TextField(blank=True, verbose_name='Use')),
                ('is_collection', models.BooleanField(default=False, verbose_name='In Collection')),
            ],
            options={
                'verbose_name': 'Ingredient',
                'verbose_name_plural': 'Ingredients',
                'db_table': 'ingredients',
                'unique_together': {('cas', 'common_name')},
            },
        ),
    ]
