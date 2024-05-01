from rest_framework import serializers
from .models import SuggestedIngredient, Ingredient


class DateTimeSerializer(serializers.DateTimeField):
    """
    custom time representation
    """

    def to_representation(self, value):
        formatted_datetime = value.strftime("%d.%m.%Y, %I:%M%p")
        return formatted_datetime


class IngredientSerialiser(serializers.ModelSerializer):
    """
     'id': self.id,
        'common_name': self.common_name,
        'other_names': self.other_names,
        'cas': self.cas,
        'descriptors': self.get_descriptors(),
        'type': self.ingredient_type,
        'use': self.use,
        'volatility': self.volatility,
        'is_restricted': "Yes" if self.is_restricted else "No"
    """

    descriptors = serializers.SerializerMethodField()
    constituents = serializers.StringRelatedField(many=True)
    contributors = serializers.StringRelatedField(many=True, read_only=True)

    def get_descriptors(self, obj):
        descriptors = list(obj.descriptor1.all()) + list(obj.descriptor2.all()) + list(obj.descriptor3.all())
        return [descriptor.name for descriptor in descriptors]

    class Meta:
        fields = ('id', 'descriptors', 'common_name', 'other_names', 'cas',  'ingredient_type', 'use', 'volatility',
                  'is_restricted', 'origin', 'constituents', 'similar_ingredients', 'contributors')
        model = Ingredient


class SuggestedIngredientSerialiser(serializers.ModelSerializer):
    date_suggested = DateTimeSerializer(read_only=True)

    class Meta:
        fields = '__all__'
        model = SuggestedIngredient
