from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User


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
    It is the foundation for all other models in the app, excluding the user, formula, and descriptor models
    :param common_name: the ingredient's most frequently used name or a name that is easily recognizable
    :type common_name: str
    :param other_names: the ingredient's other names, aka synonyms
    :type other_names: str
    :param cas: the ingredient's CAS number
    :type cas: str
    :param descriptor1: the ingredient's first descriptor (primary descriptor)
    :type descriptor1: Descriptor
    :param descriptor2: the ingredient's second descriptor (secondary descriptor)
    :type descriptor2: Descriptor
    :param descriptor3: the ingredient's third descriptor (tertiary descriptor)
    :type descriptor3: Descriptor
    :param ingredient_type: the ingredient's type (synthetic, natural, or base)
    :type ingredient_type: str
    :param use: where to apply the ingredient
    :type use: str
    :param volatility: the ingredient's volatility – from base to head
    :type volatility: str
    :param is_restricted: whether the ingredient occurs in IFRA's restricted list as per Amendment 51
    :type is_restricted: bool
    :param origin: the ingredient's origin, applicable to naturals; if synthetic, the origin is the manufacturer
    :type origin: str
    :type constituents: Ingredient
    :param similar_ingredients: ingredients that share similar properties, like linallyl acetate and linalool
    :type similar_ingredients: Ingredient
    :param contributors: the users who have contributed to the ingredient
    :type contributors: User
    """
    INGREDIENT_TYPES = [
        ('synthetic', 'Synthetic'),
        ('natural', 'Natural'),
        ('base', 'Base')
    ]

    # primary data
    common_name = models.CharField(max_length=200, verbose_name="Name")
    other_names = models.TextField(null=True, blank=True, verbose_name="Other Names")
    cas = models.CharField(max_length=30, null=True, blank=True, verbose_name="CAS")

    # secondary data. descriptors exist independently and have no hierarchy over each other
    descriptor1 = models.ManyToManyField('Descriptor', related_name='descriptor1', verbose_name='Descriptor 1')
    descriptor2 = models.ManyToManyField('Descriptor', related_name='descriptor2', verbose_name='Descriptor 2')
    descriptor3 = models.ManyToManyField('Descriptor', related_name='descriptor3', verbose_name='Descriptor 3')

    ingredient_type = models.CharField(max_length=15, null=True, verbose_name="Type", choices=INGREDIENT_TYPES)
    use = models.TextField(null=True, blank=True, verbose_name="Use")
    volatility = models.CharField(max_length=20, null=True, blank=True, verbose_name="Volatility")

    # tertiary data
    is_restricted = models.BooleanField(default=False, null=True, verbose_name="Restricted")
    origin = models.TextField(null=True, blank=True, verbose_name="Origin")
    constituents = models.ManyToManyField('self', verbose_name="Constituents", blank=True)

    # arbitrary data. depends fully on use rcontributions
    similar_ingredients = models.ManyToManyField('self', verbose_name="Similar Ingredients", blank=True)

    # this field represents the users that have contributed to the ingredient
    contributors = models.ManyToManyField(User, related_name='contributors')

    def clean(self):
        """
        Validate the ingredient data.
        Raises a validation error if the name is empty or if the ingredient type is synthetic and the cas number is empty.
        """
        if not self.common_name:
            raise ValidationError('Name cannot be empty')

        if self.ingredient_type == 'synthetic' and not self.cas:
            raise ValidationError('CAS number is required for synthetic ingredients')

    def __str__(self) -> str:
        """
        Returns a string representation of the ingredient (name), could be a bit more detailed
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
        Returns the names of the descriptors that define the ingredient, otherwise they are not found
        :return:
        """
        descriptors = []
        for descriptor in [self.descriptor1.all(), self.descriptor2.all(), self.descriptor3.all()]:
            descriptors += [str(d) for d in descriptor]
        return ", ".join(descriptors) if descriptors else "No descriptors found"

    class Meta:
        """
        Gives the verbose name to all ingredients. Raises a database integrity error if same name and cas are added.
        Orders everything by common name. Creates a table called ingredients.
        """
        verbose_name = "Ingredient"
        verbose_name_plural = "Ingredients"
        unique_together = ('cas', 'common_name')
        db_table = 'ingredients'


class SuggestedIngredient(models.Model):
    """
    This model represents an ingredient suggested by a user. the fields are the same as the ingredient model.
    The only difference is that here you have a message field if the user wants to communicate something, and date_suggested
    lets me filter the requests by date.
    The connection between the suggestion and the ingredient exists, but the ingredient model cannot be affected unless
    the suggestion has been approved and manually transferred into the model.
    """

    # the user fills these out
    common_name = models.CharField(max_length=200, verbose_name="Name", default="unchanged")
    other_names = models.TextField(null=True, blank=True, verbose_name="Other Names", default="unchanged")
    cas = models.CharField(max_length=30, null=True, blank=True, verbose_name="CAS", default="unchanged")
    ingredient_type = models.CharField(max_length=15, null=True, verbose_name="Type", default="unchanged")
    use = models.TextField(null=True, blank=True, verbose_name="Use", default=1)
    volatility = models.CharField(max_length=20, null=True, blank=True, verbose_name="Volatility", default="unchanged")
    is_restricted = models.BooleanField(null=True, verbose_name="Restricted", default=None)
    origin = models.TextField(null=True, blank=True, verbose_name="Origin", default="unchanged")
    constituents = models.TextField(verbose_name="Constituents", blank=True, null=True, default="unchanged")
    similar_ingredients = models.TextField(verbose_name="Similar Ingredients", blank=True, null=True, default=None)
    message = models.TextField(null=True, blank=True)

    # the system fills these out
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, default=None)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    date_suggested = models.DateTimeField(auto_now_add=True)

    status = models.CharField(max_length=20, default='pending',
                              choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')])

    class Meta:
        """
        Gives the verbose name to the suggested ingredients. Creates a table called suggested_ingredients.
        """
        verbose_name = "suggested ingredient"
        verbose_name_plural = "suggested ingredients"
        db_table = 'suggested_ingredients'
