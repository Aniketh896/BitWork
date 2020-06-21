from django.shortcuts import render

# Create your views here.

def projectsubmit_view(request):
    return render(request, 'projectsubmit.html', {})
