from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User
from datetime import date
from django.conf import settings 

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    favorite_cricketer = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.user.username

class Backer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)
    bio = models.TextField(null=True, blank=True, default=None)
    amount_pledged = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.user.username
    
    def get_absolute_url(self):
        return reverse('backer-detail', args=[str(self.user.pk)])

class Creator(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)
    bio = models.TextField(null=True, blank=True, default=None)
    fund_collected = models.DecimalField(default=0,max_digits=10,decimal_places=2)

    def __str__(self):
        return self.user.username
    
    def get_absolute_url(self):
        return reverse('creator-detail', args=[str(self.user.pk)])

class Project(models.Model):
    TYPE_CHOICES = [
        ('technology', 'Technology'),
        ('art', 'Art'),
        ('comics','Comics'),
        ('games','Games'),
        ('publishing','Publishing'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    creator = models.ForeignKey(Creator, on_delete=models.CASCADE)
    # backers = models.ManyToManyField(User, related_name='backed_projects')  
    project_type = models.CharField(max_length=200, choices=TYPE_CHOICES, default='technology')
    funding_goal = models.DecimalField(max_digits=10, decimal_places=2)
    current_funding = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    photo = models.ImageField(upload_to='images/',blank=True, null=True)
    rewards = models.TextField(null=True, blank=True, max_length=1000)
    @property 
    def Photourl(self):
        if self.photo:
            return self.photo.url
        else:
            return settings.MEDIA_URL + 'default_img.jpg'
    
    @property 
    def percentage_funded(self):
        try:
            return int(100 * self.current_funding / self.funding_goal)
        except:
            return 0

        
    

    @property
    def remaining_time(self):
        now = date.today()  
        time_difference = self.end_date - now
        days = time_difference.days
        hours, remainder = divmod(time_difference.seconds, 3600)
        minutes, _ = divmod(remainder, 60)
        if days > 0:
            return f"{days} {'day' if days == 1 else 'days'} left"
        elif hours > 0:
            return f"{hours} {'hour' if hours == 1 else 'hours'} left"
        elif minutes > 0:
            return f"{minutes} {'minute' if minutes == 1 else 'minutes'} left"
        else:
            return "Due date ended"


    def __str__(self):
        return self.title 
    
    def get_absolute_url(self):
        return reverse('project-detail', args=[str(self.pk)])

class Comment(models.Model):
    project = models.ForeignKey(
        Project, 
        related_name="comments",  
        on_delete=models.CASCADE
    )
    commenter_name = models.CharField(max_length=200)
    comment_body = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.title} - {self.commenter_name}"
