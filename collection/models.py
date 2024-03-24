from django.db import models
from django.contrib.auth.models import User
from browse.models import Ingredient


# Create your models here.

class CollectionIngredient(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.IntegerField(default=0, verbose_name="Amount")
    unit = models.CharField(max_length=50, default='g', verbose_name="Unit")
    colour = models.CharField(max_length=10, verbose_name="Colour", null=True, blank=True)
    impression = models.TextField(verbose_name="Impression", null=True, blank=True)
    associations = models.TextField(verbose_name="Associations", null=True, blank=True)
    notes = models.TextField(verbose_name="Notes", null=True, blank=True)
    is_collection = models.BooleanField(default=False, verbose_name="In Collection")
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.ingredient.common_name} - {self.amount} {self.unit}"

    @property
    def to_json(self):
        return {
            "user": self.user.username,
            "ingredient": self.ingredient.common_name,
            "cas": self.ingredient.cas,
            "volatility": self.ingredient.volatility,
            "use": self.ingredient.use,
            "amount": self.amount,
            "unit": self.unit,
            "colour": self.colour,
            "impression": self.impression,
            "associations": self.associations,
            "notes": self.notes,
            "is_collection": "Yes" if self.is_collection else "No",
            "date_added": self.date_added.strftime("%Y-%m-%d %H:%M:%S")
        }

    def save(self, *args, **kwargs):
        """
        Override the save method to handle is_collection when amount is 0.
        """
        if self.amount < 0:
            raise ValueError("The amount cannot be negative.")
        elif self.amount == 0:
            self.is_collection = False
        else:
            self.is_collection = True
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ['user', 'ingredient']
        verbose_name = "Ingredient in Collection"
        verbose_name_plural = "Ingredients in Collection"
        db_table = 'user_collection_ing'
        ordering = ['user', 'ingredient']
