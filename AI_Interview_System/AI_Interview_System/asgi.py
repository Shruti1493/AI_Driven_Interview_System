# """
# ASGI config for AI_Interview_System project.

# It exposes the ASGI callable as a module-level variable named ``application``.

# For more information on this file, see
# https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
# """

# import os

# from django.core.asgi import get_asgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AI_Interview_System.settings')

# application = get_asgi_application()
import os
import Interview_channels.routing
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AI_Interview_System.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    # Add your ASGI app routes here
    "websocket": URLRouter(
        Interview_channels.routing.websocket_urlpatterns
    )

})
