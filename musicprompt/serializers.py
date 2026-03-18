from rest_framework import serializers
from .models import MusicPrompt

class MusicPromptSerializers(serializers.Serializer):
    class Meta:
        model = MusicPrompt
        fields = "__all__"