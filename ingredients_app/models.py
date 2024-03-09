from django.db import models
from django.core.exceptions import ValidationError


class Ingredient(models.Model):
    """
    This model represents an ingredient used in perfumery
    """
    INGREDIENT_TYPES = [
        ('synthetic', 'Synthetic'),
        ('essential_oil', 'Essential Oil'),
        ('resinoid', 'Resinoid'),
        ('cold_pressed', 'Cold Pressed'),
        ('absolute', 'Absolute'),
    ]
    common_name = models.CharField(max_length=100, verbose_name="Name")
    latin_name = models.CharField(max_length=100, null=True, blank=True, verbose_name="Latin")
    cas = models.CharField(max_length=20, null=True, blank=True, verbose_name="CAS")
    family = models.CharField(max_length=50, null=True, verbose_name="Olfactory Family")
    ingredient_type = models.CharField(max_length=15, null=True, verbose_name="Type", choices=INGREDIENT_TYPES)
    origin = models.CharField(max_length=100, null=True, blank=True, verbose_name="Origin")
    constituents = models.TextField(verbose_name="Components", null=True, blank=True)
    # strip life in seconds
    strip = models.DurationField(verbose_name="Strip life", null=True, blank=True)
    colour = models.CharField(max_length=10, verbose_name="Colour", null=True, blank=True)
    olfactory_profile = models.TextField(null=True, blank=True, verbose_name="Olfactory Profile")
    use = models.TextField(null=True, blank=True, verbose_name="Use")
    is_collection = models.BooleanField(default=False, null=True, verbose_name="In Collection")

    def clean(self):
        """
        Validate the ingredient data.

        Raises:
            ValidationError: If the strip life is negative, name is empty, family is empty,
                                     or CAS number is required for synthetic ingredients.
        """
        try:
            if self.strip.total_seconds() < 0:
                raise ValidationError('Strip life must be a positive duration')
        except AttributeError:
            pass

        if not self.common_name:
            raise ValidationError('Name cannot be empty')

        if not self.family:
            raise ValidationError('Family is mandatory')

        if self.ingredient_type == 'synthetic' and not self.cas:
            raise ValidationError('CAS number is required for synthetic ingredients')

    def __str__(self) -> str:
        """
        Returns a string representation of the ingredient (name)
        :return:
        """

        return self.common_name

    class Meta:
        """
        Gives the verbose name to all ingredients. Raises a database integrity error if same name and cas are added.
        Orders everything by name. Creates a table called ingredients.
        """
        verbose_name = "Ingredient"
        verbose_name_plural = "Ingredients"
        unique_together = ('cas', 'common_name')
        db_table = 'ingredients'
