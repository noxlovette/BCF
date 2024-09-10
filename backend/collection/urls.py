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
    ),
    re_path(
        r"^new/api/ingredient/(?P<pk>[0-9a-f-]+)/$",
        views.NewIngredientDetailView.as_view(),
    ),
    path(
        "new/api/collection/",
        views.NewCollectionAPI.as_view(),
    ),
    re_path(
        r"^new/api/ingredient/update/(?P<pk>[0-9a-f-]+)/$",
        views.NewIngredientUpdateView.as_view(),
    ),
    path(
        "new/api/ingredient/create/",
        views.NewIngredientCreateView.as_view(),
    )
]
