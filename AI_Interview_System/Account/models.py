
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from phonenumber_field.modelfields import PhoneNumberField

import uuid 

class UserManager(BaseUserManager):
    def create_user(self, email, FirstName, LastName, password=None, College=None, Branch=None, phone_number=None,profile_photo=None):
        if not email:
            raise ValueError("User must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            FirstName=FirstName,
            LastName=LastName,
            College=College,
            Branch=Branch,
            phone_number=phone_number,
            profile_photo = profile_photo
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, FirstName, LastName, password=None, College=None, Branch=None, phone_number=None):
        user = self.create_user(
            email,
            FirstName=FirstName,
            LastName=LastName,
            password=password,
            College=College,
            Branch=Branch,
            phone_number=phone_number,
        )
        user.is_staff = True
        user.is_superuser = True
        user.is_admin = True
        user.save(using=self._db)
        return user

def user_profilephoto_file_path(instance, filename):
    return f'profile_photos/{instance.FirstName}_{instance.LastName}_{instance.id}/{filename}'

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) 
    email = models.EmailField(verbose_name='Email', max_length=255, unique=True)
    FirstName = models.CharField(max_length=200, blank=True)
    LastName = models.CharField(max_length=200, blank=True)
    College = models.CharField(max_length=100, blank=True, null=True)
    Branch = models.CharField(max_length=100, blank=True, null=True)
    phone_number = PhoneNumberField(blank=True)
    profile_photo = models.ImageField(upload_to=user_profilephoto_file_path, null=True, blank=True)  # New field for profile photo
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['FirstName', 'LastName', 'College',
            'Branch',
            'phone_number',
             ]

    def delete(self, *args, **kwargs):
        self.userresume_set.all().delete()
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.email


