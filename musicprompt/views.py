from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import MusicPrompt
from .serializers import MusicPromptSerializers

# Create your views here.
class MusicPromptView(APIView):
    def get(self, request, pk=None): # pk = primary key = id
        if pk:
            try:
                library = MusicPrompt.objects.get(pk=pk) # get = get 1 record
                serializer = MusicPromptSerializers(library)
            except:
                return Response({}, status=status.HTTP_200_OK)
        else: #get all data in user table
            libraries = MusicPrompt.objects.all()
            serializer = MusicPromptSerializers(libraries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = MusicPromptSerializers(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)