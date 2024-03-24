from django.urls import path
from . import views

app_name = 'formulae'
urlpatterns = [
    path('formula-list/', views.FormulaListView.as_view(), name="formulae_list"),
    path('<int:pk>/', views.FormulaDetailView.as_view(), name="formula"),
    path('<int:pk>/edit/', views.FormulaUpdateView.as_view(), name="formula_edit"),
    path('new/', views.FormulaCreateView.as_view(), name='formula_new'),
]
