from rest_framework import serializers
from .models import Music

class MusicSerializers(serializers.Serializer):
    class Meta:
        model = Music
        fields = ["title", "genre"] # "__all__"