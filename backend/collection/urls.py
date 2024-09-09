from django.urls import path, re_path
from . import views

app_name = "collection"
urlpatterns = [
    path("api/collection/", views.CollectionAPI.as_view(), name="api-collection"),
    path(
        "api/ingredient/<int:collectionIngredientId>/update/",
        views.IngredientUpdateView.as_view(),
        name="api-ingredient-update",
    ),
    path(
        "api/ingredient/<int:collectionIngredientId>/delete/",
        views.IngredientDeleteView.as_view(),
        name="api-ingredient-delete",
    ),
    path(
        "api/ingredient/new/",
        views.IngredientCreateView.as_view(),
        name="api-ingredient-create",
    ),
    path(
        "api/ingredient/custom/<int:customCollectionIngredientId>/update/",
        views.CustomIngredientUpdateView.as_view(),
    ),
    path(
        "api/ingredient/custom/<int:customCollectionIngredientId>/delete/",
        views.CustomIngredientDeleteView.as_view(),
    ),
    re_path(
        r"^api/ingredient/(?P<uuid>[0-9a-f-]+)/$",
        views.IngredientDetailView.as_view(),
    )
]
