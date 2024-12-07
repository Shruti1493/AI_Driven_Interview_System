# urls.py
from django.urls import path
from .views import *

urlpatterns = [
    
    path('upload_video/', VideoUploadView.as_view(), name='upload_video'),
]


