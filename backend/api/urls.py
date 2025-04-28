from django.urls import path
from . import views

from .views import FileUploadView, FileDownloadView

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('download/<str:filename>/', FileDownloadView.as_view(), name='file-download'),
]