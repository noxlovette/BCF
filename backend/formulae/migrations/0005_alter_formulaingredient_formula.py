# Generated by Django 5.0.3 on 2024-04-13 19:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("formulae", "0004_alter_formula_options_alter_formulaingredient_table"),
    ]

    operations = [
        migrations.AlterField(
            model_name="formulaingredient",
            name="formula",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="ingredients",
                to="formulae.formula",
            ),
        ),
    ]
