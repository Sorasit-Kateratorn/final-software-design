from django.shortcuts import render, get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Music
from .serializers import MusicSerializers

# Create your views here.



class MusicView(APIView):
    def get(self, request, pk=None): # pk = primary key = id
        if pk:
            try:
                music = Music.objects.get(pk=pk) # get = get 1 record
                serializer = MusicSerializers(music)
            except:
                return Response({}, status=status.HTTP_200_OK)
        else: #get all data in user table
            musics = Music.objects.all()
            serializer = MusicSerializers(musics, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = MusicSerializers(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
    def put(self, request, pk=None):
        if pk is None:
            return Response(
                {"detail": "PUT requires pk in URL."},
                status=status.HTTP_400_BAD_REQUEST
            )

        music = get_object_or_404(Music, pk=pk)
        serializer = MusicSerializers(music, data=request.data)  # full update
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        if pk is None:
            return Response(
                {"detail": "PATCH requires pk in URL."},
                status=status.HTTP_400_BAD_REQUEST
            )

        music = get_object_or_404(Music, pk=pk)
        serializer = MusicSerializers(music, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        if pk is None:
            return Response(
                {"detail": "DELETE requires pk in URL."},
                status=status.HTTP_400_BAD_REQUEST
            )

        music = get_object_or_404(Music, pk=pk)
        music_prompt = music.music_prompt
        music.delete()
        if music_prompt:
            music_prompt.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
