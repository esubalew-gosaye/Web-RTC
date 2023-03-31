# Web-RTC

## Installation

1. clone the repo
- `git clone https://github.com/esubalew-gosaye/Web-RTC.git`
2. Create Virtual Environment
3. install requirements.txt file
- `pip install -r requirements.txt`
4. Signup and create project on [Agora](https://www.agora.io/en/)
5. Modify settings in `chat/views.py`
```
def getToken(request):
    APP_ID = "YOUR_APP_ID"
    APP_CERTIFICATE = "YOUR_APP_CERTIFICATE"

```
6. Modify settings in `static/js/streams.js`
```
const APP_ID = "YOUR_APP_ID"
```
7. generate ROOM ID
- If you don't have room id click on `I need a room ID` It will generate new room ID for you
- and then or if you have room id enter your id and username to form it will take you to the chat.

> You can reach me `@mesayem`