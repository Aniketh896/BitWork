from django.shortcuts import render

# Create your views here.

def newproject_view(request):
    return render(request, 'newproject.html', {})
