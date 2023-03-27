from django.urls import path
from . import views

app_name = 'chat'
urlpatterns = [
    path('', views.index, name='index'),
    path('room/', views.room, name='room'),
    path('get_token/', views.getToken, name='room'),
]