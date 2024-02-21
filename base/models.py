from django.db import models
from django.urls import reverse

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
    title = models.TextField(max_length=200)
    description = models.TextField()
    creator = models.ForeignKey(Creator, on_delete = models.CASCADE)
    # audience = models.ManyToManyField(Audience)
    funding_goal = models.DecimalField(max_digits=10, decimal_places=2)
    current_funding = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)

    
    # dic[creator]+=1 
    
    def get_creator_count(self, creator):
        return self.dic[creator]
        
    

    def __str__(self):
        return self.title 
    
    def get_absolute_url(self):
        return reverse('project-detail', args=[str(self.pk)])

