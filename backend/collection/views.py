from itertools import chain
from django.db import IntegrityError
from django.db.models import Q
from django.http import JsonResponse
from django.views import generic
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .models import CollectionIngredient, Ingredient, User, CustomCollectionIngredient
from rest_framework.views import APIView
from rest_framework.exceptions import ParseError
import logging
from .serialisers import CollectionIngredientSerializer, \
    CustomCollectionIngredientSerializer

logger = logging.getLogger(__name__)


# CREATE VIEWS
class IngredientCreateView(generics.CreateAPIView):
    """
    CREATE A NEW CUSTOM INGREDIENT
    """

    serializer_class = CustomCollectionIngredientSerializer

    def perform_create(self, serializer):
        # Get the user_id from the URL
        user_id = self.kwargs.get('user_id')
        # Get the user object
        user = User.objects.get(id=user_id)
        # Set the user field before saving the object
        serializer.save(user=user)


# UPDATE VIEWS
class CustomIngredientUpdateView(generics.UpdateAPIView):
    queryset = CustomCollectionIngredient.objects.all()
    serializer_class = CustomCollectionIngredientSerializer
    lookup_url_kwarg = 'customCollectionIngredientId'

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return self.queryset.filter(user=user_id)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


class IngredientUpdateView(generics.UpdateAPIView):
    queryset = CollectionIngredient.objects.all()
    serializer_class = CollectionIngredientSerializer
    lookup_url_kwarg = 'collectionIngredientId'

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return self.queryset.filter(user=user_id)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


# DELETE VIEWS

class IngredientDeleteView(generics.DestroyAPIView):
    """
    DELETE A COLLECTION INGREDIENT
    """
    queryset = CollectionIngredient.objects.all()
    serializer_class = CollectionIngredientSerializer
    lookup_url_kwarg = 'collectionIngredientId'

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return self.queryset.filter(user=user_id)


class CustomIngredientDeleteView(generics.DestroyAPIView):
    """
    DELETE A CUSTOM INGREDIENT
    """
    queryset = CustomCollectionIngredient.objects.all()
    serializer_class = CustomCollectionIngredientSerializer
    lookup_url_kwarg = 'customCollectionIngredientId'

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return self.queryset.filter(user=user_id)


# LIST VIEWS
class CollectionView(generic.ListView):
    """
    VIEW TO DISPLAY THE USER'S COLLECTION
    """
    template_name = "collection/collection.html"
    context_object_name = "collection"

    def get_queryset(self):
        collection = self.request.session.get('collection', [])
        collection_ingredient_ids = [id for item in collection if len(item) == 2 and item[0] == 'CollectionIngredient'
                                     for type, id in [item]]
        custom_collection_ids = [id for item in collection if len(item) == 2 and item[0] == 'CustomCollectionIngredient'
                                 for type, id in [item]]

        collection_ingredient = list(CollectionIngredient.objects.filter(id__in=collection_ingredient_ids))
        custom_collection = list(CustomCollectionIngredient.objects.filter(id__in=custom_collection_ids))
        for obj in collection_ingredient:
            obj.type = 'CollectionIngredient'
        for obj in custom_collection:
            obj.type = 'CustomCollectionIngredient'

        combined_collection = collection_ingredient + custom_collection

        return combined_collection


class CollectionAPI(APIView):
    """
    API VIEW TO DISPLAY THE USER'S COLLECTION
    """

    def get_collection(self, request, user_id):
        user = User.objects.get(id=user_id)
        if not user:
            return JsonResponse({'error': 'user not logged in'}, status=400)

        search_param = request.query_params.get('search', None)
        collection_ingredients = CollectionIngredient.objects.filter(user=user).order_by('ingredient__common_name')
        custom_collection_ingredients = CustomCollectionIngredient.objects.filter(user=user)

        if search_param:
            collection_ingredients = collection_ingredients.filter(
                Q(ingredient__common_name__icontains=search_param) |
                Q(ingredient__other_names__icontains=search_param) |
                Q(ingredient__cas__icontains=search_param)
            ).order_by('ingredient__common_name')

        # Prepare data for serialization
        for ingredient in collection_ingredients:
            ingredient.prepare_for_serialization()
        for custom_ingredient in custom_collection_ingredients:
            custom_ingredient.prepare_for_serialization()

        if search_param:
            # Filter custom_collection_ingredients in Python based on transient attributes
            custom_collection_ingredients = [
                ci for ci in custom_collection_ingredients
                if search_param.lower() in ci._common_name.lower()
                   or search_param.lower() in ci._cas.lower()
            ]

        return collection_ingredients, custom_collection_ingredients

    def get(self, request, user_id):
        logger.info('GET request received')
        collection_ingredients, custom_collection_ingredients = self.get_collection(request, user_id)

        for ingredient in collection_ingredients:
            ingredient.prepare_for_serialization()
        for custom_ingredient in custom_collection_ingredients:
            custom_ingredient.prepare_for_serialization()

        paginator = PageNumberPagination()
        paginator.page_size = request.query_params.get('page_size', paginator.page_size)

        collection_serializer = CollectionIngredientSerializer(collection_ingredients, many=True)
        custom_collection_serializer = CustomCollectionIngredientSerializer(custom_collection_ingredients, many=True)
        combined_data = list(chain(collection_serializer.data, custom_collection_serializer.data))
        sorted_data = sorted(combined_data, key=lambda x: x['common_name'])

        result_page = paginator.paginate_queryset(sorted_data, request)
        return paginator.get_paginated_response(result_page)

    # this is the browse functionality
    def post(self, request, user_id):
        """
        adds a new ingredient to the user's collection (FROM THE BROWSE APP)
        :param request:
        :param user_id:
        :return:
        """
        try:
            data = request.data
            ingredient_id = data.get('ingredient_id')

            # Get the user and ingredient from the database using the provided IDs
            user = User.objects.get(id=user_id)
            ingredient = Ingredient.objects.get(id=ingredient_id)

            # Create a new CollectionIngredient object
            CollectionIngredient.objects.create(user=user, ingredient=ingredient)

            return JsonResponse({'success': True})
        except IntegrityError:
            return JsonResponse({'error': 'ingredient is already in collection'}, status=400)
        except (User.DoesNotExist, Ingredient.DoesNotExist):
            return JsonResponse({'error': 'user or ingredient does not exist'}, status=400)
        except ParseError:
            return JsonResponse({'error': 'invalid JSON data'}, status=400)
