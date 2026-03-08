from django.contrib import admin

# Register your models here.

from .models import Music, MusicPrompt

admin.site.register(Music)
admin.site.register(MusicPrompt)

