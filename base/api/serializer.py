from rest_framework.serializers import ModelSerializer 
from ..models import User, Project, Creator , Backer, Comment

class CreatorSerializer(ModelSerializer):
    class Meta:
        model = Creator 
        fields= '__all__' 

class ProjectSerializer(ModelSerializer):
    creator = CreatorSerializer()
    class Meta:
        model = Project 
        fields=  '__all__' 
        
class UserSerializer(ModelSerializer):
    created_projects = ProjectSerializer(many=True, source='creator.project_set', read_only=True)
    backed_projects = ProjectSerializer(many=True, source='backer.project_set', read_only=True)
    class Meta:
        model = User 
        fields = '__all__' 

class BackerSerializer(ModelSerializer):
    class Meta:
        model = Backer 
        fields= '__all__'
    

class CommentSerializer(ModelSerializer):
    class Meta: 
        model = Comment 
        fields= '__all__'