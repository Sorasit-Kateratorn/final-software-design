from django.db import models


# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=200)
    email = models.EmailField()
    daily_generation_limit = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


class Admin(User):
    role = models.CharField(max_length=50)