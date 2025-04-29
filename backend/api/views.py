from django.http import FileResponse
import os
import subprocess

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.shortcuts import render
from django.contrib.auth.models import User

from .serializers import UserSerializer

# Create your views here.

# Validates a POST request and then saves a new object (User model in this case)
class CreateUserView(generics.CreateAPIView):

    # Django REST Framework asks "Give me the collection of database records I'll be working with", 
    # this is answered with queryset. Even though this is a pure create operation, we are writing this
    # because generic views like CreateAPIView, ListAPIView, RetrieveAPIView, etc, are built on the 
    # assumption that we are working with a queryset
    queryset = User.objects.all() 

    # What serializer to use. This line which actually creates the User (that code is in serializers.py)
    serializer_class = UserSerializer 

    # Even unauthenticated users can access this view
    permission_classes = [AllowAny] 



class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist('files')
        
        upload_folder = os.path.join('api', 'model', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        
        # Upload files
        for file_obj in files:
            upload_path = os.path.join(upload_folder, file_obj.name)
            with open(upload_path, 'wb+') as destination:
                for chunk in file_obj.chunks():
                    destination.write(chunk)
        
        # Run the model script
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_main_py = os.path.join(BASE_DIR, 'api', 'model', 'main.py')
        
        try:
            subprocess.run(["python", model_main_py], check=True)
        except subprocess.CalledProcessError:
            return Response({"error": "Processing failed!"}, status=500)
        
        # Get the actual generated files
        output_dir = os.path.join('api', 'model', 'output')
        output_files = [f for f in os.listdir(output_dir) if f.startswith('processed_') and f.endswith('.pdf')]
        
        if not output_files:
            return Response({"error": "No output files were generated"}, status=500)
        
        # Return the actual filenames
        return Response({"output_filenames": output_files})

class FileDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, filename, *args, **kwargs):
        output_path = os.path.join('api', 'model', 'output', filename)

        if os.path.exists(output_path):
            return FileResponse(open(output_path, 'rb'), as_attachment=True)
        else:
            return Response({"error": "File not found."}, status=404)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)