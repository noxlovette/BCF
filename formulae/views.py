from django.forms import inlineformset_factory
from django.shortcuts import get_object_or_404, render
from django.views import generic
from django.views.generic.edit import UpdateView
from .forms import FormulaForm, FormulaIngredientForm
from rest_framework import generics
from rest_framework import serializers
from .models import Formula, FormulaIngredient


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


class FormulaSerializer(serializers.ModelSerializer):
    """
    This is the serializer for the Formula model. It will be used to serialize the Formula model into JSON format.
    """
    ingredients = FormulaIngredientSerializer(source='formulaingredient_set', many=True)
    created_at = DateTimeSerializer()
    updated_at = DateTimeSerializer()

    class Meta:
        model = Formula
        fields = ['user', 'name', 'description', 'ingredients', 'created_at', 'updated_at']


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


class FormulaDetailViewAPI(generics.RetrieveAPIView):
    """
    Looks for pk in the url
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


class FormulaUpdateView(UpdateView):
    """
    EDIT A FORMULA # TODO REDO COMPLETELY TO API
    """
    model = Formula
    form_class = FormulaForm
    template_name = 'formulae/formula_edit.html'
    success_url = '/formulae/formula-list/'

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        FormulaIngredientInlineFormSet = inlineformset_factory(Formula, FormulaIngredient, form=FormulaIngredientForm,
                                                               extra=1)
        if self.request.POST:
            data['formulaingredient'] = FormulaIngredientInlineFormSet(self.request.POST, instance=self.object)
        else:
            data['formulaingredient'] = FormulaIngredientInlineFormSet(instance=self.object)
        return data

    def form_valid(self, form):
        context = self.get_context_data()
        collection_ingredient = context['collection_ingredient']
        self.object = form.save()
        if collection_ingredient.is_valid():
            collection_ingredient.instance = self.object
            collection_ingredient.save()
        return super().form_valid(form)
