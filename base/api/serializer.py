from rest_framework.serializers import ModelSerializer, Serializer, SerializerMethodField
from rest_framework import serializers
from django.contrib.auth import authenticate
from ..models import User, Project, Creator , Backer, Comment



class ProjectSerializer(serializers.ModelSerializer):
    percentage_funded = serializers.SerializerMethodField()
    remaining_time = serializers.SerializerMethodField()
    # creator_user_id = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'  # Ensures all fields are included, adjust if specific fields are desired

    def get_percentage_funded(self, obj):
        # Calculate or retrieve percentage funded, if not a direct field
        return obj.percentage_funded

    def get_remaining_time(self, obj):
        # Calculate or retrieve remaining time, if not a direct field
        return obj.remaining_time


    def create(self, validated_data):
        backers_data = validated_data.pop('backers', [])
        project = Project.objects.create(**validated_data)
        # Assuming backers is a many-to-many field
        # project.backers.set(backers_data) if backers_data else None
        return project

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password',]
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

class CreatorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    bio = serializers.CharField()
    fund_collected = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = Creator
        fields = ['user', 'bio', 'fund_collected']

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