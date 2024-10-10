from django.contrib import admin
from django.urls import path,include
from Account.views import *
urlpatterns = [
    path('reg/', UserRegistrationView.as_view(), name ='register'),
    path('profile/', UserProfileView.as_view(), name ='profile'),
    path('login/', UserLoginView.as_view(), name ='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # path('changepassword/', UserChangePassword.as_view(), name ='changepassword'),
    

]
