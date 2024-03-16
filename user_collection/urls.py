from django.urls import path

from . import views


app_name = 'user_collection'
urlpatterns = [
    path("", views.IndexView.as_view(), name='index'),
    path("<int:pk>/", views.SingleIngredientView.as_view(), name="ingredient"),
    path("<int:pk>/family", views.FamilyView.as_view(), name="family"),
    path("<int:ing_id>/modify", views.modify, name="modify"),
]