from django.shortcuts import render, get_object_or_404, redirect
from .models import User, Project, Creator
from .forms import FundingForm, AddProjectForm
from django.utils import timezone 
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required


def index(request):
    all_projects = []
    creator_projects = dict()
    users = User.objects.all()
    projects = Project.objects.all()
    for project in projects:
        creator = project.creator
        all_projects.append(project)
        creator_projects[creator] = creator_projects.get(creator, 0) + 1

    usernames = [user.username for user in users]
    context = {'usernames': usernames,
    'creator_projects': creator_projects,
    'all_projects': all_projects,
    }

    return render(request, 'index.html', context)

@login_required
def fund_project(request,pId):
    project = get_object_or_404(Project, pk=pId)

    if request.method == "POST":
        form = FundingForm(request.POST)
        if form.is_valid():
            funding_amount = form.cleaned_data["funding_amount"]
            project.current_funding += funding_amount 
            project.save()
            return render(request, 'confirmation.html')
        
    form = FundingForm()
    return render(request, "fund_project.html", {'project':project, 'form':form})

def list_projects(request):
    projects = Project.objects.all()

    return render(request, 'projects.html', {"all_projects":projects})


def view_project(request, pId):
    project = get_object_or_404(Project, id=pId)

    return render(request, "project.html", {'project':project})

@login_required
def add_project(request):
    if request.method == "POST":
        form = AddProjectForm(request.POST)
        if form.is_valid():
            project_name = form.cleaned_data["project_name"]
            description = form.cleaned_data["description"]
            funding_goal = form.cleaned_data["funding_goal"]
            project_type = form.cleaned_data["project_type"]
            creator_name = form.cleaned_data["creator"]
            enddate = form.cleaned_data["enddate"]

            try:
                creator = User.objects.get(username=creator_name)
            except User.DoesNotExist:
                creator = User.objects.create(username=creator_name)

            # Create a new project and associated creator
            new_project = Project(
                title=project_name,
                description=description,
                funding_goal=funding_goal,
                current_funding=0,
                project_type=project_type,
                start_date=timezone.now(),
                end_date=enddate,
                creator=Creator.objects.get_or_create(username=creator)[0]
            )
            new_project.save()

            return redirect('view_project', pId=new_project.id)
        else:
            # Handle the case when the form is not valid, e.g., display an error message
            error_message = "Invalid form data. Please check the entered values."
            return render(request, 'add_project.html', {'form': form, 'error_message': error_message})
    else:
        form = AddProjectForm()
    
    return render(request, 'add_project.html', {'form': form})


# def signup(request):
    


# def login(request):

def project_type(request, ptype):
    print(request)
    print(ptype)
    projects_type_list = Project.objects.filter(project_type=ptype)
    print(projects_type_list)
    print(list(projects_type_list))
    return render(request, 'project_type.html', {'projects_type_list': projects_type_list})


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('index')  # Replace 'home' with the URL you want to redirect to after registration
    else:
        form = UserCreationForm()

    return render(request, 'registration/register.html', {'form': form})
