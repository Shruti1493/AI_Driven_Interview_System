from django.urls import path
from . import consumers  # Ensure this imports your consumers correctly

websocket_urlpatterns = [
    path('ws/sc/', consumers.InterviewConsumer.as_asgi()),
    # path('ws/ac/', consumers.MyAsyncConsumer.as_asgi()),
]
