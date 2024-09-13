from rest_framework import serializers
from .models import SuggestedIngredient, Ingredient, Descriptor


class DateTimeSerializer(serializers.DateTimeField):
    """
    custom time representation, gives flexibility to the date time format
    """

    def to_representation(self, value):
        formatted_datetime = value.strftime("%d.%m.%Y, %I:%M%p")
        return formatted_datetime

class RelatedIngredientSerialiser(serializers.ModelSerializer):
    class Meta:
        fields = ("slug", "common_name")
        model = Ingredient

class IngredientListSerialiser(serializers.ModelSerializer):
    descriptors = serializers.SerializerMethodField()
    related_ingredients = RelatedIngredientSerialiser(many=True)

    def get_descriptors(self, obj):
        descriptors = (
            list(obj.descriptor1.all())
            + list(obj.descriptor2.all())
            + list(obj.descriptor3.all())
        )
        descriptor_names = [descriptor.name for descriptor in descriptors]
        return (
            ", ".join(descriptor_names) if descriptor_names else "No descriptors found"
        )

    class Meta:
        fields = (
            "slug",
            "descriptors",
            "common_name",
            "other_names",
            "cas",
            "related_ingredients",
        )
        model = Ingredient





class IngredientSerialiser(serializers.ModelSerializer):
    """
    Serialiser for the Ingredient model. It doubles the conversion of descriptors defined in the Ingredient model,
    making the list accessible to the API.
    """

    descriptors = serializers.SerializerMethodField()
    related_ingredients = RelatedIngredientSerialiser(many=True)
    contributors = serializers.StringRelatedField(many=True, read_only=True)

    def get_descriptors(self, obj):
        descriptors = (
            list(obj.descriptor1.all())
            + list(obj.descriptor2.all())
            + list(obj.descriptor3.all())
        )
        descriptor_names = [descriptor.name for descriptor in descriptors]
        return (
            ", ".join(descriptor_names) if descriptor_names else "No descriptors found"
        )

    class Meta:
        fields = "__all__"
        read_only_fields = ["slug", "contributors"]
        model = Ingredient


class SuggestedIngredientSerialiser(serializers.ModelSerializer):
    """
    Serialiser for the SuggestedIngredient model. It excludes the user field from the API response.
    """

    date_suggested = DateTimeSerializer(read_only=True)

    class Meta:
        exclude = ("user",)
        model = SuggestedIngredient


class DescriptorSerialiser(serializers.ModelSerializer):
    """
    Serialiser for the Descriptor model. It includes all fields in the model.
    """

    class Meta:
        fields = "__all__"
        model = Descriptor
