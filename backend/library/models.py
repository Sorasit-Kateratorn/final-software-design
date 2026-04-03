from django.db import models

# Create your models here.
class Library(models.Model):
    
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey("user.User",
                             on_delete=models.CASCADE,
                             related_name="user")
    
    class Meta:
        db_table = "library"
        
    def __str__(self):
        return f"{self.name}({self.created_at})"