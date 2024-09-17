from django.urls import path

from . import views

app_name = "browse"
urlpatterns = [
    # /browse/
    path("api/ingredients", views.BrowseView.as_view(), name="api-ingredients"),
    path(
        "api/ingredients/<slug:slug>/",
        views.IngredientDetailView.as_view(),
        name="api-ingredient-detail",
    ),
    path(
        "api/suggested-ingredients/new/",
        views.SuggestedIngredientCreateView.as_view(),
        name="api-suggested-ingredients",
    ),
    path(
        "api/suggested-ingredients/",
        views.SuggestedIngredientListView.as_view(),
        name="api-suggested-ingredients-list",
    ),
    path(
        "api/descriptors/",
        views.DescriptorsListAPIView.as_view(),
        name="api-descriptors",
    ),
    path(
        "api/ingredients-total/",
        views.TotalBrowseView.as_view(),
        name="api-ingredients-total",
    ),
]
