from django.contrib import admin
from .models import User, Creator, Audience, Project

class ProjectInline(admin.TabularInline):
    model = Project 
    extra = 0



@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name','email','dob')


@admin.register(Creator)
class CreatorAdmin(admin.ModelAdmin):
    list_display = ('user',)
    inlines = [ProjectInline]

@admin.register(Audience)
class AudienceAdmin(admin.ModelAdmin):
    list_display = ('user', 'interests')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'description','project_type','funding_goal','current_funding','creator')