from django.views import generic
from .models import Ingredient
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.paginator import Paginator


class IngredientsView(APIView):
    """
    API endpoint that allows ingredients to be viewed.
    """

    def get(self, request):
        page_number = request.GET.get('page', 1)  # Get the page number from the request parameters
        ingredients = Ingredient.objects.all().order_by('common_name')
        paginator = Paginator(ingredients, 20)  # Create a Paginator object with 20 items per page
        page = paginator.get_page(page_number)  # Get the requested page
        ingredients_json = [ingredient.to_json for ingredient in page]  # Convert the ingredients to JSON
        return Response(ingredients_json)


class IndexView(generic.ListView):
    model = Ingredient
    template_name = "ingredients_app/index.html"
    # tells Django what you want to use as the variable for the template
    context_object_name = "ingredients"

    def get_queryset(self):
        # Return ingredients
        return Ingredient.objects.order_by('common_name')


class SingleIngredientView(generic.DetailView):
    model = Ingredient
    # behind the scenes, Detail and FamilyView are the same thing, but the template name changes everything
    template_name = "ingredients_app/detail.html"


class FamilyView(generic.DetailView):
    model = Ingredient
    # the question variable is provided automatically because we use a Django model Ingredient
    template_name = "ingredients_app/family.html"
