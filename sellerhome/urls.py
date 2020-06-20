from django.urls import path
from sellerhome import views

urlpatterns = [
    path('', views.seller_view, name="sellerhome"),
]