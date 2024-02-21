from django import forms 

class FundingForm(forms.Form):
    funding_amount = forms.DecimalField(label='Funding Amount', min_value=0)


class AddProjectForm(forms.Form):
    project_name = forms.CharField(label='Project Name', max_length=100)
    description = forms.CharField(widget=forms.Textarea)
    funding_goal = forms.DecimalField(label='Funding Goal', min_value=0)
    creator = forms.CharField(label="Enter your Name", max_length=100)
    enddate = forms.DateField(label='End Date', widget=forms.TextInput(attrs={'type': 'date'}))



