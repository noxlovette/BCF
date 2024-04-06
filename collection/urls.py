from django.urls import path
from . import views

app_name = 'collection'
urlpatterns = [
    path('', views.CollectionView.as_view(), name="collection"),
    path("api/collection/<int:user_id>", views.CollectionAPI.as_view(), name="api-collection"),
]
