from rest_framework import serializers
from .models import RegularCollectionIngredient, CustomCollectionIngredient
from browse.serialisers import DateTimeSerializer


class CollectionIngredientSerializer(serializers.ModelSerializer):
    """
    Abstract serializer for CollectionIngredient models. It includes common fields for both RegularCollectionIngredient
    and CustomCollectionIngredient models. Predefines all encrypted hell in one place. The custom attributes are
    included in the custom collection ingredient serializer. Source works thanks to "prepare_for_serialization" function.
    """

    id = serializers.IntegerField(read_only=True)

    amount = serializers.IntegerField(required=False)
    unit = serializers.CharField()
    date_added = DateTimeSerializer(read_only=True)

    impression = serializers.CharField(
        allow_null=True, allow_blank=True, source="_impression", required=False
    )
    ideas = serializers.CharField(
        allow_null=True, allow_blank=True, source="_ideas", required=False
    )
    associations = serializers.CharField(
        allow_null=True, allow_blank=True, source="_associations", required=False
    )
    colour = serializers.CharField(
        allow_null=True, allow_blank=True, source="_colour", required=False
    )
    common_name = serializers.CharField(source="_common_name")
    cas = serializers.CharField(
        source="_cas", allow_null=True, allow_blank=True, required=False
    )
    volatility = serializers.CharField(
        source="_volatility", allow_null=True, allow_blank=True, required=False
    )
    use = serializers.CharField(
        source="_use", allow_null=True, allow_blank=True, required=False
    )

    class Meta:
        fields = [
            "type",
            "id",
            "uuid",
            "common_name",
            "cas",
            "volatility",
            "use",
            "date_added",
            "colour",
            "impression",
            "associations",
            "ideas",
            "is_collection",
            "amount",
            "unit",
        ]
        abstract = True


class StandardCollectionIngredientSerializer(CollectionIngredientSerializer):
    """
    Serializer for RegularCollectionIngredient model. Overrides the encrypted hell with the common_name, cas, volatility
    and use fields from the Ingredient model. The type field is added to distinguish between the two types of ingredients.
    """

    common_name = serializers.StringRelatedField(source="ingredient.common_name")
    cas = serializers.StringRelatedField(source="ingredient.cas")
    volatility = serializers.StringRelatedField(source="ingredient.volatility")
    use = serializers.StringRelatedField(source="ingredient.use")
    type = serializers.SerializerMethodField()

    def get_type(self, obj):
        """
        Returns the type of the ingredient. Used to distinguish between the two types of ingredients.
        """
        return "CollectionIngredient"

    class Meta(CollectionIngredientSerializer.Meta):
        model = RegularCollectionIngredient


class CustomCollectionIngredientSerializer(CollectionIngredientSerializer):
    """
    Serializer for CustomCollectionIngredient model. The Create magic is necessary, otherwise the serialiser will not
    populate the saved instance with the custom attributes. The type field is added to distinguish between the two types
    of ingredients.
    """

    type = serializers.SerializerMethodField()

    def create(self, validated_data):
        # Extract custom attributes and remove them from validated_data
        custom_name = validated_data.pop("_common_name", None)
        cas = validated_data.pop("_cas", None)
        volatility = validated_data.pop("_volatility", None)
        use = validated_data.pop("_use", None)
        colour = validated_data.pop("_colour", None)
        impression = validated_data.pop("_impression", None)
        associations = validated_data.pop("_associations", None)
        ideas = validated_data.pop("_ideas", None)

        # Create the model instance with remaining validated_data
        instance = CustomCollectionIngredient.objects.create(**validated_data)

        # Manually set custom attributes
        instance._common_name = custom_name
        instance._cas = cas
        instance._volatility = volatility
        instance._use = use
        instance._colour = colour
        instance._impression = impression
        instance._associations = associations
        instance._ideas = ideas

        instance.save()
        return instance

    def get_type(self, obj):
        """
        Returns the type of the ingredient. Used to distinguish between the two types of ingredients.
        """
        return "CustomCollectionIngredient"

    class Meta(CollectionIngredientSerializer.Meta):
        model = CustomCollectionIngredient


# Compare this snippet from browse/models.py:
# Path: collection/serialisers.py
