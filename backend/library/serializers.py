from rest_framework import serializers
from .models import Library

from music.serializers import MusicSerializers

class LibrarySerializers(serializers.ModelSerializer):
    tracks = serializers.SerializerMethodField()

    class Meta:
        model = Library
        fields = ["id", "name", "created_at", "user", "tracks"]
        read_only_fields = ["user"]

    def get_tracks(self, obj):
        return MusicSerializers(obj.music_set.all(), many=True).data