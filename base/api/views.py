from ..models import *
from rest_framework.serializers import ModelSerializer 
from decimal import Decimal 
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .serializer import *
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.db.models import F, Q
import requests
from django.http import JsonResponse
from django.core.cache import cache
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.hashers import make_password
import logging


User = get_user_model()

class UserProfileAPIView(APIView):
    permission_classes = [AllowAny] 

    def get(self, request):
        user_profiles = UserProfile.objects.all()
        serializer = UserProfileSerializer(user_profiles, many=True)
        return Response(serializer.data)



logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        logger.debug(f"Login attempt for {username} with password {password}")

        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            logger.debug(f"Login successful for {username}, token created: {token.key}")
            return Response({'token': token.key, 'userId': user.id}, status=status.HTTP_200_OK)
        else:
            logger.error(f"Login failed for {username}")
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class FundAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            project = Project.objects.get(id=pk)
            print(project)
            print(request.data.get('funding_amount'))
            print("post")
            # project = get_object_or_404(Project, pk=pk)
            creator = project.creator 
            print(creator)
            print(project.percentage_funded)
             
            print(project)
            
            project.current_funding += Decimal(request.data.get('funding_amount'))
            print(project.percentage_funded)
            if (project.percentage_funded >= 100):
                print('enter')
                creator.fund_collected += Decimal(request.data.get('funding_amount'))
                print('exit')
            creator.save()
            project.save()
            print(project.current_funding)
            return Response({"message": "Project successfully funded"}, status=200)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    
    def get(self, request, pk):
        try:
            project = Project.objects.filter(id=pk)
            serializer = ProjectSerializer(project, many=True)
            return Response(serializer.data)


        except Exception as e: 
            return Response({"error:", "Project not found"}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class UsersView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    
@method_decorator(csrf_exempt, name='dispatch')
class ProjectsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        # projects = Project.objects.all()
        today = now().date()

        # Filter projects where the end date has not passed or the funding is at least 100%
        projects = Project.objects.filter(
            Q(end_date__gte=today) | Q(current_funding__gte=F('funding_goal'))
        ) 
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data) 
    

    def post(self, request, *args, **kwargs):
        # Extract user ID from request data
        user_id = request.data.get('creator')
        print(user_id)

        # Check if a Creator with the given user_id exists
        creator = None
        if user_id:
            try:
                # Assume Creator is directly linked to a User
                user = User.objects.get(id=user_id)
                print(user)
                creator, created = Creator.objects.get_or_create(user=user)
            except User.DoesNotExist:
                return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
        # Update request data with the creator instance
        request.data['creator'] = creator.id
        print(creator.id)
        
        # Now proceed with the normal serialization process
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectDetail(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        projects = Project.objects.filter(id=pk) 
        serializer = ProjectSerializer(projects, many=True) 
        return Response(serializer.data) 
    
@method_decorator(csrf_exempt, name='dispatch')
class CreatorsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Retrieve all Creator instances
        creators = Creator.objects.all()
        # Use CreatorSerializer to serialize the data
        serializer = CreatorSerializer(creators, many=True)
        return Response(serializer.data)
    
@method_decorator(csrf_exempt, name='dispatch')
class CreatorDetail(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        # Get the Creator object by pk (primary key)
        creator = get_object_or_404(Creator, pk=pk)
        
        # Use the CreatorSerializer to serialize the Creator object
        serializer = CreatorSerializer(creator)
        return Response(serializer.data)

class UserDetail(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        user = get_object_or_404(User, id=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = get_object_or_404(User, id=pk)
        serializer = UserSerializer(user, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)  # Log or print the errors to understand what's wrong
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class BackerView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        backers = Backer.objects.all()
        backer_user_ids = [backer.user.id for backer in backers] 
        backer_users = User.objects.filter(pk__in = backer_user_ids) 
        serializer = BackerSerializer(backer_users, many=True) 
        return Response(serializer.data) 
    
class CommentsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        comments = Comment.objects.all() 
        serializer = CommentSerializer(comments, many=True) 
        return Response(serializer.data)  

class CommentDetail(APIView):
    permission_classes = [AllowAny]
    def get(self, request, title):
        comments = Comment.objects.filter(project__title = title)
        serializer = CommentSerializer(comments, many=True) 
        return Response(serializer.data) 

