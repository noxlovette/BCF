from rest_framework.exceptions import PermissionDenied
from .models import Ingredient, SuggestedIngredient, Descriptor
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q, F
from rest_framework.pagination import PageNumberPagination
from django.contrib.postgres.search import TrigramSimilarity
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
    def get(self, request):
        search_term = request.query_params.get("search", None)
        page_size = int(request.query_params.get("page_size", 10))

        # Initialize result sets
        names_results = []
        cas_results = []
        descriptors_results = []

        if search_term:
            search_term = search_term.lower()

            # Search in names
            name_matches = Ingredient.objects.annotate(
    common_name_similarity=TrigramSimilarity('common_name', search_term),
    other_names_similarity=TrigramSimilarity('other_names', search_term)
).annotate(
    total_similarity=F('common_name_similarity') + F('other_names_similarity')
).filter(
    total_similarity__gt=0.3
).order_by('-total_similarity')

            # Search in CAS numbers
            cas_matches = Ingredient.objects.filter(
                Q(cas__icontains=search_term)
            )

            # Search in descriptors
            descriptor_matches = Ingredient.objects.filter(
                Q(descriptor1__name__icontains=search_term) |
                Q(descriptor2__name__icontains=search_term) |
                Q(descriptor3__name__icontains=search_term)
            )


            # Separate the results into categories
            names_results = [i for i in name_matches]
            cas_results = [i for i in cas_matches]
            descriptors_results = [i for i in descriptor_matches]
        else:
            # No search term provided, just return all ingredients
            ingredients = Ingredient.objects.all().order_by("common_name")

            # Paginate the entire ingredient list
            paginator = CustomPageNumberPagination()
            paginator.page_size = page_size
            paginated_ingredients = paginator.paginate_queryset(ingredients, request)

            # Serialize the paginated results
            serializer = IngredientSerialiser(paginated_ingredients, many=True)

            ingredients_json = serializer.data

            return paginator.get_paginated_response({
                "names": ingredients_json,
                "cas": [],
                "descriptors": [],
                "search": None,
            })

        # Paginate the results
        paginator = CustomPageNumberPagination()
        paginator.page_size = page_size

        paginated_names = paginator.paginate_queryset(names_results, request)
        paginated_cas = paginator.paginate_queryset(cas_results, request)
        paginated_descriptors = paginator.paginate_queryset(descriptors_results, request)

        # Serialize the paginated results
        names_serializer = IngredientSerialiser(paginated_names, many=True)
        cas_serializer = IngredientSerialiser(paginated_cas, many=True)
        descriptors_serializer = IngredientSerialiser(paginated_descriptors, many=True)

        return paginator.get_paginated_response({
            "names": names_serializer.data,
            "cas": cas_serializer.data,
            "descriptors": descriptors_serializer.data,
        })

    
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
                "page": self.page.number,
                "total_pages": self.page.paginator.num_pages,
                "count": self.page.paginator.count,
                "cas": data.get("cas", []),
                "descriptors": data.get("descriptors", []),
                "names": data.get("names", []),
                "search": self.request.query_params.get("search", None),
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
