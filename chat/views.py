from django.shortcuts import render
import random
# Create your views here.

def index(request):
    context = {}
    if request.method == 'GET':
        if request.GET.get('q') == 'room_id':
            # Generate a random string of 8 characters
            room_id = ''.join(random.sample('ABCDEFGHIJKLMNOPQRSTUVWXYZabc', k=8))
            context['room_id'] = room_id
    return render(request, 'chat/index.html', context=context)

def room(request):
    return render(request, 'chat/room.html')