from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import roomMember
import random
import time
import json


# Create your views here.

def getToken(request):
    APP_ID = "484e7765377f417fa9f98b2a096f2494"
    APP_CERTIFICATE = "976c6eb6a7d4482fb5a57bacc2cf47c5"
    CHANNEL_NAME = request.GET.get('channel')
    uid = random.randint(1, 230)

    expiration_time_in_seconds = 3600 * 24
    current_timestamp = int(time.time())
    privilege_expired_ts = current_timestamp + expiration_time_in_seconds

    role = 1

    token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, CHANNEL_NAME, uid, role, privilege_expired_ts)
    return JsonResponse({'token': token, 'uid': uid}, safe=False)


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


@csrf_exempt
def createUser(request):
    data = json.loads(request.body)
    member, created = roomMember.objects.get_or_create(name=data['name'], room_name=data['room_name'], uid=data['uid'])
    return JsonResponse({'name': data['name']}, safe=False)


def getMember(request):
    uid = request.GET.get('uid')
    room_name = request.GET.get('room_name')

    member = roomMember.objects.get(room_name=room_name, uid=uid)
    return JsonResponse({'name': member.name}, safe=False)


@csrf_exempt
def deleteMember(request):
    data = json.loads(request.body)
    member = roomMember.objects.get(name=data['name'], room_name=data['room_name'], uid=data['uid'])
    member.delete()
    return JsonResponse({'name': "member deleted!"}, safe=False)
