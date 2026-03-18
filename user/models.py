from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices): # enum
        USER = "User", "User"
        ADMIN = "Admin", "Admin"

    role = models.CharField(max_length=5, choices=Role.choices, default=Role.USER)
    
    class Meta:
        db_table = "users"
        #ordering = ["username"]
        
    def __str__(self): 
        return f"{self.username}({self.role})"
