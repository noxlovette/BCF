from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import serializers
from .models import Formula, FormulaIngredient
from collection.models import CollectionIngredient


def index_view(request):
    """
    renders the minimalistic index page
    :param request:
    :return:
    """
    return render(request, 'formulae/index.html')


class DateTimeSerializer(serializers.DateTimeField):
    """
    custom time representation
    """

    def to_representation(self, value):
        formatted_datetime = value.strftime("%d.%m.%Y, %I:%M%p")
        return formatted_datetime


class FormulaIngredientSerializer(serializers.ModelSerializer):
    """
    This is the serializer for the FormulaIngredient model. It will be used to serialize the FormulaIngredient model into JSON format.
    """
    ingredient = serializers.StringRelatedField(source='collection_ingredient.ingredient.common_name')
    cas = serializers.StringRelatedField(source='collection_ingredient.ingredient.cas')
    volatility = serializers.StringRelatedField(source='collection_ingredient.ingredient.volatility')
    use = serializers.StringRelatedField(source='collection_ingredient.ingredient.use')

    class Meta:
        model = FormulaIngredient
        fields = ['ingredient', 'cas', 'volatility', 'use', 'amount', 'unit']
        read_only_fields = ['ingredient', 'cas', 'volatility', 'use', 'unit']


class FormulaSerializer(serializers.ModelSerializer):
    """
    This is the serializer for the Formula model. It will be used to serialize the Formula model into JSON format.
    """
    ingredients = FormulaIngredientSerializer(source='formulaingredient_set', many=True)
    created_at = DateTimeSerializer()
    updated_at = DateTimeSerializer()

    class Meta:
        model = Formula
        fields = ['id', 'user', 'name', 'description', 'ingredients', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class FormulaCreateAPI(generics.CreateAPIView):
    """
    CREATE A NEW FORMULA
    """
    serializer_class = FormulaSerializer

    def get_queryset(self):
        # access the sessionStorage
        user_id = self.request.session.get('user_id')

        if user_id is not None:
            return Formula.objects.filter(user=user_id)
        else:
            # i.e. you are not logged in
            return Formula.objects.none()


class FormulaListViewAPI(generics.ListAPIView):
    """
    LIST OF FORMULAE. The page is populated by JS
    """
    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer

    def get_queryset(self):
        # Access the user_id from query parameters
        user_id = self.request.query_params.get('user_id')

        if user_id is not None:
            return Formula.objects.filter(user=user_id)
        else:
            # If user_id is not provided, return an empty queryset
            return Formula.objects.none()


class FormulaDetailViewAPI(generics.RetrieveUpdateAPIView):
    """
    Looks for pk in the url and returns the formula. Can also edit it.
    """
    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer

    def update(self, request, *args, **kwargs):
        """
        Update the formula
        """
        # if the value exists. If it does not exist, it will return False
        partial = kwargs.pop('partial', False)
        formula = self.get_object()
        serializer = self.get_serializer(formula, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
