from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import *
admin.site.unregister(User)

class ProjectInline(admin.TabularInline):
    model = Project 
    extra = 0

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('username', 'email')  
@admin.register(Creator)
class CreatorAdmin(admin.ModelAdmin):
    list_display = ('user',)  

@admin.register(Backer)
class BackerAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio', 'amount_pledged')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'project_type', 'funding_goal', 'current_funding', 'creator','end_date')
    exclude = ('backers',)

@admin.register(Comment) 
class CommentAdmin(admin.ModelAdmin):
    list_display = ('project','commenter_name','comment_body','date_added') 

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'favorite_cricketer']

admin.site.register(UserProfile, UserProfileAdmin)