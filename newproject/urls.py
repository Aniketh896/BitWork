from django.urls import path
from newproject import views

urlpatterns = [
    path('', views.newproject_view, name="newproject"),
]