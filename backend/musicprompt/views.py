from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import MusicPrompt
from .serializers import MusicPromptSerializers
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
        suno_api_key = os.getenv("SUNO_API_KEY")
        serializer = MusicPromptSerializers(data=request.data)
        if serializer.is_valid():
            
            prompt_text = (
                f"Generate a {request.data['genre']} song for a {request.data['occasion']} occasion "
                f"with the title '{request.data['title']}'"
            )
            # Call suno api
            headers = {
                "Authorization": f"Bearer {suno_api_key}",
                "Content-Type": "application/json"
            }

            suno_param = {
                "customMode": True,
                "instrumental": True,
                "model": "V5_5",
                "callBackUrl": "https://api.example.com/callback",
                "prompt": prompt_text,
                "style": request.data.get("genre"),
                "title": request.data.get("title"),
            }
            
            response = req.post(
            "https://api.sunoapi.org/api/v1/generate",
            headers=headers,
            json=suno_param
        )
            
            
            #serializer.save()
            return Response(response.json(), status=status.HTTP_201_CREATED)
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