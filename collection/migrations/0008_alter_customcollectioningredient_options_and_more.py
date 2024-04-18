# Generated by Django 5.0.3 on 2024-04-18 21:16

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collection', '0007_customcollectioningredient'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='customcollectioningredient',
            options={'ordering': ['user', 'common_name'], 'verbose_name': 'Custom Ingredient', 'verbose_name_plural': 'Custom Ingredients'},
        ),
        migrations.AddField(
            model_name='customcollectioningredient',
            name='amount',
            field=models.IntegerField(default=0, verbose_name='Amount'),
        ),
        migrations.AddField(
            model_name='customcollectioningredient',
            name='associations',
            field=models.TextField(blank=True, null=True, verbose_name='Associations'),
        ),
        migrations.AddField(
            model_name='customcollectioningredient',
            name='colour',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Colour'),
        ),
        migrations.AddField(
            model_name='customcollectioningredient',
            name='date_added',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='Date Added'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customcollectioningredient',
            name='impression',
            field=models.TextField(blank=True, null=True, verbose_name='Impression'),
        ),
        migrations.AddField(
            model_name='customcollectioningredient',
            name='is_collection',
            field=models.BooleanField(default=False, verbose_name='In Collection'),
        ),
        migrations.AddField(
            model_name='customcollectioningredient',
            name='notes',
            field=models.TextField(blank=True, null=True, verbose_name='Notes'),
        ),
        migrations.AddField(
            model_name='customcollectioningredient',
            name='unit',
            field=models.CharField(default='g', max_length=50, verbose_name='Unit'),
        ),
        migrations.AddField(
            model_name='customcollectioningredient',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='collectioningredient',
            name='date_added',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Date Added'),
        ),
        migrations.AlterField(
            model_name='collectioningredient',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
