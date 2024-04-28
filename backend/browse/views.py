from django.views import generic
from .models import Ingredient
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.paginator import Paginator
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from django.views.decorators.cache import cache_page


class BrowseView(APIView):
    """
    API endpoint that allows ingredients to be viewed.
    """
    def get(self, request):
        # get the search term from the query string
        search_term = request.query_params.get('search', None)
        page_size = request.query_params.get('page_size', 10)

        # Get all ingredients
        ingredients = Ingredient.objects.filter(
            Q(common_name__icontains=search_term) |
            Q(other_names__icontains=search_term) |
            Q(cas__icontains=search_term)
        ).order_by('common_name')

        # Create a paginator
        paginator = CustomPageNumberPagination()  # Use the custom pagination class
        paginator.page_size = page_size  # Set the number of items per page

        # Get the page of ingredients
        page_of_ingredients = paginator.paginate_queryset(ingredients, request)

        # Convert the page of ingredients to JSON
        ingredients_json = [ingredient.to_json for ingredient in page_of_ingredients]

        return paginator.get_paginated_response(ingredients_json)


class CustomPageNumberPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        return Response({
            'page': self.page.number,  # current page number
            'total_pages': self.page.paginator.num_pages,  # total number of pages
            'results': data  # results for the current page
        })

# Path: browse/urls.py