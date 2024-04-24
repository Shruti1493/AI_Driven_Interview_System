from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/sc/', consumers.MySyncConsumerClass.as_asgi()),
    path('ws/ac/', consumers.MyASyncConsumerClass.as_asgi()),
  
]