from django.urls import path
from . import views

app_name = 'formulae'
urlpatterns = [
    path('formulae/', views.FormulaView.as_view(), name="formulae"),
]
