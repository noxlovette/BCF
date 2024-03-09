from django.urls import path

from . import views

app_name = "ingredients_app"
urlpatterns = [
    # /ingredients_app/
    path("", views.index, name='index'),
    path("<int:ing_id>/", views.detail, name="ingredient"),
    path("<int:ing_id>/family", views.family, name="family"),
    path("<int:ing_id>/type", views.change_type, name="type"),
]
