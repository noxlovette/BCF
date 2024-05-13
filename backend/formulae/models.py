from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.contrib.auth.models import User
from collection.models import RegularCollectionIngredient, Ingredient, CustomCollectionIngredient
from main_project.encryption import decrypt_field, encrypt_field


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
    In each formula, there is a list of used ingredients and their amount. You can access all IngModels from here.
    :param user: The user who created the formula.
    :param encrypted_name: The name of the formula, encrypted.
    :param encrypted_description: The description of the formula, encrypted. To give the idea of the formula.
    :param encrypted_notes: The notes to the formula, encrypted. stores info such as the inspiration for the formula,
    dunno, anything really.
    :param tags: The tags associated with the formula. not really implemented in the first version.
    :param solvent: The solvent used in the formula.
    :param created_at: The date and time the formula was created.
    :param updated_at: The date and time the formula was last updated.

    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    encrypted_name = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_description = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_notes = models.BinaryField(null=True, blank=True, editable=False)

    tags = models.ManyToManyField(Tag, blank=True)
    solvent = models.CharField(max_length=100, blank=True, null=True, default='Ethanol')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._description = None
        self._name = None
        self._notes = None

    def prepare_for_serialization(self):
        """
        the encryption-decryption logic repeats the same pattern as the CollectionIngredient model. the plaintext data is
        stored in temporary attributes, and the encrypted fields are set to the encrypted versions of the plaintext.
        """
        self._description = decrypt_field(self.encrypted_description) if self.encrypted_description else None
        self._name = decrypt_field(self.encrypted_name) if self.encrypted_name else None
        self._notes = decrypt_field(self.encrypted_notes) if self.encrypted_notes else None

        return self

    def refresh_from_db(self, *args, **kwargs):
        self._description = decrypt_field(self.encrypted_description) if self.encrypted_description else None
        self._name = decrypt_field(self.encrypted_name) if self.encrypted_name else None
        self._notes = decrypt_field(self.encrypted_notes) if self.encrypted_notes else None

        super().refresh_from_db(*args, **kwargs)

    def save(self, *args, **kwargs):
        if self._description:
            self.encrypted_description = encrypt_field(self._description)
        if self._name:
            self.encrypted_name = encrypt_field(self._name)
        if self._notes:
            self.encrypted_notes = encrypt_field(self._notes)

        # Clear the temporary attributes.
        self._description = None
        self._name = None
        self._notes = None

        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "User's Formula"
        verbose_name_plural = "User's Formulae"
        db_table = 'formulae'
        ordering = ['user', '-updated_at']


class FormulaIngredient(models.Model):
    """
    This is the model of an ingredient in a formula. Together, they create the list of ingredients associated with a
    formula. This is the paramount Foreign key. The only unique fields are the amount, unit and percentage. The rest of
    the fields are foreign keys to the Ingredient model. The percentage field is used to calculate the amount of the
    ingredient in the formula. The amount and unit fields are used to store the amount of the ingredient in the formula.
    :param formula: The formula to which the ingredient belongs.
    :param collection_ingredient: The collection ingredient used in the formula. IF it is the regular one!
    :param custom_collection_ingredient: The custom collection ingredient used in the formula. IF it is a custom one!
    :param amount: The amount of the ingredient in the formula.
    :param unit: The unit of the amount of the ingredient in the formula. I will add oz in the future
    :param percentage: The percentage of the ingredient in the formula, I preset to 100. on the client, the current
    default is 10... I don't know why.
    """
    formula = models.ForeignKey(Formula, on_delete=models.CASCADE, related_name='ingredients')
    collection_ingredient = models.ForeignKey(RegularCollectionIngredient, on_delete=models.CASCADE, null=True, blank=True)
    custom_collection_ingredient = models.ForeignKey(CustomCollectionIngredient, on_delete=models.CASCADE, null=True,
                                                     blank=True)
    amount = models.IntegerField(default=0, verbose_name="Amount")
    unit = models.CharField(max_length=50, default='g', verbose_name="Unit")
    percentage = models.FloatField(
        default=100,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name="Percentage"
    )

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

    class Meta:
        db_table = 'formula_ingredients'
        verbose_name = "Ingredient in Formula"
        verbose_name_plural = "Ingredients in Formula"
        ordering = ['formula', 'collection_ingredient__ingredient__common_name']
