from rest_framework import serializers
from .models import Music

class MusicSerializers(serializers.ModelSerializer):
    class Meta:
        model = Music
        fields = ["id", "title", "genre", "status", "audio_url", "duration_time", "task_id"]