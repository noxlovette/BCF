from django.db import models
from django.contrib.auth.models import User
from browse.models import Ingredient
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from main_project.encryption import decrypt_field, encrypt_field


class BaseCollectionIngredient(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    unit = models.CharField(max_length=50, default='g', verbose_name="Unit")
    is_collection = models.BooleanField(default=False, verbose_name="In Collection")
    date_added = models.DateTimeField(auto_now_add=True, verbose_name="Date Added")
    amount = models.FloatField(default=0, verbose_name="Amount")

    encrypted_impression = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_colour = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_associations = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_ideas = models.BinaryField(null=True, blank=True, editable=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Temporary attributes for plaintext data handling
        self._impression = None
        self._colour = None
        self._associations = None
        self._ideas = None

    def prepare_for_serialization(self):
        self._impression = decrypt_field(self.encrypted_impression) if self.encrypted_impression else None
        self._colour = decrypt_field(self.encrypted_colour) if self.encrypted_colour else None
        self._associations = decrypt_field(self.encrypted_associations) if self.encrypted_associations else None
        self._ideas = decrypt_field(self.encrypted_ideas) if self.encrypted_ideas else None

    def refresh_from_db(self, *args, **kwargs):
        self._impression = decrypt_field(self.encrypted_impression) if self.encrypted_impression else None
        self._colour = decrypt_field(self.encrypted_colour) if self.encrypted_colour else None
        self._associations = decrypt_field(self.encrypted_associations) if self.encrypted_associations else None
        self._ideas = decrypt_field(self.encrypted_ideas) if self.encrypted_ideas else None

        super().refresh_from_db(*args, **kwargs)

    def save(self, *args, **kwargs):
        if self.amount < 0:
            raise ValueError("The amount cannot be negative.")
        elif self.amount == 0:
            self.is_collection = False
        else:
            self.is_collection = True

        if self._impression:
            self.encrypted_impression = encrypt_field(self._impression)
        if self._colour:
            self.encrypted_colour = encrypt_field(self._colour)
        if self._associations:
            self.encrypted_associations = encrypt_field(self._associations)
        if self._ideas:
            self.encrypted_ideas = encrypt_field(self._ideas)

        self._impression = None
        self._colour = None
        self._associations = None
        self._ideas = None

        # Save the instance with the fields encrypted.
        super().save(*args, **kwargs)

    def __str__(self):
        return f" BASE COLLECTION INGREDIENT {self.user.username} {self.amount} {self.unit}"

    class Meta:
        abstract = True


class CollectionIngredient(BaseCollectionIngredient):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)

    def __str__(self):
        return f"regular collection ing {self.user.username} - {self.ingredient.common_name}"

    class Meta:
        unique_together = ['user', 'ingredient']
        verbose_name = "Ingredient in Collection"
        verbose_name_plural = "Ingredients in Collection"
        db_table = 'user_collection_ing'
        ordering = ['user', 'ingredient__common_name']


class CustomCollectionIngredient(BaseCollectionIngredient):
    encrypted_common_name = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_cas = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_use = models.BinaryField(null=True, blank=True, editable=False)
    encrypted_volatility = models.BinaryField(null=True, blank=True, editable=False)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._common_name = None
        self._cas = None
        self._use = None
        self._volatility = None

    def prepare_for_serialization(self):
        super().prepare_for_serialization()
        self._common_name = decrypt_field(self.encrypted_common_name) if self.encrypted_common_name else None
        self._cas = decrypt_field(self.encrypted_cas) if self.encrypted_cas else None
        self._use = decrypt_field(self.encrypted_use) if self.encrypted_use else None
        self._volatility = decrypt_field(self.encrypted_volatility) if self.encrypted_volatility else None

    def save(self, *args, **kwargs):
        if self._common_name:
            self.encrypted_common_name = encrypt_field(self._common_name)
        if self._cas:
            self.encrypted_cas = encrypt_field(self._cas)
        if self._use:
            self.encrypted_use = encrypt_field(self._use)
        if self._volatility:
            self.encrypted_volatility = encrypt_field(self._volatility)

        # Clear the temporary attributes.
        self._common_name = None
        self._cas = None
        self._use = None
        self._volatility = None

        # Save the instance again with the new encrypted fields.
        super().save(*args, **kwargs)

    def refresh_from_db(self, *args, **kwargs):
        self._common_name = decrypt_field(self.encrypted_common_name) if self.encrypted_common_name else None
        self._cas = decrypt_field(self.encrypted_cas) if self.encrypted_cas else None
        self._use = decrypt_field(self.encrypted_use) if self.encrypted_use else None
        self._volatility = decrypt_field(self.encrypted_volatility) if self.encrypted_volatility else None

        super().refresh_from_db(*args, **kwargs)

    class Meta:
        verbose_name = "Custom Ingredient"
        verbose_name_plural = "Custom Ingredients"
        db_table = 'custom_collection_ing'
        ordering = ['user']
