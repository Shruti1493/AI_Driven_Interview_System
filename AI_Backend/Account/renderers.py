from rest_framework import renderers
import json
from uuid import UUID
from rest_framework.response import Response
from datetime import datetime 
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID) or isinstance(obj, datetime):
            return str(obj)
        return super().default(obj)

class UserRenderer(renderers.JSONRenderer):
    charset = 'utf-8'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        if isinstance(data, Response):
            data = data.data

        response = ""
        if 'ErrorDetail' in str(data):
            response = json.dumps({'errors': data}, cls=CustomJSONEncoder)
        else:
            response = json.dumps(data, cls=CustomJSONEncoder)

        return response

    

# from rest_framework import renderers
# import json
# from uuid import UUID

# class CustomJSONEncoder(json.JSONEncoder):
#     def default(self, obj):
#         if isinstance(obj, UUID):
#             return str(obj)
#         return super().default(obj)

# class UserRenderer(renderers.JSONRenderer):
#     charset = 'utf-8'

#     def render(self, data, accepted_media_type=None, renderer_context=None):
#         response = ""
#         if 'ErrorDetail' in str(data):
#             response = json.dumps({'errors': data}, cls=CustomJSONEncoder)
#         else:
#             response = json.dumps(data, cls=CustomJSONEncoder)

#         return response
