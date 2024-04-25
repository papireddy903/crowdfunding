from ..models import User, Project, Creator , Backer, Comment
from rest_framework.serializers import ModelSerializer 
from decimal import Decimal 
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .serializer import BackerSerializer, UserSerializer, ProjectSerializer, CreatorSerializer, CommentSerializer
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

@method_decorator(csrf_exempt, name='dispatch')
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class FundAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            project = Project.objects.get(id=pk)
            print(project)
            funding_amount = Decimal(request.data.get('funding_amount', 0))
            project.current_funding += funding_amount
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


class UsersView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
class ProjectsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        projects = Project.objects.all() 
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data) 

class ProjectDetail(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        projects = Project.objects.filter(id=pk) 
        serializer = ProjectSerializer(projects, many=True) 
        return Response(serializer.data) 

class CreatorsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        creators = Creator.objects.all()
        creator_user_ids = [creator.user.id for creator in creators]
        creator_users = User.objects.filter(pk__in=creator_user_ids)

        serializer = UserSerializer(creator_users, many=True)  
        return Response(serializer.data)

class UserDetail(APIView):
    permission_classes = [AllowAny]
    def get(self, request, username):
        users = User.objects.get(username=username)
        serializer = UserSerializer(users, many=False)
        return Response(serializer.data)
    
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


