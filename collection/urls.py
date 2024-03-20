from django.urls import path
from . import views

app_name = 'collection'
urlpatterns = [
    path('', views.CollectionView.as_view(), name="collection"),
    path("<int:ing_id>/modify", views.modify, name="modify"),
    path("add_to_collection", views.add_to_collection, name="add_to_collection"),
    path("api/collection", views.CollectionAPI.as_view(), name="api-collection", ),
]
