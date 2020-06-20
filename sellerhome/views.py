from django.shortcuts import render

# Create your views here.

def seller_view(request):
    return render(request, 'sellerhome.html', {})