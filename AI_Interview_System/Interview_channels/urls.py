# urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('rag/', RAGAPIView.as_view(), name='rag-api'),
    path('upload_video/', VideoUploadView.as_view(), name='upload_video'),
]


