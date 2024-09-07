# In your migration file (e.g., 0002_add_slug_field.py)
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('browse', '0001_initial'),  # Adjust the dependency based on your setup
    ]

    operations = [
        migrations.AddField(
            model_name='ingredient',
            name='slug',
            field=models.SlugField(blank=True),
        ),
    ]
