from django.shortcuts import render
import random
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse 
import time
# Create your views here.

def getToken(request):
    APP_ID = "484e7765377f417fa9f98b2a096f2494"
    APP_CERTIFICATE = "976c6eb6a7d4482fb5a57bacc2cf47c5"
    CHANNEL_NAME = request.GET.get('channel')
    uid = random.randint(1, 230)

    expiration_time_in_seconds = 3600 *24
    current_timestamp = int(time.time())
    privilege_expired_ts = current_timestamp + expiration_time_in_seconds

    role = 1

    token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, CHANNEL_NAME, uid, role, privilege_expired_ts)
    return JsonResponse({'token':token, 'uid':uid}, safe=False)

def index(request):
    context = {}
    if request.method == 'GET':
        if request.GET.get('q') == 'room_id':
            # Generate a random string of 8 characters
            room_id = ''.join(random.sample('ABCDEFGHIJKLMNOPQRSTUVWXYZabc', k=8))
            context['room_id'] = room_id

        if request.GET.get('q') == 'has_room':
            context['has_room_id'] = True

    return render(request, 'chat/index.html', context=context)

def room(request):
    return render(request, 'chat/room.html')