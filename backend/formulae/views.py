from django.shortcuts import render
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework import generics
from collection.models import CustomCollectionIngredient
from collection.serialisers import CustomCollectionIngredientSerializer
from .models import Formula, FormulaIngredient, Tag, NewFormulaIngredient, NewFormula
from .serialisers import FormulaSerializer, FormulaIngredientSerializer, NewFormulaSerializer, NewFormulaIngredientSerializer
from django.contrib.contenttypes.models import ContentType
from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


class FormulaCreateAPI(generics.CreateAPIView):
    """
    CREATE A NEW FORMULA. for more info see the serialiser.
    """

    serializer_class = FormulaSerializer

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user, created_at=timezone.now(), updated_at=timezone.now())


class FormulaListViewAPI(ListAPIView):
    """
    LIST OF FORMULAE. for more info see the serialiser.
    """

    serializer_class = FormulaSerializer

    def get(self, request, *args, **kwargs):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to perform this action")

        queryset = Formula.objects.filter(user=user)
        queryset = [formula.prepare_for_serialization() for formula in queryset]
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class FormulaDetailViewAPI(RetrieveUpdateAPIView):
    """
    RETRIEVE AND UPDATE A FORMULA. for more info see the serialiser.
    """

    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer
    lookup_field = 'uuid'  # Use 'uuid' for lookups

    def get_object(self):
        """
        Retrieves and prepares the object for serialization.
        """
        obj = super().get_object()  # Retrieve the object as usual
        if obj.user != self.request.user:
            raise PermissionDenied("You do not have permission to access this formula.")
        
        obj.prepare_for_serialization()  # Prepare data for serialization
        return obj

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = (
            serializer.save()
        )  # After updating the instance, prepare it again for response
        instance.prepare_for_serialization()
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        instance.prepare_for_serialization()
        return Response(serializer.data)


class FormulaIngredientDeleteAPIView(generics.DestroyAPIView):
    """
    DELETE A FORMULA INGREDIENT. Straightforward.
    """

    queryset = FormulaIngredient.objects.all()
    serializer_class = FormulaIngredientSerializer


class FormulaDeleteAPIView(generics.DestroyAPIView):
    """
    DELETE A FORMULA. Straightforward.
    """

    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer


class FormulaAsCustomIngredientAPI(generics.CreateAPIView):
    """
    CREATE A NEW CUSTOM INGREDIENT FROM A FORMULA. for more info see the serialiser.
    """

    serializer_class = CustomCollectionIngredientSerializer

    def perform_create(self, serializer):
        formula_id = self.request.data.get("formula_id")
        common_name = self.request.data.get("common_name")
        description = self.request.data.get("description")
        user = self.request.user

        try:
            _ = Formula.objects.get(id=formula_id)
        except Formula.DoesNotExist:
            raise ValidationError(
                "Formula with id {} does not exist".format(formula_id)
            )

        existing_relationship = CustomCollectionIngredient.objects.filter(
            content_type=ContentType.objects.get_for_model(Formula),
            object_id=formula_id,
        ).exists()
        if existing_relationship:
            raise ValidationError(
                "A relationship between this formula and a custom ingredient already exists"
            )

        # Create the CustomCollectionIngredient instance
        serializer.save(
            _common_name=common_name,
            amount=0,
            unit="g",
            user=user,
            date_added=timezone.now(),
            _use=description,
            _cas="BASE",
            content_type=ContentType.objects.get_for_model(Formula),
            object_id=formula_id,
        )


class FormulaTagAPI(generics.RetrieveUpdateAPIView):
    """
    #TODO not implemented yet
    """

    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Extract tags data from request
        tags_data = request.data.get("tags", [])

        # Iterate over tags data
        for tag_data in tags_data:
            tag_name = tag_data.get("name")

            # Check if a tag with the same name exists for the user
            existing_tag = Tag.objects.filter(name=tag_name, user=request.user).first()

            if existing_tag:
                # Associate the formula with the existing tag
                instance.tags.add(existing_tag)
            else:
                # Create a new tag and associate it with the formula
                new_tag = Tag.objects.create(name=tag_name, user=request.user)
                instance.tags.add(new_tag)

        # Save the updated instance
        self.perform_update(serializer)

        return Response(serializer.data)
    


class NewFormulaCreate(generics.CreateAPIView):
    serializer_class = NewFormulaSerializer
    permission_classes = [IsAuthenticated]
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
    def create(self, request, *args, **kwargs):
        # Use the default create behavior from DRF
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        formula = serializer.save()

        return Response({"id": formula.id, "url": f"/formulate/{formula.id}"}, status=status.HTTP_201_CREATED)


class NewFormulaList(ListAPIView):
    """
    LIST OF FORMULAE. for more info see the serialiser.
    """
    serializer_class = NewFormulaSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        queryset = NewFormula.objects.filter(user=user)
        for formula in queryset:
            formula.prepare_for_serialization()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
class NewFormulaDetail(RetrieveUpdateAPIView):

    queryset = NewFormula.objects.all()
    serializer_class = NewFormulaSerializer

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You do not have permission to access this formula.")
        obj.prepare_for_serialization()
        return obj
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        instance.prepare_for_serialization()
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        instance.prepare_for_serialization()
        return Response(serializer.data)
    

class NewFormulaDelete(generics.DestroyAPIView):
    """
    DELETE A FORMULA. Straightforward.
    """

    queryset = NewFormula.objects.all()
    serializer_class = NewFormulaSerializer

# Path: formulae/urls.py
