from django.urls import path 
from . import views 
from django.contrib.auth import views as auth_views

urlpatterns = [
    path("",views.index,name="index"),
    # path('login/', views.login, name='login'),
    # path('logout/', views.logout, name='logout'),
    # path('signup/', views.signup, name='signup'),
    path("fund_project/<int:pId>", views.fund_project,name="fund_project"),
    path("all-projects/",views.list_projects,name="all_projects"),
    path("all-projects/<int:pId>",views.view_project, name="view_project"),
    path("add-project/", views.add_project,name="add_project"),
    
     
    
]