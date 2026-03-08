from django.db import models

# Create your models here.

class Library(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    music = models.ManyToManyField("music.Music", blank=True) # blank= true due to 0..* relationship
    # "app_name.ModelName" in field relationship
    
    user = models.ForeignKey("user.User", on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name