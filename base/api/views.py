from ..models import User, Project, Creator 
from rest_framework.serializers import ModelSerializer 
from rest_framework.decorators import APIView
from rest_framework.response import Response

class UserSerializer(ModelSerializer):
    class Meta:
        model = User 
        fields = '__all__' 

class ProjectSerializer(ModelSerializer):
    class Meta:
        model = Project 
        fields=  '__all__'

class CreatorSerializer(ModelSerializer):
    class Meta:
        model = Creator 
        fields= '__all__' 



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
        creator_user_ids = [creator.username_id for creator in creators]
        creator_users = User.objects.filter(pk__in=creator_user_ids)

        serializer = UserSerializer(creator_users, many=True)  
        return Response(serializer.data)

class UserDetail(APIView):
    def get(self, request, username):
        users = User.objects.get(username=username)
        serializer = UserSerializer(users, many=False)
        return Response(serializer.data)