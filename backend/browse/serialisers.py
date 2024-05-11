from rest_framework import serializers
from .models import SuggestedIngredient, Ingredient, Descriptor


class DateTimeSerializer(serializers.DateTimeField):
    """
    custom time representation
    """

    def to_representation(self, value):
        formatted_datetime = value.strftime("%d.%m.%Y, %I:%M%p")
        return formatted_datetime


class IngredientSerialiser(serializers.ModelSerializer):
    """
    Serialiser for the Ingredient model
    """

    descriptors = serializers.SerializerMethodField()
    constituents = serializers.StringRelatedField(many=True)
    contributors = serializers.StringRelatedField(many=True, read_only=True)

    def get_descriptors(self, obj):
        descriptors = list(obj.descriptor1.all()) + list(obj.descriptor2.all()) + list(obj.descriptor3.all())
        descriptor_names = [descriptor.name for descriptor in descriptors]
        return ", ".join(descriptor_names) if descriptor_names else "No descriptors found"

    class Meta:
        fields = ('id', 'descriptors', 'common_name', 'other_names', 'cas', 'ingredient_type', 'use', 'volatility',
                  'is_restricted', 'origin', 'constituents', 'similar_ingredients', 'contributors')
        model = Ingredient


class SuggestedIngredientSerialiser(serializers.ModelSerializer):
    date_suggested = DateTimeSerializer(read_only=True)

    class Meta:
        exclude = ('user', )
        model = SuggestedIngredient


class DescriptorSerialiser(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = Descriptor
