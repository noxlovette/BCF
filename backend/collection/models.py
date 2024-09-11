from django.db import models
from django.contrib.auth.models import User
from main_project.encryption import decrypt_field, encrypt_field
import uuid

class NewCollectionIngredient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    common_name = models.CharField(max_length=100, verbose_name="Common Name", default="New Ingredient")
    cas = models.CharField(max_length=100, verbose_name="CAS", default="0000-00-0")
    volatility = models.CharField(max_length=100, verbose_name="Volatility", null=True, blank=True)
    use = models.TextField(verbose_name="Use", null=True, blank=True)

    descriptors = models.CharField(verbose_name="Descriptors", default="New Ingredient", max_length=100)

    other_names = models.TextField(verbose_name="Other Names", null=True, blank=True)
    is_restricred = models.BooleanField(default=False, verbose_name="Restricted")
    origin = models.CharField(max_length=100, verbose_name="Origin", null=True, blank=True)

    amount = models.FloatField(default=0, verbose_name="Amount")
    unit = models.CharField(max_length=50, default="g", verbose_name="Unit")
    is_collection = models.BooleanField(default=False, verbose_name="In Collection")

    encrypted_impression = models.BinaryField(null=True, blank=True)
    encrypted_colour = models.BinaryField(null=True, blank=True)
    encrypted_associations = models.BinaryField(null=True, blank=True)
    encrypted_ideas = models.BinaryField(null=True, blank=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Temporary attributes for plaintext data handling
        self._impression = None
        self._colour = None
        self._associations = None
        self._ideas = None

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)
    
    def prepare_for_serialization(self):
        """
        without this, the client will return hell. the decryption takes place here, on the server side.
        """
        self._impression = (
            decrypt_field(self.encrypted_impression)
            if self.encrypted_impression
            else None
        )
        self._colour = (
            decrypt_field(self.encrypted_colour) if self.encrypted_colour else None
        )
        self._associations = (
            decrypt_field(self.encrypted_associations)
            if self.encrypted_associations
            else None
        )
        self._ideas = (
            decrypt_field(self.encrypted_ideas) if self.encrypted_ideas else None
        )

    def refresh_from_db(self, *args, **kwargs):
        """
        decrypts the fields from the database before refreshing the instance. straightforward.
        """
        self._impression = (
            decrypt_field(self.encrypted_impression)
            if self.encrypted_impression
            else None
        )
        self._colour = (
            decrypt_field(self.encrypted_colour) if self.encrypted_colour else None
        )
        self._associations = (
            decrypt_field(self.encrypted_associations)
            if self.encrypted_associations
            else None
        )
        self._ideas = (
            decrypt_field(self.encrypted_ideas) if self.encrypted_ideas else None
        )

        super().refresh_from_db(*args, **kwargs)

    def save(self, *args, **kwargs):
        """
        encrypts the fields before saving the instance. if the amount is negative, raises an error. if the amount is 0,
        and that is also the default, the is_collection field is set to False. if the amount is greater than 0, the
        is_collection field is set to True. the encrypted fields are set to the encrypted versions of the plaintext
        """
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

        # Clear the temporary attributes
        self._impression = None
        self._colour = None
        self._associations = None
        self._ideas = None

        super().save(*args, **kwargs)

    def __str__(self):
        return f"COLLECTION INGREDIENT {self.user.username} {self.common_name}"

    class Meta:
        unique_together = ["user", "id"]
        verbose_name = "Collection Ingredient"
        verbose_name_plural = "Collection Ingredients"
        db_table = "collection_ingredients"
        ordering = ["user", "common_name"]
