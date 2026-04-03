from django.db import models

# Create your models here.

class MusicPrompt(models.Model):
    class Genre(models.TextChoices):
        POP = "Pop", "Pop"
        ROCK = "Rock", "Rock"
        JAZZ = "Jazz", "Jazz"
        HIPHOP = "Hiphop", "Hiphop"
        
    class Occasion(models.TextChoices):
        BIRTHDAY = "Birthday", "Birthday"
        WORKOUT = "Workout", "Workout"
        RELAX = "Relax", "Relax"
        PARTY = "Party", "Party"
        
        
    title = models.CharField(max_length=200)
    genre = models.CharField(max_length=50, choices=Genre.choices, default=Genre.ROCK)
    occasion = models.CharField(max_length=50, choices=Occasion.choices, default=Occasion.PARTY)
    created_at = models.DateTimeField(auto_now_add=True) 
        
    class Meta:
        db_table = "musicprompt"
        
    
    def __str__(self): #
        return f"{self.title} {self.genre} {self.occasion}"