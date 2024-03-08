# register models on the admin page

from django.contrib import admin
from .models import Ingredient
admin.site.register(Ingredient)
