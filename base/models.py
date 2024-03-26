from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User
from datetime import date

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
    backers = models.ManyToManyField(User, related_name='backed_projects')  
    project_type = models.CharField(max_length=200, choices=TYPE_CHOICES, default='technology')
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
