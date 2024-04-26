from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import User
from collection.models import CollectionIngredient, Ingredient, CustomCollectionIngredient


class Tag(models.Model):
    """
    This is the model of a tag. It is a list of tags that can be associated with a formula.
    """
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'tags'
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
        ordering = ['name']

class Formula(models.Model):
    """
    This the model of a formula. It is a list of ingredients used in a perfume formula.
    In each formula, there is a list of used ingredients and their amount. You can access all IngModels from here
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    tags = models.ManyToManyField(Tag, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.description}"

    class Meta:
        unique_together = ['user', 'name']
        verbose_name = "User's Formula"
        verbose_name_plural = "User's Formulae"
        db_table = 'formulae'
        ordering = ['user', '-updated_at', '-name']


class FormulaIngredient(models.Model):
    """
    This is the model of an ingredient in a formula. It is a list of ingredients used in a perfume formula.
    """
    formula = models.ForeignKey(Formula, on_delete=models.CASCADE, related_name='ingredients')
    collection_ingredient = models.ForeignKey(CollectionIngredient, on_delete=models.CASCADE, null=True, blank=True)
    custom_collection_ingredient = models.ForeignKey(CustomCollectionIngredient, on_delete=models.CASCADE, null=True,
                                                     blank=True)
    amount = models.IntegerField(default=0, verbose_name="Amount")
    unit = models.CharField(max_length=50, default='g', verbose_name="Unit")

    def clean(self):
        """
        Override the clean method to ensure that either collection_ingredient or custom_collection_ingredient is set.
        """
        if not self.collection_ingredient and not self.custom_collection_ingredient:
            raise ValidationError("Either collection_ingredient or custom_collection_ingredient must be set.")

    def get_ingredient(self):
        """
        Return the ingredient associated with this FormulaIngredient.
        """
        if self.collection_ingredient:
            return self.collection_ingredient
        elif self.custom_collection_ingredient:
            return self.custom_collection_ingredient
        else:
            return None

    def get_ingredient_name(self):
        """
        Return the common name of the associated ingredient.
        """
        if self.collection_ingredient:
            return self.collection_ingredient.ingredient.common_name
        elif self.custom_collection_ingredient:
            return self.custom_collection_ingredient.common_name
        else:
            return None

    def __str__(self):
        """
        Return a string representation of the FormulaIngredient.
        """
        ingredient_name = self.get_ingredient_name() or "Unknown Ingredient"
        return f"{self.formula.name} - {ingredient_name} - {self.amount} {self.unit} - {self.id} - {self.collection_ingredient} - {self.custom_collection_ingredient}"

    class Meta:
        db_table = 'formula_ingredients'
        verbose_name = "Ingredient in Formula"
        verbose_name_plural = "Ingredients in Formula"
        ordering = ['formula', 'collection_ingredient__ingredient__common_name']
