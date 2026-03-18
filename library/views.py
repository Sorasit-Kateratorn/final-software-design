from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Library
from .serializers import LibrarySerializers

# Create your views here.



class LibraryView(APIView):
    def get(self, request, pk=None): # pk = primary key = id
        if pk:
            try:
                library = Library.objects.get(pk=pk) # get = get 1 record
                serializer = LibrarySerializers(library)
            except:
                return Response({}, status=status.HTTP_200_OK)
        else: #get all data in user table
            libraries = Library.objects.all()
            serializer = LibrarySerializers(libraries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = LibrarySerializers(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
