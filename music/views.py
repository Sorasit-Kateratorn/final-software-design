from django.shortcuts import render

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
                library = Music.objects.get(pk=pk) # get = get 1 record
                serializer = MusicSerializers(library)
            except:
                return Response({}, status=status.HTTP_200_OK)
        else: #get all data in user table
            libraries = Music.objects.all()
            serializer = MusicSerializers(libraries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = MusicSerializers(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
