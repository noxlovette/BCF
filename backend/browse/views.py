from rest_framework.exceptions import PermissionDenied
from .models import Ingredient, SuggestedIngredient, Descriptor
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from itertools import chain
from .serialisers import (
    IngredientSerialiser,
    SuggestedIngredientSerialiser,
    DescriptorSerialiser,
    IngredientListSerialiser,
)
from rest_framework import generics


class TotalBrowseView(generics.ListAPIView):
    """
    The view for the total browse page, showing all ingredients in the database
    """

    queryset = Ingredient.objects.all().order_by("common_name")
    serializer_class = IngredientListSerialiser

class BrowseView(APIView):
    """
    View to handle ingredient browsing with prioritized searching.
    Results are ordered by names, CAS, then descriptors.
    """

    def get(self, request):
        # Get the search term from the query string
        search_term = request.query_params.get("search", None)
        page_size = request.query_params.get("page_size", 10)

        # If no search term is provided, just return all ingredients, sorted by name
        if not search_term:
            ingredients = Ingredient.objects.all().order_by("common_name")
        else:
            # Prioritize the results based on the fields
            search_term = search_term.lower()

            # Search in common names and other names first
            name_matches = Ingredient.objects.filter(
                Q(common_name__icontains=search_term) | 
                Q(other_names__icontains=search_term)
            )

            # Search in CAS numbers second
            cas_matches = Ingredient.objects.filter(
                Q(cas__icontains=search_term)
            )

            # Search in descriptors last
            descriptor_matches = Ingredient.objects.filter(
                Q(descriptor1__name__icontains=search_term) |
                Q(descriptor2__name__icontains=search_term) |
                Q(descriptor3__name__icontains=search_term)
            )

            # Concatenate the querysets while preserving order
            ingredients = list(chain(name_matches, descriptor_matches, cas_matches))

        # Paginate the results
        paginator = CustomPageNumberPagination()
        paginator.page_size = page_size  # Set the page size
        page_of_ingredients = paginator.paginate_queryset(ingredients, request)

        # Convert the page of ingredients to JSON
        serializer = IngredientSerialiser(page_of_ingredients, many=True)
        ingredients_json = serializer.data

        return paginator.get_paginated_response(ingredients_json)

    
class IngredientDetailView(APIView):
    """
    This view returns detailed information about a single ingredient
    """

    def get(self, request, slug):
        try:
            ingredient = Ingredient.objects.get(slug=slug)
        except Ingredient.DoesNotExist:
            return Response({"error": "Ingredient not found"}, status=404)
        
        serializer = IngredientSerialiser(ingredient)
        return Response(serializer.data)
            
            
            
class CustomPageNumberPagination(PageNumberPagination):
    """
    defines a custom pagination class that returns the current page number and the total number of pages in the response
    """

    def get_paginated_response(self, data):
        return Response(
            {
                "page": self.page.number,  # current page number
                "total_pages": self.page.paginator.num_pages,  # total number of pages
                "count": self.page.paginator.count,  # total number of items
                "results": data,  # results for the current page
                "search": self.request.query_params.get("search", None),  # search term
            }
        )


class DescriptorsListAPIView(generics.ListAPIView):
    """
    This view returns a list of all descriptors in the database. shows instead of the table on the browse page
    """

    queryset = Descriptor.objects.all()
    serializer_class = DescriptorSerialiser


class SuggestedIngredientCreateView(generics.CreateAPIView):
    """
    This view allows users to suggest ingredients to be added to the database
    """

    queryset = SuggestedIngredient.objects.all()
    serializer_class = SuggestedIngredientSerialiser

    def perform_create(self, serializer):
        """
        an additional level of validation to ensure that the user is authenticated before creating a suggestion
        """
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")
        serializer.save(user=user)


class SuggestedIngredientListView(generics.RetrieveAPIView):
    """
    This view returns a list of all ingredients suggested by the user. Shows on the profile page
    """

    serializer_class = SuggestedIngredientSerialiser

    def get(self, request, *args, **kwargs):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")

        if user is not None:
            user = user
            queryset = SuggestedIngredient.objects.filter(user=user)
        else:
            queryset = SuggestedIngredient.objects.none()

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


# Path: browse/urls.py
