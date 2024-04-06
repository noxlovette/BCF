from django.urls import path
from . import views

app_name = 'collection'
urlpatterns = [
    path('', views.CollectionView.as_view(), name="collection"),
    path("api/collection", views.CollectionAPIPages.as_view(), name="api-collection"),
    path("api/full-collection", views.FullCollectionAPI.as_view(), name="api-full-collection"),
]
