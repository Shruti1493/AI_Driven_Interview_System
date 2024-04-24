# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from pyresparser import ResumeParser
# from django.core.files.storage import FileSystemStorage
# import os

# class ResumeParseView(APIView):
#     def post(self, request, format=None):
#         file = request.data.get('resume')
#         if not file:
#             return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

#         upload_folder = 'Uploaded_resumes'

        
#         storage = FileSystemStorage(location=upload_folder)
#         name = storage.save(file.name, file)
#         file_path = storage.path(name)

#         try:
#             parser = ResumeParser(file_path)
#             resume_data = parser.get_extracted_data()
#             return Response(resume_data, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pyresparser import ResumeParser
from django.core.files.storage import FileSystemStorage
import os

# List of skills
SKILLS_LIST = [
    "c", "html", "css", "javascript", "tableau", "jquery", "bootstrap", "git", "sass", "less",
    "stylus", "angularjs", "django", "angular", "react", "vuejs", "meteor", "node.js", "backbone.js",
    "aurelia", "chrome devtools", "agile", "ui", "typescript", "reactjs", "github", "es7", "photoshop",
    "adobe illustrator", "wordpress", "version control", "java", "python", "ruby", ".net", "c++", "perl",
    "php", "postgres sql", "mysql", "mongodb", "oracle", "redis", "sql server", "docker", "kubernetes",
    "nginx", "apache", "iis servers", "microsoft iis", "rest api", "soap api", "express.js", "phoenix (elixir)",
    "scrum", "ruby on rails", "laravel", "flask", "asp.net Core", "spring mvc", "codeigniter", "cakephp",
    "symfony", "play framework", "c#", "ux", "microservices", "npm", "yarn", "graphql", "mobx", "redux", "orm",
    "dynamodb", "cicd", "go", "nosql", "kotlin", "android studio", "flutter", "material design", "ionic", "linux",
    "windows", "xml", "firebase", "sqlite", "rdbms", "xcode", "machine learning", "r", "torch", "theano", "tensorflow",
    "swift", "scikit-learn", "pybrain", "keras", "ibm watson", "deeplearning", "matlab", "linear regression",
    "logistic regression", "decision trees", "random forests", "svm", "k-nearest neighbors", "xgboost", "clustering",
    "neural networks", "naive bayes", "apache spark", "hadoop", "scala", "kafka", "aws lambda", "matplotlib", "aws",
    "azure", "google cloud platform", "terraform", "jenkins", "ansible", "puppet", "unix", "bash", "powershell",
    "windows server", "networking", "cybersecurity", "penetration testing", "encryption", "blockchain", "ethereum",
    "solidity", "cryptocurrency", "responsive design", "frontend development", "backend development", "full stack development",
    "agile methodology", "continuous integration", "continuous deployment", 
     "api development", "restful api", "graphql", "microservices", "cloud computing", "containerization",
    "monitoring", "logging", "observability", "agile project management", "project management", "business analysis",
    "requirements gathering", "software architecture", "system design", "database design", "real-time applications",
    "web scraping", "automation", "scripting", "shell scripting", "api integration", "third-party integrations"
]

class ResumeParseView(APIView):
    def post(self, request, format=None):
        file = request.data.get('resume')
        if not file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        upload_folder = 'Uploaded_resumes'
        storage = FileSystemStorage(location=upload_folder)
        name = storage.save(file.name, file)
        file_path = storage.path(name)

        try:
            parser = ResumeParser(file_path)
            resume_data = parser.get_extracted_data()

            filtered_skills = [skill for skill in resume_data.get('skills', []) if skill.lower() in SKILLS_LIST]

            resume_data['skills'] = filtered_skills

            return Response(resume_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
