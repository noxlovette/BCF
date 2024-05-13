from itertools import chain
from django.db import IntegrityError
from django.http import JsonResponse
from rest_framework import generics
from rest_framework.response import Response
from .models import RegularCollectionIngredient, Ingredient, User, CustomCollectionIngredient
from rest_framework.views import APIView
from rest_framework.exceptions import ParseError, PermissionDenied
import logging
from .serialisers import StandardCollectionIngredientSerializer, \
    CustomCollectionIngredientSerializer

logger = logging.getLogger(__name__)


# CREATE VIEWS
class IngredientCreateView(generics.CreateAPIView):
    """
    CREATE A NEW CUSTOM INGREDIENT
    """
    serializer_class = CustomCollectionIngredientSerializer

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied('You must be logged in to perform this action')
        serializer.save(user=user)


# UPDATE VIEWS. #TODO identical. Can be combined
class CustomIngredientUpdateView(generics.UpdateAPIView):
    queryset = CustomCollectionIngredient.objects.all()
    serializer_class = CustomCollectionIngredientSerializer
    lookup_url_kwarg = 'customCollectionIngredientId'

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied('You must be logged in to perform this action')
        return self.queryset.filter(user=user)

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
    queryset = RegularCollectionIngredient.objects.all()
    serializer_class = StandardCollectionIngredientSerializer
    lookup_url_kwarg = 'collectionIngredientId'

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied('You must be logged in to perform this action')
        return self.queryset.filter(user=user)

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
    queryset = RegularCollectionIngredient.objects.all()
    serializer_class = StandardCollectionIngredientSerializer
    lookup_url_kwarg = 'collectionIngredientId'

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied('You must be logged in to perform this action')
        return self.queryset.filter(user=user)


class CustomIngredientDeleteView(generics.DestroyAPIView):
    """
    DELETE A CUSTOM INGREDIENT
    """
    queryset = CustomCollectionIngredient.objects.all()
    serializer_class = CustomCollectionIngredientSerializer
    lookup_url_kwarg = 'customCollectionIngredientId'

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied('You must be logged in to perform this action')
        return self.queryset.filter(user=user)


# LIST VIEWS
class CollectionAPI(APIView):
    """
    API VIEW TO DISPLAY THE USER'S COLLECTION
    """

    def get_collection(self, request):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied('You must be logged in to perform this action')

        collection_ingredients = RegularCollectionIngredient.objects.filter(user=user).order_by('ingredient__common_name')
        custom_collection_ingredients = CustomCollectionIngredient.objects.filter(user=user)

        # Prepare data for serialization
        for ingredient in collection_ingredients:
            ingredient.prepare_for_serialization()
        for custom_ingredient in custom_collection_ingredients:
            custom_ingredient.prepare_for_serialization()

        return collection_ingredients, custom_collection_ingredients

    def get(self, request):
        logger.info('GET request received')
        collection_ingredients, custom_collection_ingredients = self.get_collection(request)

        for ingredient in collection_ingredients:
            ingredient.prepare_for_serialization()
        for custom_ingredient in custom_collection_ingredients:
            custom_ingredient.prepare_for_serialization()

        collection_serializer = StandardCollectionIngredientSerializer(collection_ingredients, many=True)
        custom_collection_serializer = CustomCollectionIngredientSerializer(custom_collection_ingredients, many=True)
        combined_data = list(chain(collection_serializer.data, custom_collection_serializer.data))

        return JsonResponse(combined_data, safe=False)

    # this is the browse functionality
    def post(self, request):
        """
        adds a new ingredient to the user's collection (FROM THE BROWSE APP)
        :param request:
        :return:
        """
        try:
            data = request.data
            ingredient_id = data.get('ingredient_id')
            user = self.request.user
            ingredient = Ingredient.objects.get(id=ingredient_id)
            RegularCollectionIngredient.objects.create(user=user, ingredient=ingredient)

            return JsonResponse({'success': True})
        except IntegrityError:
            return JsonResponse({'error': 'ingredient is already in collection'}, status=400)
        except (User.DoesNotExist, Ingredient.DoesNotExist):
            return JsonResponse({'error': 'user or ingredient does not exist'}, status=400)
        except ParseError:
            return JsonResponse({'error': 'invalid JSON data'}, status=400)
