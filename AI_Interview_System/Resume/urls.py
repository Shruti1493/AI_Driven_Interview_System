from django.urls import path
from .views import *

urlpatterns = [
    path('parse/', ResumeParseView.as_view(), name='parse_resume'),
    path('api/examplemodel/', ExampleModelCreateAPIView.as_view(), name='examplemodel-create'),
]
