from django.db import models
from django.contrib.auth.models import User
from ingredients_app.models import Ingredient


# Create your models here.

class UserCollectionIng(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.IntegerField()
    unit = models.CharField(max_length=50, default='g')
    colour = models.CharField(max_length=10, verbose_name="Colour", null=True, blank=True)
    impression = models.TextField(verbose_name="Impression", null=True, blank=True)
    associations = models.TextField(verbose_name="Associations", null=True, blank=True)
    notes = models.TextField(verbose_name="Notes", null=True, blank=True)
    is_collection = models.BooleanField(default=False, verbose_name="In Collection")
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.ingredient.common_name} - {self.amount} {self.unit}"

    def save(self, *args, **kwargs):
        """
        Override the save method to handle is_collection when amount is 0.
        """
        if self.amount < 0:
            raise ValueError("The amount cannot be negative.")
        elif self.amount == 0:
            self.is_collection = False
        super().save(*args, **kwargs)
