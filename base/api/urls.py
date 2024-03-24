from django.urls import path 
from . import views 

urlpatterns = [
    path("users/",views.UsersView.as_view(), name='users'),
    path("projects/",views.ProjectsView.as_view(), name='projects'),
    path("creators/",views.CreatorsView.as_view(), name='creators'),
    path("users/<str:name>",views.UserDetail.as_view(), name='userdetail'),
    path("backers/",views.BackerView.as_view(), name="backers"),
]

