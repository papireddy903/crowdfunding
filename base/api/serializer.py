from rest_framework.serializers import ModelSerializer, Serializer, SerializerMethodField
from rest_framework import serializers
from django.contrib.auth import authenticate
from ..models import User, Project, Creator , Backer, Comment

class CreatorSerializer(ModelSerializer):
    class Meta:
        model = Creator 
        fields= '__all__' 

class ProjectSerializer(ModelSerializer):
    creator = CreatorSerializer()
    percentage_funded = SerializerMethodField()
    remaining_time = SerializerMethodField()
    class Meta:
        model = Project 
        fields=  '__all__' 

    def get_percentage_funded(self, obj):
        return obj.percentage_funded

    def get_remaining_time(self, obj):
        return obj.remaining_time 
        
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



# class AuthTokenSerializer(Serializer):
#     username = serializers.CharField(label="Username")
#     password = serializers.CharField(label="Password", style={'input_type': 'password'}, trim_whitespace=False)

#     def validate(self, data):
#         username = data.get('username')
#         password = data.get('password')

#         if username and password:
#             user = authenticate(request=self.context.get('request'), username=username, password=password)
#             if not user:
#                 msg = 'Unable to log in with provided credentials.'
#                 raise serializers.ValidationError(msg, code='authorization')
#         else:
#             msg = 'Must include "username" and "password".'
#             raise serializers.ValidationError(msg, code='authorization')

#         data['user'] = user
#         return data