from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.contrib.auth.models import User
import uuid
from collection.models import (
    CollectionIngredient,
)
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
        db_table = "tags"
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
        ordering = ["name"]


class Formula(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, editable=False, primary_key=True
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    encrypted_name = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_description = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_notes = models.BinaryField(null=True, blank=True, editable=False)

    tags = models.ManyToManyField(Tag, blank=True)
    solvent = models.CharField(max_length=100, blank=True, null=True, default="Ethanol")
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
        self._description = (
            decrypt_field(self.encrypted_description)
            if self.encrypted_description
            else None
        )
        self._name = decrypt_field(self.encrypted_name) if self.encrypted_name else None
        self._notes = (
            decrypt_field(self.encrypted_notes) if self.encrypted_notes else None
        )

        return self

    def refresh_from_db(self, *args, **kwargs):
        self._description = (
            decrypt_field(self.encrypted_description)
            if self.encrypted_description
            else None
        )
        self._name = decrypt_field(self.encrypted_name) if self.encrypted_name else None
        self._notes = (
            decrypt_field(self.encrypted_notes) if self.encrypted_notes else None
        )

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
        verbose_name_plural = "User's Formulas"
        db_table = "formulas"
        ordering = ["user", "-updated_at"]


class FormulaIngredient(models.Model):
    formula = models.ForeignKey(
        Formula, on_delete=models.CASCADE, related_name="ingredients"
    )
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, editable=False, primary_key=True
    )
    common_name = models.CharField(
        max_length=100, verbose_name="Common Name", default="New Ingredient"
    )
    amount = models.IntegerField(default=0, verbose_name="Amount")
    unit = models.CharField(max_length=50, default="g", verbose_name="Unit")
    volatility = models.CharField(
        max_length=50, default="Top", verbose_name="Volatility"
    )
    percentage = models.FloatField(
        default=10,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name="Percentage",
    )

    counterpart = models.ForeignKey(
        CollectionIngredient,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="counterpart",
    )

    class Meta:
        db_table = "formula_ingredients"
        verbose_name = "Ingredient in Formula"
        verbose_name_plural = "Ingredients in Formula"
        ordering = ["formula", "volatility"]
