from rest_framework.serializers import ModelSerializer, Serializer, SerializerMethodField
from rest_framework import serializers
from django.contrib.auth import authenticate
from ..models import User, Project, Creator , Backer, Comment

class CreatorSerializer(ModelSerializer):
    class Meta:
        model = Creator 
        fields= '__all__' 

class ProjectSerializer(ModelSerializer):
    percentage_funded = SerializerMethodField()
    remaining_time = SerializerMethodField()

    class Meta:
        model = Project 
        fields = '__all__'
        read_only_fields = ('creator',)  # Make 'creator' a read-only field

    def get_percentage_funded(self, obj):
        return obj.percentage_funded

    def get_remaining_time(self, obj):
        return obj.remaining_time 

    def create(self, validated_data):
        # Get the user from the context. The c
        # ontext is set by the view.
        user = self.context['request'].user
        print(user)
        # Fetch the creator associated with this user.
        creator, _ = Creator.objects.get_or_create(user=user)
        print(creator)
        # Assign the creator to the project.
        project = Project.objects.create(creator=creator, **validated_data)
        return project

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user



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