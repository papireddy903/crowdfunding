from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Creator, Audience, Project

# Unregister the built-in User model
admin.site.unregister(User)

class ProjectInline(admin.TabularInline):
    model = Project 
    extra = 0

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('username', 'email')  # Adjusted list_display

# Adjusted list_display for CreatorAdmin and AudienceAdmin
@admin.register(Creator)
class CreatorAdmin(admin.ModelAdmin):
    list_display = ('username',)

@admin.register(Audience)
class AudienceAdmin(admin.ModelAdmin):
    list_display = ('username', 'interests')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'project_type', 'funding_goal', 'current_funding', 'creator')
