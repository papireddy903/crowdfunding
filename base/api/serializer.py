from rest_framework.serializers import ModelSerializer 
from ..models import User, Project, Creator , Backer, Comment 

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

class BackerSerializer(ModelSerializer):
    class Meta:
        model = Backer 
        fields= '__all__'
    

class CommentSerializer(ModelSerializer):
    class Meta: 
        model = Comment 
        fields= '__all__'