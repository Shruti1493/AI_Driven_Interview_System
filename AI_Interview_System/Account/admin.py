from django.contrib import admin
from Account.models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class UserModelAdmin(BaseUserAdmin):
    list_display = ('id', 'email', 'FirstName', 'LastName', 'College', 'Branch', 'phone_number', 'is_admin','profile_photo')
    list_filter = ('is_admin',) 
    fieldsets = (
        ('User Credentials', {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('FirstName', 'LastName', 'College', 'Branch', 'phone_number')}),
        ('Permissions', {'fields': ('is_admin',)}),
    )
    add_fieldsets = ( 
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'FirstName', 'LastName', 'College', 'Branch', 'phone_number', 'password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email', 'id')
    filter_horizontal = ()

admin.site.register(User, UserModelAdmin)


# admin.site.register(UserExtractedData)

