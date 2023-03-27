const APP_ID = "484e7765377f417fa9f98b2a096f2494"
const CHANNEL_NAME = "WEBRTC"
const TOKEN = "007eJxTYNB+ZLSumUH3nefNcx8vXCvN8PtQmBB2tf1O8KSMnU+2/LRWYDCxMEk1NzczNTY3TzMxNE9LtEyztEgySjSwNEszMrE0SatTTGkIZGT47lTIxMgAgSA+G0O4q1NQiDMDAwA3PCFO"

let UID;

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })

let localTracks = []
let remoteUsers = {}


let joinAndDisplayLS = async () => {

    client.on('user-published', handledUserJoined)
    client.on('user-left', handledUserLeft)

    UID = await client.join(APP_ID, CHANNEL_NAME, TOKEN, null)
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()
    
    let player = `<div class="video-container" id="user-container-${UID}"> 
    <div class="username-wrapper"><span class="user-name">Esubalew</span></div>
    <div class="video-player" id="user-${UID}"></div>
    </div>`;
    
    console.log("consolelog------------",UID)
    console.log("consolelog------------",localTracks)
    console.log("consolelog------------",player)

    document.getElementById("video-streams").insertAdjacentHTML("beforeend", player)

    localTracks[1].play(`user-${UID}`)

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

        player = `<div class="video-container" id="user-container-${user.uid}"> 
            <div class="username-wrapper"><span class="user-name">Esubalew</span></div>
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
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = "#fff"   
    }else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = "rgb(255, 80, 80, 1)"
    }
}

joinAndDisplayLS()
document.getElementById("leave-btn").addEventListener("click", leaveAndRemoveLS)
document.getElementById("camera-btn").addEventListener("click", toggleCamera)
document.getElementById("mic-btn").addEventListener("click", toggleMic)