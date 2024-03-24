from django.db import models
from django.contrib.auth.models import User
from collection.models import CollectionIngredient, Ingredient


# Create your models here.

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
        return self.name

    @property
    # adjust to liking. to_json for ingredients – find below
    def to_json(self):
        return {
            "user": self.user.username,
            "name": self.name,
            "description": self.description,
            "ingredients": [ing.to_json for ing in self.formulaingredient_set.all()],
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S")
        }

    class Meta:
        unique_together = ['user', 'name']
        verbose_name = "Formula in Collection"
        verbose_name_plural = "Formulae in Collection"
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

    @property
    # This is a property, not a method. It is called without parentheses. Amount and unit from this model,
    # not collection ing
    def to_json(self):
        return {
            "ingredient": self.collection_ingredient.ingredient.common_name,
            "cas": self.collection_ingredient.ingredient.cas,
            "volatility": self.collection_ingredient.ingredient.volatility,
            "use": self.collection_ingredient.ingredient.use,
            "amount": self.amount,
            "unit": self.unit
        }

    class Meta:
        db_table = 'ing_formula'
        verbose_name = "Ingredient in Formula"
        verbose_name_plural = "Ingredients in Formula"
        ordering = ['formula', 'collection_ingredient__ingredient__common_name']
