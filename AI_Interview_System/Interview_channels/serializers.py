# serializers.py
from rest_framework import serializers

class QueryInputSerializer(serializers.Serializer):
    topic = serializers.CharField(max_length=255)
