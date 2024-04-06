from django.db import models
from django.core.exceptions import ValidationError


class Descriptor(models.Model):
    """
    this model represents an olfactory family/descriptor seen in perfumery
    """
    name = models.CharField(max_length=30)
    description = models.TextField()

    def __str__(self):
        return self.name

    class Meta:
        """
        Gives the verbose name to the families.
        """
        verbose_name = "Descriptor"
        verbose_name_plural = "Descriptors"
        db_table = 'descriptors'


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
    common_name = models.CharField(max_length=200, verbose_name="Name")
    other_names = models.TextField(null=True, blank=True, verbose_name="Other Names")
    cas = models.CharField(max_length=30, null=True, blank=True, verbose_name="CAS")

    # secondary data
    descriptor1 = models.ManyToManyField('Descriptor', related_name='descriptor1', verbose_name='Descriptor 1')
    descriptor2 = models.ManyToManyField('Descriptor', related_name='descriptor2', verbose_name='Descriptor 2')
    descriptor3 = models.ManyToManyField('Descriptor', related_name='descriptor3', verbose_name='Descriptor 3')
    ingredient_type = models.CharField(max_length=15, null=True, verbose_name="Type", choices=INGREDIENT_TYPES)
    use = models.TextField(null=True, blank=True, verbose_name="Use")
    volatility = models.CharField(max_length=20, null=True, blank=True, verbose_name="Volatility")
    is_restricted = models.BooleanField(default=False, null=True, verbose_name="Restricted")

    # applicable only to naturals
    origin = models.TextField(null=True, blank=True, verbose_name="Origin")
    constituents = models.ManyToManyField('self', verbose_name="Constituents", blank=True)

    # arbitrary data
    similar_ingredients = models.ManyToManyField('self', verbose_name="Similar Ingredients", blank=True)

    def clean(self):
        """
        Validate the ingredient data.

        Raises:
            ValidationError: If the strip life is negative, name is empty, family is empty,
                                     or CAS number is required for synthetic ingredients.
        """
        if not self.common_name:
            raise ValidationError('Name cannot be empty')

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
        return reverse('browse:ingredient', args=[str(self.id)])

    def get_descriptors(self):
        """
        Returns the names of the descriptors that define the ingredient
        :return:
        """
        descriptors = []
        for descriptor in [self.descriptor1.all(), self.descriptor2.all(), self.descriptor3.all()]:
            descriptors += [str(d) for d in descriptor]
        return ", ".join(descriptors) if descriptors else "No descriptors found"

    @property
    def to_json(self):
        """
        Returns a dictionary representation of the ingredient
        :return:
        """
        return {
            'id': self.id,
            'common_name': self.common_name,
            'cas': self.cas,
            'descriptors': self.get_descriptors(),
            'type': self.ingredient_type,
            'use': self.use,
            'volatility': self.volatility,
            'is_restricted': "Yes" if self.is_restricted else "No"
        }

    class Meta:
        """
        Gives the verbose name to all ingredients. Raises a database integrity error if same name and cas are added.
        Orders everything by name. Creates a table called ingredients.
        """
        verbose_name = "Ingredient"
        verbose_name_plural = "Ingredients"
        unique_together = ('cas', 'common_name')
        db_table = 'ingredients'
