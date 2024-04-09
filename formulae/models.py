from django.db import models
from django.contrib.auth.models import User
from collection.models import CollectionIngredient, Ingredient


class Formula(models.Model):
    """
    This the model of a formula. It is a list of ingredients used in a perfume formula.
    In each formula, there is a list of used ingredients and their amount. You can access all IngModels from here
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.description}"

    class Meta:
        unique_together = ['user', 'name']
        verbose_name = "User's Formula"
        verbose_name_plural = "User's Formulae"
        db_table = 'formulae'
        ordering = ['user', 'name']


class FormulaIngredient(models.Model):
    """
    This is the model of an ingredient in a formula. It is a list of ingredients used in a perfume formula.
    """
    formula = models.ForeignKey(Formula, on_delete=models.CASCADE)
    collection_ingredient = models.ForeignKey(CollectionIngredient, on_delete=models.CASCADE)
    amount = models.IntegerField(default=0, verbose_name="Amount")
    unit = models.CharField(max_length=50, default='g', verbose_name="Unit")

    def __str__(self):
        return f"{self.formula.name} - {self.collection_ingredient.ingredient.common_name} - {self.amount} {self.unit}"

    class Meta:
        db_table = 'formula_ingredients'
        verbose_name = "Ingredient in Formula"
        verbose_name_plural = "Ingredients in Formula"
        ordering = ['formula', 'collection_ingredient__ingredient__common_name']
