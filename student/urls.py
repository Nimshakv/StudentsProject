from django.urls import path
from django.conf.urls import url
from student import views

urlpatterns = [
    path(r'', views.home, name='home'),
    path(r'load', views.load, name='load'),
    path(r'add/', views.add, name='add'),
    path(r'edit/<int:pk>', views.edit, name='edit'),
    path(r'delete/<int:pk>', views.delete, name='delete'),
]