from django.urls import path
from . import views

app_name = 'collection'
urlpatterns = [
    path('', views.CollectionView.as_view(), name="collection"),
    path("api/collection/<int:user_id>/", views.CollectionAPI.as_view(), name="api-collection"),
    path("api/ingredient/<int:user_id>/<int:collectionIngredientId>/update/", views.IngredientUpdateView.as_view(),
         name="api-ingredient-update"),
path("api/ingredient/<int:user_id>/<int:collectionIngredientId>/delete/", views.IngredientDeleteView.as_view(),
         name="api-ingredient-delete"),
    path("api/ingredient/<int:user_id>/custom/<int:customCollectionIngredientId>/", views.CustomIngredientUpdateView.
         as_view()),
    path("api/ingredient/new/", views.IngredientCreateView.as_view(), name="api-ingredient-create"),
]