from django.contrib.auth.models import User
from django.core.paginator import Paginator
from django.forms import inlineformset_factory
from django.views import generic
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Formula, FormulaIngredient
from collection.models import CollectionIngredient
from django.urls import reverse
from django.views.generic.edit import UpdateView
from .forms import FormulaForm, FormulaIngredientForm
from .models import Formula


class FormulaCreateView(generic.CreateView):
    model = Formula
    form_class = FormulaForm
    template_name = 'formulae/formula_edit.html'
    success_url = '/formulae/formula-list/'


class FormulaUpdateView(UpdateView):
    """
    EDIT A FORMULA
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


class FormulaListView(generic.ListView):
    """
    LIST OF FORMULAE
    """
    model = Formula
    template_name = 'formulae/formulae_list.html'
    context_object_name = 'formulae_list'

    def get_queryset(self):
        return Formula.objects.order_by('name')


class FormulaDetailView(generic.DetailView):
    """
    SINGLE FORMULA NOT LIST OF FORMULAE
    """
    model = Formula
    template_name = "formulae/formula_detail.html"
    # template context
    context_object_name = "formula"

    def get_queryset(self):
        return Formula.objects.order_by('name')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['formulaingredient_list'] = self.object.formulaingredient_set.all()
        return context


class FormulaAPI(APIView):
    """
    API endpoint that allows formula to be viewed.
    """

    def get(self, request):
        # TEMPORARY HARD-CODED USER ID TODO REMOVE HARDCORED USER ID
        user_id = 2
        user = User.objects.get(id=user_id)
        page_number = request.GET.get('page', 1)  # Get the page number from the request parameters
        ingredients = Formula.objects.filter(user=user).order_by('formulaingredient__collection_ingredient__ingredient')
        paginator = Paginator(ingredients, 20)  # Create a Paginator object with 20 items per page
        page = paginator.get_page(page_number)  # Get the requested page
        formula_json = [formula_part.to_json for formula_part in page]  # Convert the formula to JSON
        return Response(formula_json)
