from django import forms
from .models import Formula, FormulaIngredient


class FormulaForm(forms.ModelForm):
    class Meta:
        model = Formula
        fields = ['name', 'description', 'user']


class FormulaIngredientForm(forms.ModelForm):
    class Meta:
        model = FormulaIngredient
        fields = ['collection_ingredient', 'amount', 'unit']
