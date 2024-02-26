from django.db import models
from django.urls import reverse
from django.utils import timezone
from datetime import date, timedelta


# Create your models here.
dic = dict()

class User(models.Model):
    name = models.TextField(max_length=200)
    email = models.EmailField(null=True)
    dob = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name 
    
    def get_absolute_url(self):
        return reverse('user-detail',args=[str(self.pk)])

    

class Creator(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bio = models.TextField(null=True, blank=True)


    

    def __str__(self):
        return self.user.name
    
    def get_absolute_url(self):
        return reverse('creator-detail',args=[str(self.user.pk)])
    

class Audience(models.Model):  #backers
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    interests = models.TextField()

class Project(models.Model):
    TYPE_CHOICES = [
        ('tech', 'Technology'),
        ('art', 'Art'),
        ('comics','Comics'),
        ('games','Games'),
        ('publishing','Publishing'),
    ]
    title = models.TextField(max_length=200)
    description = models.TextField()
    creator = models.ForeignKey(Creator, on_delete = models.CASCADE)
    # audience = models.ManyToManyField(Audience)
    project_type = models.CharField(max_length=200, choices=TYPE_CHOICES,default='tech')
    funding_goal = models.DecimalField(max_digits=10, decimal_places=2)
    current_funding = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)

    @property
    def remaining_time(self):
        now = date.today()  
        time_difference = self.end_date - now
        days = time_difference.days
        hours, remainder = divmod(time_difference.seconds, 3600)
        minutes, _ = divmod(remainder, 60)
        if days > 0:
            return f"{days} {'day' if days == 1 else 'days'} to go"
        elif hours > 0:
            return f"{hours} {'hour' if hours == 1 else 'hours'} to go"
        elif minutes > 0:
            return f"{minutes} {'minute' if minutes == 1 else 'minutes'} to go"
        else:
            return "Less than a minute to go"

    
    def get_creator_count(self, creator):
        return self.dic[creator]
        
    

    def __str__(self):
        return self.title 
    
    def get_absolute_url(self):
        return reverse('project-detail', args=[str(self.pk)])

