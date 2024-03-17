from django.urls import path

from . import views


app_name = 'user_collection'
urlpatterns = [
    path("<int:ing_id>/modify", views.modify, name="modify"),
    path("add_to_collection", views.add_to_collection, name="add_to_collection")
]