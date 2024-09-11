from django.urls import path, re_path
from . import views

app_name = "collection"
urlpatterns = [
    path(
        "new/api/collection/",
        views.NewCollectionAPI.as_view(),
    ),
    re_path(
        r"^new/api/ingredient/(?P<pk>[0-9a-f-]+)/$",
        views.NewIngredientDetailView.as_view(),
    ),
    re_path(
        r"^new/api/ingredient/update/(?P<pk>[0-9a-f-]+)/$",
        views.NewIngredientUpdateView.as_view(),
    ),
    path(
        "new/api/ingredient/create/",
        views.NewIngredientCreateView.as_view(),
    ),
    re_path(
        r"^new/api/ingredient/delete/(?P<pk>[0-9a-f-]+)/$",
        views.NewIngredientDeleteView.as_view(),
    ),
]
