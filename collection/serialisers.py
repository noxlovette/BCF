from rest_framework import serializers
from .models import CollectionIngredient, CustomCollectionIngredient


class DateTimeSerializer(serializers.DateTimeField):
    """
    custom time representation
    """

    def to_representation(self, value):
        formatted_datetime = value.strftime("%d.%m.%Y, %I:%M%p")
        return formatted_datetime


class CollectionIngredientSerializer(serializers.ModelSerializer):
    common_name = serializers.StringRelatedField(source='ingredient.common_name')
    cas = serializers.StringRelatedField(source='ingredient.cas')
    volatility = serializers.StringRelatedField(source='ingredient.volatility')
    use = serializers.StringRelatedField(source='ingredient.use')
    date_added = DateTimeSerializer()

    class Meta:
        model = CollectionIngredient
        fields = '__all__'


class CustomCollectionIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomCollectionIngredient
        fields = '__all__'


class CombinedCollectionIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionIngredient
        fields = '__all__'
        depth = 1
