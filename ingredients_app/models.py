from django.db import models
from django.core.exceptions import ValidationError


class Family(models.Model):
    """
    this model represents an olfactory family seen in perfumery
    """
    name = models.CharField(max_length=30)
    description = models.TextField()

    def __str__(self):
        return self.name

    class Meta:
        """
        Gives the verbose name to the families.
        """
        verbose_name = "Family"
        verbose_name_plural = "Families"
        db_table = 'family'


class Ingredient(models.Model):
    """
    This model represents an ingredient used in perfumery
    """
    INGREDIENT_TYPES = [
        ('synthetic', 'Synthetic'),
        ('natural', 'Natural'),
        ('base', 'Base')
    ]
    # most important data
    common_name = models.CharField(max_length=100, verbose_name="Name")
    other_names = models.TextField(null=True, blank=True, verbose_name="Other Names")
    latin_name = models.CharField(max_length=100, null=True, blank=True, verbose_name="Latin")
    cas = models.CharField(max_length=20, null=True, blank=True, verbose_name="CAS")

    # secondary data
    family = models.ManyToManyField('Family', related_name='ingredients', verbose_name='Family')
    ingredient_type = models.CharField(max_length=15, null=True, verbose_name="Type", choices=INGREDIENT_TYPES)
    use = models.TextField(null=True, blank=True, verbose_name="Use")
    strip = models.DurationField(verbose_name="Strip life", null=True, blank=True)

    # applicable only to naturals
    origin = models.CharField(max_length=100, null=True, blank=True, verbose_name="Origin")
    constituents = models.TextField(verbose_name="Components", null=True, blank=True)
    olfactory_profile = models.TextField(null=True, blank=True, verbose_name="Olfactory Profile")

    # strip life in seconds
    similar_ingredients = models.ManyToManyField('self', verbose_name="Similar Ingredients", blank=True)

    # subjective data
    colour = models.CharField(max_length=10, verbose_name="Colour", null=True, blank=True)
    impression = models.TextField(verbose_name="Impression", null=True, blank=True)
    associations = models.TextField(verbose_name="Associations", null=True, blank=True)

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

    def get_absolute_url(self):
        """
        Returns the absolute url of the ingredient
        :return:
        """
        from django.urls import reverse
        return reverse('ingredients_app:ingredient', args=[str(self.id)])

    def get_family_names(self):
        """
        Returns the names of the families the ingredient belongs to
        :return:
        """
        return ", ".join([family.name for family in self.family.all()])

    class Meta:
        """
        Gives the verbose name to all ingredients. Raises a database integrity error if same name and cas are added.
        Orders everything by name. Creates a table called ingredients.
        """
        verbose_name = "Ingredient"
        verbose_name_plural = "Ingredients"
        unique_together = ('cas', 'common_name')
        db_table = 'ingredients'
