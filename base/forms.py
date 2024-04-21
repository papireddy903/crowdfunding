from django import forms 
from .models import *

class FundingForm(forms.Form):
    funding_amount = forms.DecimalField(label='Funding Amount', min_value=0)


class AddProjectForm(forms.ModelForm):
    TYPE_CHOICES = [
        ('technology', 'Technology'),
        ('art', 'Art'),
        ('comics', 'Comics'),
        ('games', 'Games'),
        ('publishing', 'Publishing'),
    ]
    
    project_type = forms.ChoiceField(choices=TYPE_CHOICES, label='Project Type')
    # photo = forms.ImageField(label="Upload Photo", required=False)
    photo = forms.ImageField(label="Upload Photo", required=False)

    class Meta:
        model = Project
        fields = ['title', 'description', 'funding_goal', 'project_type', 'photo', 'end_date']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
            'end_date': forms.TextInput(attrs={'type': 'date'}),
        }

    def clean_project_name(self):
        title = self.cleaned_data['title']
        return title

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ('comment_body',)
        widgets = {
            
            'comment_body': forms.Textarea(attrs={'class': 'form-control'}),
        }