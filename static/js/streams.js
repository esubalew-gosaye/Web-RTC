
const APP_ID = "YOUR_APP_ID"

const CHANNEL_NAME = sessionStorage.getItem("room")
const TOKEN = sessionStorage.getItem("token")
let UID = sessionStorage.getItem("uid");
let username = sessionStorage.getItem("name");

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })

let localTracks = []
let remoteUsers = {}


let joinAndDisplayLS = async () => {

    document.getElementById("room-name").innerText = CHANNEL_NAME

    client.on('user-published', handledUserJoined)
    client.on('user-left', handledUserLeft)
    try{
        await client.join(APP_ID, CHANNEL_NAME, TOKEN, UID)
    }catch(err){
        console.log("error", err)
        window.open("/", "_self")
    }
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()
    
    let member = await createMember()

    let player = `<div class="video-container" id="user-container-${UID}"> 
    <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
    <div class="video-player" id="user-${UID}"></div>
    </div>`;

    document.getElementById("video-streams").insertAdjacentHTML("beforeend", player)

    localTracks[1].play(`user-${UID}`)
    localTracks[0].play()

    await client.publish([localTracks[0], localTracks[1]])
}

let handledUserJoined = async (user, mediaType) =>{
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)

    if(mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if(player != null){
            player.remove()
        }

        let member = await getMember(user)

        player = `<div class="video-container" id="user-container-${user.uid}"> 
            <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
            <div class="video-player" id="user-${user.uid}"></div>
            </div>`;
        document.getElementById("video-streams").insertAdjacentHTML("beforeend", player)

        user.videoTrack.play(`user-${user.uid}`)
        if(mediaType === 'audio'){
            user.audioTrack.play()
        }
    }
}

let handledUserLeft = (user) =>{
    let player = document.getElementById(`user-container-${user.uid}`)
    if(player != null){
        player.remove() 
    }
    delete remoteUsers[user.uid]
}

let leaveAndRemoveLS = async () => {
    for (trackName in localTracks) {
        let track = localTracks[trackName]
        if (track) {
            track.stop()
            track.close()
            localTracks[trackName] = undefined
        }
    }

    await client.leave()
    deleteMember()

    window.open("/", "_self")
} 

let toggleCamera = async (e) => {
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = "#fff"   
    }else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = "rgb(255, 80, 80, 1)"
    }
}
let toggleMic = async (e) => {
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = "#fff"   
    }else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = "rgb(255, 80, 80, 1)"
    }
}

let createMember = async () => {
    let response = await fetch("/create_member/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({'name': username, 'room_name': CHANNEL_NAME, 'uid': UID })
    })
    let data = await response.json()
    return data
}
let deleteMember = async () => {
    let response = await fetch("/delete_member/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({'name': username, 'room_name': CHANNEL_NAME, 'uid': UID })
    })
    let data = await response.json()
}
let getMember = async (user) => { 
    let response = await fetch(`/get_member/?uid=${user.uid}&room_name=${CHANNEL_NAME}`)
    let data = await response.json()
    return data
}
    

joinAndDisplayLS()

window.addEventListener("beforeunload", deleteMember)

document.getElementById("leave-btn").addEventListener("click", leaveAndRemoveLS)
document.getElementById("camera-btn").addEventListener("click", toggleCamera)
document.getElementById("mic-btn").addEventListener("click", toggleMic)
