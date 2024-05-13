from django.contrib.auth.decorators import login_required
from rest_framework.exceptions import PermissionDenied
from .models import Ingredient, SuggestedIngredient, Descriptor
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from .serialisers import IngredientSerialiser, SuggestedIngredientSerialiser, DescriptorSerialiser
from rest_framework import generics


class BrowseView(APIView):
    """
    the basic view for the browse page, search functionality in-built
    accommodates search term and descriptors
    """

    def get(self, request):
        # get the search term from the query string
        search_term = request.query_params.get('search', None)
        page_size = request.query_params.get('page_size', 10)
        descriptors = request.query_params.getlist('descriptors', None)

        ingredients = Ingredient.objects.filter(
            # Search in the common_name, other_names, and cas fields
            Q(common_name__icontains=search_term) |
            Q(other_names__icontains=search_term) |
            Q(cas__icontains=search_term)
        ).order_by('common_name')

        if descriptors:
            # Apply filter using the list of descriptors
            ingredients = ingredients.filter(
                Q(descriptor1__name__in=descriptors) |
                Q(descriptor2__name__in=descriptors) |
                Q(descriptor3__name__in=descriptors)
            ).distinct()

        # a custom paginator to yield total_pages
        paginator = CustomPageNumberPagination()
        paginator.page_size = page_size  # set the page size
        page_of_ingredients = paginator.paginate_queryset(ingredients, request)

        # Convert the page of ingredients to JSON
        serializer = IngredientSerialiser(page_of_ingredients, many=True)
        ingredients_json = serializer.data

        return paginator.get_paginated_response(ingredients_json)


class CustomPageNumberPagination(PageNumberPagination):
    """
    defines a custom pagination class that returns the current page number and the total number of pages in the response
    """

    def get_paginated_response(self, data):
        return Response({
            'page': self.page.number,  # current page number
            'total_pages': self.page.paginator.num_pages,  # total number of pages
            'results': data  # results for the current page
        })


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
            raise PermissionDenied('You must be logged in to perform this action')
        serializer.save(user=user)


class SuggestedIngredientListView(generics.RetrieveAPIView):
    """
    This view returns a list of all ingredients suggested by the user. Shows on the profile page
    """
    serializer_class = SuggestedIngredientSerialiser

    def get(self, request, *args, **kwargs):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied('You must be logged in to perform this action')

        if user is not None:
            user = user
            queryset = SuggestedIngredient.objects.filter(user=user)
        else:
            queryset = SuggestedIngredient.objects.none()

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

# Path: browse/urls.py
