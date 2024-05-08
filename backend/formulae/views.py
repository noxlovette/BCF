from django.shortcuts import render
from rest_framework.exceptions import ValidationError
from rest_framework import generics
from collection.models import CustomCollectionIngredient
from collection.serialisers import CustomCollectionIngredientSerializer
from .models import Formula, FormulaIngredient, Tag
from .serialisers import FormulaSerializer, FormulaIngredientSerializer
from django.contrib.contenttypes.models import ContentType
from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView
from rest_framework.response import Response
from django.utils import timezone
from django.contrib.auth.models import User


def index_view(request):
    """
    renders the minimalistic index page
    :param request:
    :return:
    """
    return render(request, 'formulae/index.html')


class FormulaCreateAPI(generics.CreateAPIView):
    """
    CREATE A NEW FORMULA
    """
    serializer_class = FormulaSerializer

    def perform_create(self, serializer):
        # Get the user_id from the URL
        user_id = self.kwargs.get('user_id')
        # Get the user object
        user = User.objects.get(id=user_id)
        # Set the user field before saving the object
        serializer.save(user=user, created_at=timezone.now(), updated_at=timezone.now())


class FormulaListViewAPI(ListAPIView):
    """
    LIST OF FORMULAE. The page is populated by JS.
    """
    serializer_class = FormulaSerializer

    def get(self, request, *args, **kwargs):
        # Get the user_id from the URL
        user_id = self.kwargs.get('user_id')

        if user_id is not None:
            # Get the user object
            user = User.objects.get(id=user_id)
            queryset = Formula.objects.filter(user=user)
        else:
            # If user_id is not provided, return an empty queryset
            queryset = Formula.objects.none()

        # Prepare each object for serialization
        queryset = [formula.prepare_for_serialization() for formula in queryset]

        # Serialize the queryset and return the response
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class FormulaDetailViewAPI(RetrieveUpdateAPIView):
    """
    Looks for pk in the url and returns the formula. Can also edit it.
    """
    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer

    def get_object(self):
        """
        Retrieves and prepares the object for serialization.
        """
        obj = super().get_object()  # Retrieve the object as usual
        obj.prepare_for_serialization()  # Prepare data for serialization
        return obj

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()  # After updating the instance, prepare it again for response
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
    queryset = FormulaIngredient.objects.all()
    serializer_class = FormulaIngredientSerializer


class FormulaDeleteAPIView(generics.DestroyAPIView):
    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer


# Path: formulae/urls.py

class FormulaAsCustomIngredientAPI(generics.CreateAPIView):
    serializer_class = CustomCollectionIngredientSerializer

    def perform_create(self, serializer):
        formula_id = self.kwargs.get('formula_id')

        try:
            formula = Formula.objects.get(id=formula_id)
        except Formula.DoesNotExist:
            raise ValidationError("Formula with id {} does not exist".format(formula_id))

        existing_relationship = CustomCollectionIngredient.objects.filter(
            content_type=ContentType.objects.get_for_model(Formula), object_id=formula_id).exists()
        if existing_relationship:
            raise ValidationError("A relationship between this formula and a custom ingredient already exists")

        # Create the CustomCollectionIngredient instance
        custom_ingredient = CustomCollectionIngredient.objects.create(
            common_name=formula.name,
            amount=0,
            unit='g',
            user=formula.user,
            date_added=timezone.now(),
            use=formula.description,
            cas='BASE',
        )

        # Set the content type and object id fields for the generic relationship
        custom_ingredient.content_type = ContentType.objects.get_for_model(Formula)
        custom_ingredient.object_id = formula.id

        # Save the CustomCollectionIngredient instance
        custom_ingredient.save()


class FormulaTagAPI(generics.RetrieveUpdateAPIView):
    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Extract tags data from request
        tags_data = request.data.get('tags', [])

        # Iterate over tags data
        for tag_data in tags_data:
            tag_name = tag_data.get('name')

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
