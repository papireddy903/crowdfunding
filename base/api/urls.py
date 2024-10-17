from django.urls import path 
from .views import *

# localhost:8000/api/login 
urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='login'),
    path('fund/<int:pk>/', FundAPIView.as_view(), name='fund_project'),
    path('users/', UsersView.as_view(), name='users'),
    path('projects/', ProjectsView.as_view(), name='projects'),
    path('projects/<int:pk>/', ProjectDetail.as_view(), name='project_detail'),
    path('creators/', CreatorsView.as_view(), name='creators'),
    path('creators/<int:pk>', CreatorDetail.as_view(), name='creator_detail'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user_detail'),
    path('backers/', BackerView.as_view(), name='backers'),
    path('comments/', CommentsView.as_view(), name='comments'),
    path('comments/<str:title>/', CommentDetail.as_view(), name='comment_detail'),
    path("user_profiles/",UserProfileAPIView.as_view(), name='user_profiles'),
]
