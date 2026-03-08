from django.db import models

class GenerationStatus(models.TextChoices):
    Pending = "Pending", "Pending"
    Generating = "Generating", "Generating"
    Completed = "Completed", "Completed"
    Failed = "Failed", "Failed"
    
class Genre(models.TextChoices):
    Pop = "Pop", "Pop"
    Rock = "Rock", "Rock"
    Jazz = "Jazz", "Jazz"
    Hiphop = "HipHop", "HipHop"
    
class Occasion(models.TextChoices):
    Birthday = "Birthday", "Birthday"
    Workout = "Workout", "Workout"
    Relax = "Relax", "Relax"
    Party = "Party", "Party"
    


# Create your models here.
class Music(models.Model):
    title = models.CharField(max_length=200)
    genre = models.CharField(max_length=50, choices=Genre.choices)
    duration_time = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=GenerationStatus.choices, default=GenerationStatus.Pending)


class MusicPrompt(models.Model):
    title = models.CharField(max_length=200)
    genre = models.CharField(max_length=50, choices=Genre.choices)
    occasion = models.CharField(max_length=50, choices=Occasion.choices)
    created_at = models.DateTimeField(auto_now_add=True) 