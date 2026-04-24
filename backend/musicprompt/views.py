from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import MusicPrompt
from .serializers import MusicPromptSerializers
from .strategies import MusicGeneratorContext
from music.models import Music
import os
import requests as req

# Create your views here.
class MusicPromptView(APIView):
    def get(self, request, pk=None): # pk = primary key = id
        if pk:
            try:
                musicprompt = MusicPrompt.objects.get(pk=pk) # get = get 1 record
                serializer = MusicPromptSerializers(musicprompt)
            except:
                return Response({}, status=status.HTTP_200_OK)
        else: #get all data in user table
            musicprompts = MusicPrompt.objects.all()
            serializer = MusicPromptSerializers(musicprompts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = MusicPromptSerializers(data=request.data)
        if serializer.is_valid():
            # Use Strategy Pattern Context
            context = MusicGeneratorContext()
            result = context.execute_generation(request.data)
            
            
            
            # Assuming returning the API wrapper result
            # We determine status according to whether it failed.
            if "error" in result:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
        
            music_prompt = serializer.save() # save prompt
            task_id = result.get("taskId") # Extract taskId safely
            music = Music.objects.create(
            title=request.data.get("title"),
            genre=request.data.get("genre"),
            duration_time=0,  # temporary
            status=Music.GenerationStatus.PENDING,
            task_id=task_id,
            music_prompt=music_prompt
        )
            
            library_id = request.data.get("library_id")
            if library_id:
                try:
                    from library.models import Library
                    library = Library.objects.get(pk=library_id)
                    from music.models import Playlist
                    Playlist.objects.create(music=music, library=library)
                except Exception as e:
                    pass
            
            
            
            return Response(result, status=status.HTTP_201_CREATED)
        
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
    def put(self, request, pk=None):
        if pk is None:
            return Response(
                {"detail": "PUT requires pk in URL."},
                status=status.HTTP_400_BAD_REQUEST
            )

        musicprompt = get_object_or_404(MusicPrompt, pk=pk)
        serializer = MusicPromptSerializers(musicprompt, data=request.data)  # full update
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

        musicprompt = get_object_or_404(MusicPrompt, pk=pk)
        serializer = MusicPromptSerializers(musicprompt, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if pk is None:
            return Response(
                {"detail": "DELETE requires pk in URL."},
                status=status.HTTP_400_BAD_REQUEST
            )

        musicprompt = get_object_or_404(MusicPrompt, pk=pk)
        musicprompt.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
class MusicPromptStatusView(APIView):
    def get(self, request, task_id):
        # Use Strategy Pattern Context
        context = MusicGeneratorContext()
        result = context.execute_status_check(task_id)
        
        if "error" in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            music = Music.objects.get(task_id=task_id)
        except Music.DoesNotExist:
            return Response(
                {"error": "Music record not found for this task_id."},
                status=status.HTTP_404_NOT_FOUND
            )

        result_status = result.get("status")

        if result_status == "SUCCESS":
            music.status = Music.GenerationStatus.COMPLETED
            music.audio_url = result.get("audio_url")
            music.save()

        elif result_status == "FAILED":
            music.status = Music.GenerationStatus.FAILED
            music.save()

        else:
            music.status = Music.GenerationStatus.GENERATING
            music.save()

        return Response(result, status=status.HTTP_200_OK)