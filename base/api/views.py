from ..models import User, Project, Creator , Backer
from rest_framework.serializers import ModelSerializer 
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .serializer import BackerSerializer, UserSerializer, ProjectSerializer, CreatorSerializer



class UsersView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
class ProjectsView(APIView):
    def get(self, request):
        projects = Project.objects.all() 
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data) 

class CreatorsView(APIView):
    def get(self, request):
        creators = Creator.objects.all()
        creator_user_ids = [creator.user.id for creator in creators]
        creator_users = User.objects.filter(pk__in=creator_user_ids)

        serializer = UserSerializer(creator_users, many=True)  
        return Response(serializer.data)

class UserDetail(APIView):
    def get(self, request, username):
        users = User.objects.get(username=username)
        serializer = UserSerializer(users, many=False)
        return Response(serializer.data)
    
class BackerView(APIView):
    def get(self, request):
        backers = Backer.objects.all()
        backer_user_ids = [backer.user.id for backer in backers] 
        backer_users = User.objects.filter(pk__in = backer_user_ids) 
        serializer = BackerSerializer(backer_users, many=True) 
        return Response(serializer.data) 
