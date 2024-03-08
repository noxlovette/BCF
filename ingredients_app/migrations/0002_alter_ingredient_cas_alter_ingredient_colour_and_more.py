# Generated by Django 5.0.2 on 2024-03-08 15:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ingredients_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingredient',
            name='cas',
            field=models.CharField(blank=True, max_length=20, null=True, verbose_name='CAS'),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='colour',
            field=models.CharField(blank=True, max_length=10, null=True, verbose_name='Colour'),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='constituents',
            field=models.TextField(blank=True, null=True, verbose_name='Components'),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='family',
            field=models.CharField(max_length=50, null=True, verbose_name='Olfactory Family'),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='ingredient_type',
            field=models.CharField(choices=[('synthetic', 'Synthetic'), ('essential_oil', 'Essential Oil'), ('resinoid', 'Resinoid'), ('cold_pressed', 'Cold Pressed'), ('absolute', 'Absolute')], max_length=15, null=True, verbose_name='Type'),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='latin_name',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Latin'),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='olfactory_profile',
            field=models.TextField(blank=True, null=True, verbose_name='Olfactory Profile'),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='origin',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Origin'),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='strip',
            field=models.DurationField(blank=True, null=True, verbose_name='Strip life'),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='use',
            field=models.TextField(blank=True, null=True, verbose_name='Use'),
        ),
    ]
