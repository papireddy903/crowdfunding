from django.urls import path 
from . import views 

urlpatterns = [
    path("login/",views.LoginAPIView.as_view(), name='login'),
    path("users/",views.UsersView.as_view(), name='users'),
    path("projects/",views.ProjectsView.as_view(), name='projects'),
    path("projects/<int:pk>", views.ProjectDetail.as_view(), name='projectdetail'),
    path("creators/",views.CreatorsView.as_view(), name='creators'),
    path("users/<str:username>",views.UserDetail.as_view(), name='userdetail'),
    path("backers/",views.BackerView.as_view(), name="backers"),
    path("comments/",views.CommentsView.as_view(), name='comments'),
    path("comments/<str:title>", views.CommentDetail.as_view(),name='commentdetail'),
    path("fund/<int:pk>", views.FundAPIView.as_view(), name='fund'),
]
