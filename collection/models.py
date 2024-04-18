from django.db import models
from django.contrib.auth.models import User
from browse.models import Ingredient


# Create your models here.

class BaseCollectionIngredient(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.IntegerField(default=0, verbose_name="Amount")
    unit = models.CharField(max_length=50, default='g', verbose_name="Unit")
    colour = models.CharField(max_length=50, verbose_name="Colour", null=True, blank=True)
    impression = models.TextField(verbose_name="Impression", null=True, blank=True)
    associations = models.TextField(verbose_name="Associations", null=True, blank=True)
    notes = models.TextField(verbose_name="Notes", null=True, blank=True)
    is_collection = models.BooleanField(default=False, verbose_name="In Collection")
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.common_name} - {self.amount} {self.unit}"

    def save(self, *args, **kwargs):
        """
        Override the save method to handle is_collection when amount is 0.
        """
        try:
            if self.amount < 0:
                raise ValueError("The amount cannot be negative.")
            elif self.amount == 0:
                self.is_collection = False
            else:
                self.is_collection = True
            super().save(*args, **kwargs)
        except (TypeError, ValueError):
            self.amount = 0
            self.is_collection = False
            super().save(*args, **kwargs)

    class Meta:
        abstract = True


class CollectionIngredient(BaseCollectionIngredient):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['user', 'ingredient']
        verbose_name = "Ingredient in Collection"
        verbose_name_plural = "Ingredients in Collection"
        db_table = 'user_collection_ing'
        ordering = ['user', 'ingredient']


class CustomCollectionIngredient(BaseCollectionIngredient):
    common_name = models.CharField(max_length=255, verbose_name="Common Name")
    cas = models.CharField(max_length=255, verbose_name="CAS Number")
    volatility = models.CharField(max_length=255, verbose_name="Volatility")

    def __str__(self):
        return self.common_name

    class Meta:
        verbose_name = "Custom Ingredient"
        verbose_name_plural = "Custom Ingredients"
        db_table = 'custom_collection_ing'
        ordering = ['user', 'common_name']
