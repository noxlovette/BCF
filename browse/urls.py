from django.urls import path

from . import views
app_name = "browse"
urlpatterns = [
    # /browse/
    path("api/ingredients", views.IngredientsView.as_view(), name="api-ingredients"),
    path('', views.IndexView.as_view(), name="browse"),
    path("<int:pk>/", views.SingleIngredientView.as_view(), name="ingredient"),
    path("<int:pk>/family", views.FamilyView.as_view(), name="family"),
]
