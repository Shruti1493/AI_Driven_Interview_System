from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from Account.models import *


class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'FirstName', 'LastName','College','Branch','phone_number','profile_photo', 'password', 'password2']  
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.pop('password2', None)

        if password != password2:
            raise serializers.ValidationError("Password and confirm password do not match")

        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

from django.contrib.auth import authenticate

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(email=email, password=password)

            if not user:
                raise serializers.ValidationError("Invalid email or password")

            if not user.is_active:
                raise serializers.ValidationError("User account is disabled")

            data['user'] = user
        else:
            raise serializers.ValidationError("Username and password are required")

        return data



class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'FirstName', 'LastName','College','Branch','phone_number','id', 'profile_photo']

