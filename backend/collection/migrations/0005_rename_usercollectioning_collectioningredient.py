# Generated by Django 5.0.3 on 2024-03-22 15:52

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("browse", "0010_remove_ingredient_associations_and_more"),
        ("collection", "0004_alter_usercollectioning_table"),
        ("formulae", "0002_alter_formula_options_alter_ingformula_options_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name="UserCollectionIng",
            new_name="CollectionIngredient",
        ),
    ]
