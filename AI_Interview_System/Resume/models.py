import uuid
from djongo import models
from Account.models import User

class ResumeDataStore(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    mobile_number = models.CharField(max_length=15, null=True, blank=True)
    skills = models.JSONField(default=list )   
    college_name = models.CharField(max_length=255, null=True, blank=True)
    degree = models.CharField(max_length=255, null=True, blank=True)
    designation = models.CharField(max_length=255, null=True, blank=True)
    experience = models.JSONField(default=list )   
    company_names = models.JSONField(default=list )   
    no_of_pages = models.IntegerField(null=True, blank=True)
    total_experience = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name

class ExampleModel(models.Model):
    string_list = models.JSONField(default=list)


