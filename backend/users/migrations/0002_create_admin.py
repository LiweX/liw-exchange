from django.contrib.auth import get_user_model
from django.db import migrations

def create_admin_user(apps, schema_editor):
    User = get_user_model()
    username = 'admin'
    password = 'admin1234'  # Cambia esto por una contraseña segura
    email = 'admin@example.com'
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)

class Migration(migrations.Migration):
    dependencies = [
        ('users', '0001_initial'),
    ]
    operations = [
        migrations.RunPython(create_admin_user),
    ]
