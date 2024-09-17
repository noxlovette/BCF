from rest_framework.exceptions import PermissionDenied
from rest_framework import generics, status
from .models import Formula
from .serialisers import FormulaSerializer
from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class FormulaCreate(generics.CreateAPIView):
    serializer_class = FormulaSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        formula = serializer.save()

        return Response(
            {"id": formula.id, "url": f"/formulate/{formula.id}"},
            status=status.HTTP_201_CREATED,
        )


class FormulaList(ListAPIView):
    """
    LIST OF FORMULAE. for more info see the serialiser.
    """

    serializer_class = FormulaSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        queryset = Formula.objects.filter(user=user)
        for formula in queryset:
            formula.prepare_for_serialization()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class FormulaDetail(RetrieveUpdateAPIView):

    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

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


class FormulaDelete(generics.DestroyAPIView):
    """
    DELETE A FORMULA. Straightforward.
    """

    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer


# Path: formulae/urls.py
