from itertools import chain
from django.db import IntegrityError
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.response import Response

from django.http import HttpResponseRedirect
from .models import (
    RegularCollectionIngredient,
    Ingredient,
    User,
    CustomCollectionIngredient,
    NewCollectionIngredient,
)
from rest_framework.views import APIView
from rest_framework.exceptions import ParseError, PermissionDenied
from rest_framework.permissions import IsAuthenticated
import logging
from .serialisers import (
    StandardCollectionIngredientSerializer,
    CustomCollectionIngredientSerializer,
    NewCollectionSerializer,
)

logger = logging.getLogger(__name__)

# NEW

class NewIngredientCreateView(generics.CreateAPIView):
    """
    CREATE A NEW INGREDIENT
    """

    serializer_class = NewCollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
    def create(self, request, *args, **kwargs):
        # Use the default create behavior from DRF
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ingredient = serializer.save()

        # After successful creation, redirect to the new ingredient's detail page
        return Response({"id": ingredient.id, "url": f"/collect/{ingredient.id}"}, status=status.HTTP_201_CREATED)

class NewIngredientUpdateView(generics.UpdateAPIView):
    queryset = NewCollectionIngredient.objects.all()
    serializer_class = NewCollectionSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")
        return self.queryset.filter(user=user)
    
    def get_serializer_context(self):
        # Add the request to the serializer context
        return {'request': self.request}
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
    

class NewIngredientDetailView(generics.RetrieveAPIView):
    queryset = NewCollectionIngredient.objects.all()
    serializer_class = NewCollectionSerializer

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You do not have permission to access this ingredient.")
                                
        obj.prepare_for_serialization()
        return obj

class NewIngredientDeleteView(generics.DestroyAPIView):
    queryset = NewCollectionIngredient.objects.all()
    serializer_class = NewCollectionSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")
        return self.queryset.filter(user=user)

class NewCollectionAPI(generics.ListAPIView):
    serializer_class = NewCollectionSerializer

    def get(self, request, *args, **kwargs):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")
        
        # Filter the queryset based on the authenticated user
        queryset = NewCollectionIngredient.objects.filter(user=user)

        for ingredient in queryset:
            ingredient.prepare_for_serialization()

        # Pass the queryset to the serializer
        serializer = self.serializer_class(queryset, many=True)
        
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")
        
        try:
            data = request.data
            ingredient_id = data.get("ingredient_id")
            ingredient = Ingredient.objects.get(id=ingredient_id)

            NewCollectionIngredient.objects.create(
                user=user,
                common_name=ingredient.common_name,
                cas = ingredient.cas,
                volatility = ingredient.volatility,
                use = ingredient.use,

                descriptors = ingredient.get_descriptors(),

                other_names = ingredient.other_names,
                origin = ingredient.origin,
                
                )
            
            return JsonResponse({"success": True})
        except IntegrityError:
            return JsonResponse(
                {"error": "ingredient is already in collection"}, status=400
            )
        except (User.DoesNotExist, Ingredient.DoesNotExist):
            return JsonResponse(
                {"error": "user or ingredient does not exist"}, status=400
            )
        except ValueError:
            return JsonResponse({"error": "invalid ingredient_id"}, status=400)

# OLD
# CREATE VIEWS
class IngredientCreateView(generics.CreateAPIView):
    """
    CREATE A NEW CUSTOM INGREDIENT
    """

    serializer_class = CustomCollectionIngredientSerializer

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")
        serializer.save(user=user)

# UPDATE VIEWS. #TODO identical. Can be combined
class CustomIngredientUpdateView(generics.UpdateAPIView):
    queryset = CustomCollectionIngredient.objects.all()
    serializer_class = CustomCollectionIngredientSerializer
    lookup_url_kwarg = "customCollectionIngredientId"

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")
        return self.queryset.filter(user=user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


class IngredientUpdateView(generics.UpdateAPIView):
    queryset = RegularCollectionIngredient.objects.all()
    serializer_class = StandardCollectionIngredientSerializer
    lookup_url_kwarg = "collectionIngredientId"

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")
        return self.queryset.filter(user=user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
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
    lookup_url_kwarg = "collectionIngredientId"

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")
        return self.queryset.filter(user=user)


class CustomIngredientDeleteView(generics.DestroyAPIView):
    """
    DELETE A CUSTOM INGREDIENT
    """

    queryset = CustomCollectionIngredient.objects.all()
    serializer_class = CustomCollectionIngredientSerializer
    lookup_url_kwarg = "customCollectionIngredientId"

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")
        return self.queryset.filter(user=user)


class IngredientDetailView(generics.RetrieveAPIView):
    """
    RETRIEVE A COLLECTION OR CUSTOM INGREDIENT
    """
    serializer_class = None  # Will be set dynamically based on the object type
    lookup_field = 'uuid'  # Use 'uuid' for lookups


    def get_serializer_class(self):
        # Set the serializer class dynamically based on the object type
        # Check which model is being queried to set the correct serializer
        uuid = self.kwargs.get('uuid')
        if RegularCollectionIngredient.objects.filter(uuid=uuid).exists():
            return StandardCollectionIngredientSerializer
        if CustomCollectionIngredient.objects.filter(uuid=uuid).exists():
            return CustomCollectionIngredientSerializer
        raise generics.Http404("Ingredient not found.")

    def get_object(self):
        # Find the object in the RegularCollectionIngredient first
        try:
            obj = RegularCollectionIngredient.objects.get(uuid=self.kwargs.get('uuid'))
        except RegularCollectionIngredient.DoesNotExist:
            # If not found, look for it in CustomCollectionIngredient
            try:
                obj = CustomCollectionIngredient.objects.get(uuid=self.kwargs.get('uuid'))
            except CustomCollectionIngredient.DoesNotExist:
                raise generics.Http404("Ingredient not found.")

        # Check permissions
        # if obj.user != self.request.user:
        #     raise PermissionDenied("You do not have permission to access this ingredient.")
        
        # Prepare for serialization
        obj.prepare_for_serialization()
        return obj



# LIST VIEWS

class CollectionAPI(APIView):
    """
    API VIEW TO DISPLAY THE USER'S COLLECTION
    """

    def get_collection(self, request):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")

        collection_ingredients = RegularCollectionIngredient.objects.filter(
            user=user
        ).order_by("ingredient__common_name")
        custom_collection_ingredients = CustomCollectionIngredient.objects.filter(
            user=user
        )

        # Prepare data for serialization
        for ingredient in collection_ingredients:
            ingredient.prepare_for_serialization()
        for custom_ingredient in custom_collection_ingredients:
            custom_ingredient.prepare_for_serialization()

        return collection_ingredients, custom_collection_ingredients


    def get(self, request):
        collection_ingredients, custom_collection_ingredients = self.get_collection(
            request
        )

        for ingredient in collection_ingredients:
            ingredient.prepare_for_serialization()
        for custom_ingredient in custom_collection_ingredients:
            custom_ingredient.prepare_for_serialization()

        collection_serializer = StandardCollectionIngredientSerializer(
            collection_ingredients, many=True
        )
        custom_collection_serializer = CustomCollectionIngredientSerializer(
            custom_collection_ingredients, many=True
        )
        combined_data = list(
            chain(collection_serializer.data, custom_collection_serializer.data)
        )

        return JsonResponse(combined_data, safe=False)


    def post(self, request):
        """
        adds a new ingredient to the user's collection (FROM THE BROWSE APP)
        :param request:
        :return:
        """
        try:
            data = request.data
            ingredient_id = data.get("ingredient_id")
            user = self.request.user
            ingredient = Ingredient.objects.get(id=ingredient_id)
            RegularCollectionIngredient.objects.create(user=user, ingredient=ingredient)

            return JsonResponse({"success": True})
        except IntegrityError:
            return JsonResponse(
                {"error": "ingredient is already in collection"}, status=400
            )
        except (User.DoesNotExist, Ingredient.DoesNotExist):
            return JsonResponse(
                {"error": "user or ingredient does not exist"}, status=400
            )
        except ParseError:
            return JsonResponse({"error": "invalid JSON data"}, status=400)
