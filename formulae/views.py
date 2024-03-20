from django.contrib.auth.models import User
from django.core.paginator import Paginator
from django.shortcuts import render
from django.views import generic
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Formula, IngFormula

from collection.models import UserCollectionIng


# Create your views here.

class FormulaView(generic.ListView):
    model = Formula
    template_name = "collection/collection.html"
    context_object_name = "collection"

    def get_queryset(self):
        return UserCollectionIng.objects.order_by('ingredient__common_name').values_list('ingredient__common_name', flat=True)


class FormulaAPI(APIView):
    """
    API endpoint that allows collection to be viewed.
    """

    def get(self, request):
        # TEMPORARY HARD-CODED USER ID TODO REMOVE HARDCORED USER ID
        user_id = 2
        user = User.objects.get(id=user_id)
        page_number = request.GET.get('page', 1)  # Get the page number from the request parameters
        ingredients = UserCollectionIng.objects.filter(user=user).order_by('ingredient__common_name')
        paginator = Paginator(ingredients, 20)  # Create a Paginator object with 20 items per page
        page = paginator.get_page(page_number)  # Get the requested page
        collection_json = [collection_ing.to_json for collection_ing in page]  # Convert the collection to JSON
        return Response(collection_json)