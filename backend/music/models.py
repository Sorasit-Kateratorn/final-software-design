from django.db import models

# Create your models here.
class Music(models.Model):
    
    class Genre(models.TextChoices):
        POP = "Pop", "Pop"
        ROCK = "Rock", "Rock"
        JAZZ = "Jazz", "Jazz"
        HIPHOP = "Hiphop", "Hiphop"
        
    class GenerationStatus(models.TextChoices):
        PENDING = "Pending", "Pending"
        GENERATING = "Generating", "Generating"
        COMPLETED = "Completed", "Completed"
        FAILED = "Failed", "Failed"
        
    title = models.CharField(max_length=200)
    genre = models.CharField(max_length=50, choices=Genre.choices, default=Genre.ROCK)
    duration_time = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=GenerationStatus.choices, default=GenerationStatus.PENDING)
    music_prompt = models.OneToOneField(
        "musicprompt.MusicPrompt",
        on_delete=models.CASCADE,
        related_name="music_prompt"
    )
    library = models.ManyToManyField("library.Library", through="Playlist")
    # "app_name.ModelName"
    audio_url = models.URLField(null=True, blank=True)
    task_id = models.CharField(max_length=255, null=True, blank=True)
        
        
    class Meta:
        db_table = "music"
        """indexs = [
            models.Index(fields=["music_prompt"]),
            models.Index(fields=["title"])
        ]"""
        
        

    def __str__(self): #
        return f"{self.title} {self.genre} {self.status}"
        
        
class Playlist(models.Model): # playlist table is temp table of library and music ManyToMany relation
    music = models.ForeignKey(Music, on_delete=models.CASCADE, related_name="music")
    library = models.ForeignKey("library.Library", on_delete=models.CASCADE, related_name="library")
    created_at = models.DateTimeField(auto_now_add=True) 
    
    class Meta:
        db_table = "playlist"