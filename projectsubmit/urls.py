from django.urls import path
from projectsubmit import views

urlpatterns = [
    path('', views.projectsubmit_view, name="projectsubmit"),
]