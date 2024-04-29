from django.shortcuts import render, get_object_or_404, redirect
from .models import User, Project, Creator, Backer 
from .forms import FundingForm, AddProjectForm
from django.utils import timezone 
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Max, Sum
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from django.http.response import Http404
from django.contrib.auth import authenticate, login , logout 
# from rest_framework.views import APIView 
from .models import User, Project, Creator

from django.shortcuts import render, get_object_or_404
from django.db.models import Max, F
from .models import Project
# from .serializer import UserSerializer, ProjectSerializer, CreatorSerializer
# from rest_framework.response import Response 

from .forms import CommentForm
# from simplegmail import Gmail
from paypal.standard.forms import PayPalPaymentsForm 
from django.conf import settings 
import uuid 
from django.urls import reverse 

def checkOut(request):
    
    host = request.get_host()

    paypal_checkout = {
        'business':settings.PAYPAL_RECEIVER_EMAIL,
        'amount': 500,
        'item_name':"demo",
        'invoice':uuid.uuid1(),
        'currency_code':'USD',
        'notify_url': f"http://{host}{reverse('paypal-ipn')}" ,
        'return_url': f"http://{host}{reverse('index')}",
        'cancel_url': f"http://{host}{reverse('index')}"
    }

    paypal_payment = PayPalPaymentsForm(initial=paypal_checkout)

    context = {
        'product':"product",
        'paypal':paypal_payment
    }


    return render(request, 'checkout.html', context)

# gmail = Gmail()

# sender_mail = "donate.brightfuture1@gmail.com"

# def send_email(recipient, subject, message):
#     message = message.replace("\n", "<br>")
#     params = {
#         "to": recipient,
#         "sender": sender_mail,
#         "subject": subject,
#         "msg_html": message,
#         "signature": True
#     }

#     message = gmail.send_message(**params)  
    
#     print("Message sent successfully")


def loginPage(request):
    if request.method == 'POST':
        print('hi')
        username = request.POST.get('username')
        password = request.POST.get('password')
        try:
            user = User.objects.get(username=username)
            print('user exists')
        except:
            messages.error(request, "User doesn't exist")
            return redirect('loginPage')
        
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            # send_email(user.)
            return redirect("index") 
        else:
            messages.error(request, 'Username or Password does not exist',{"page":"login"})
    return render(request, 'login.html',{})

def logoutUser(request):
    logout(request)
    return redirect('index')
    context = {}
    return render(request, 'login.html', context)

def registerUser(request):
    form = UserCreationForm()
    if request.method=='POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()
            login(request, user) 
            return redirect('index')
        else:
            messages.error(request, 'An error occured during registration')

    context = {"form":form}
    return render(request, 'register.html',context)

def index(request):
    all_projects = []
    creator_projects = dict()
    users = User.objects.all()
    projects = Project.objects.all()
    funded_projects= Project.objects.filter(current_funding__gt = 0)
    total_projects = len(funded_projects)
    total_funding = Project.objects.aggregate(Sum('current_funding'))['current_funding__sum']
    for project in projects:
        creator = project.creator
        all_projects.append(project)
        creator_projects[creator] = creator_projects.get(creator, 0) + 1

    usernames = [user.username for user in users]
    context = {'usernames': usernames,
    'creator_projects': creator_projects,
    'all_projects': all_projects,
    'total_projects':total_projects,
    'total_funding':total_funding
    }

    return render(request, 'index.html', context)




@login_required(login_url='login')
def fund_project(request, pId):
    project = get_object_or_404(Project, pk=pId)

    if request.method == "POST":
        form = FundingForm(request.POST)
        if form.is_valid():
            funding_amount = form.cleaned_data["funding_amount"]
            project.current_funding += funding_amount 
            user = request.user
            backer, created = Backer.objects.get_or_create(user=user)
            backer.amount_pledged += funding_amount
            print(backer.id)
            print(backer.user.id)
            if created:
                backer.save()
            backer.save()
            project.backers.add(backer.user.id)
            project.save()
            messages.success(request, 'Thank you for funding and backing this project!')
            return render(request, 'confirmation.html')
    else:
        form = FundingForm()
    
    return render(request, "fund_project.html", {'project': project, 'form': form})



# @login_required(login_url='login')
def list_projects(request):
    user = request.user.username 
    all_projects = Project.objects.all()
    try:
        creator = get_object_or_404(Creator, user__username=user)
        print("entered try")
        projects_excluded_user = Project.objects.exclude(creator=creator)
        highest_funded_project = projects_excluded_user.order_by('-current_funding').first()    

        if highest_funded_project is None:
            context = {
                "featured_project": None,
                "remaining_projects": [],
                "percentage_funded": [],
                "featured_percentage": None
            }
        else:
            featured_percentage = [[highest_funded_project.id, int(100 * highest_funded_project.current_funding / highest_funded_project.funding_goal)]]

            percentage_funded = [[project.id, int(100 * project.current_funding / project.funding_goal)] for project in projects_excluded_user]

            # remaining_projects = projects_excluded_user.exclude(id=highest_funded_project.id)

            context = {
                # "featured_project": highest_funded_project
                "remaining_projects": projects_excluded_user,
                "percentage_funded": percentage_funded,
                "featured_percentage": featured_percentage
            }

        return render(request, 'projects.html', context)
    
    except Http404:
        print("entered except")
        creator = None
        highest_funded_project = all_projects.order_by('-current_funding').first()    

        if highest_funded_project is None:
            context = {
                "featured_project": None,
                "remaining_projects": [],
                "percentage_funded": [],
                "featured_percentage": None
            }
        else:
            featured_percentage = [[highest_funded_project.id, int(100 * highest_funded_project.current_funding / highest_funded_project.funding_goal)]]

            percentage_funded = [[project.id, int(100 * project.current_funding / project.funding_goal)] for project in all_projects]

            remaining_projects = all_projects.exclude(id=highest_funded_project.id)

            context = {
                "featured_project": highest_funded_project,
                "remaining_projects": remaining_projects,
                "percentage_funded": percentage_funded,
                "featured_percentage": featured_percentage
            }

        return render(request, 'projects.html', context)


def view_project(request, pId):
    project = get_object_or_404(Project, id=pId)

    # Calculate progress bar width
    progress_width = (project.current_funding / project.funding_goal) * 100

    return render(request, "project.html", {'project': project, 'progress_width': progress_width})

@login_required(login_url='login')
def add_project(request):
    if request.method == "POST":
        form = AddProjectForm(request.POST, request.FILES)
        if form.is_valid():
            title = form.cleaned_data["title"]
            description = form.cleaned_data["description"]
            funding_goal = form.cleaned_data["funding_goal"]
            project_type = form.cleaned_data["project_type"]
            creator_name = request.user.username
            photo = form.cleaned_data["photo"]
            end_date = form.cleaned_data["end_date"]
            print("creatorname: ",creator_name)

            try:
                creator = User.objects.get(username=creator_name)
            except User.DoesNotExist:
                return redirect('register.html')


            new_project = Project(
                title=title,
                description=description,
                funding_goal=funding_goal,
                current_funding=0,
                project_type=project_type,
                start_date=timezone.now(),
                photo = photo,
                end_date=end_date,
                creator=Creator.objects.get_or_create(user=creator)[0]
            )
            new_project.save()

            return redirect('http://localhost:5173/home', pId=new_project.id)
        else:
            error_message = "Invalid form data. Please check the entered values."
            return render(request, 'add_project.html', {'form': form, 'error_message': error_message})
    else:
        form = AddProjectForm()
    
    return render(request, 'add_project.html', {'form': form})



def project_type(request, ptype):
    print(request)
    print(ptype)
    projects_type_list = Project.objects.filter(project_type=ptype)
    print(projects_type_list)
    print(list(projects_type_list))
    return render(request, 'project_type.html', {'projects_type_list': projects_type_list})

@login_required(login_url='login')
def add_comment(request, pId):
    project = Project.objects.get(id=pId)
    user = request.user.username 
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.project = project
            comment.commenter_name = user 
            comment.save()
            return redirect('view_project', pId=pId)
    else:
        form = CommentForm()

    return render(request, 'project.html', {'form': form, 'project': project})


def user_profile(request,pk):
    user = User.objects.get(id=pk)
    print(user)
    return render(request,'user_profile.html', {'user':user})

