from django.urls import path
from .views import ResumeParseView

urlpatterns = [
    path('parse/', ResumeParseView.as_view(), name='parse_resume'),
]
