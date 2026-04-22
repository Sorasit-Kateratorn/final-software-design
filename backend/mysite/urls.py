"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from user.views import UserView
from library.views import LibraryView
from music.views import MusicView
from musicprompt.views import MusicPromptView, MusicPromptStatusView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', UserView.as_view()),
    path('user/<int:pk>', UserView.as_view()),
    path('library/', LibraryView.as_view()),
    path('library/<int:pk>', LibraryView.as_view()),
    path('music/', MusicView.as_view()),
    path('music/<int:pk>', MusicView.as_view()),
    path('musicprompt/', MusicPromptView.as_view()),
    path('musicprompt/<int:pk>', MusicPromptView.as_view()),
    path('musicprompt/status/<str:task_id>', MusicPromptStatusView.as_view()),
]
