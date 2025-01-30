from django.urls import path, re_path
from . import views

app_name = "collection"
urlpatterns = [
    path(
        "new/api/collection/",
        views.CollectionAPI.as_view(),
    ),
    re_path(
        r"^new/api/ingredient/(?P<pk>[0-9a-f-]+)/$",
        views.IngredientDetailView.as_view(),
    ),
    re_path(
        r"^new/api/ingredient/update/(?P<pk>[0-9a-f-]+)/$",
        views.IngredientUpdateView.as_view(),
    ),
    path(
        "new/api/ingredient/create/",
        views.IngredientCreateView.as_view(),
    ),
    re_path(
        r"^new/api/ingredient/delete/(?P<pk>[0-9a-f-]+)/$",
        views.IngredientDeleteView.as_view(),
    ),
]
