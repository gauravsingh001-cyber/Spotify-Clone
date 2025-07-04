
let currentSongs = new Audio();
let songs;
let seek_slider = document.querySelector('.seek_slider');
// let front = document.querySelector('front');
// let back = document.querySelector('back');
let volume_slider = document.querySelector('.volume_slider');
function seekTo() {

    if (!isNaN(currentSongs.duration)) {
        let seekto = currentSongs.duration * (seek_slider.value / 100);
        currentSongs.currentTime = seekto;
    }
}

function setVolume() {
    currentSongs.volume = volume_slider.value / 100;
}

function updateSeekBar() {

    if (!isNaN(currentSongs.duration)) {
        let seekPosition = (currentSongs.currentTime / currentSongs.duration) * 100;
        seek_slider.value = seekPosition;
    }
}


seek_slider.addEventListener("input", seekTo);
volume_slider.addEventListener("input", setVolume);
currentSongs.addEventListener("timeupdate", updateSeekBar);

currentSongs.addEventListener("canplaythrough", () => {
    currentSongs.play();
});


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "invalid input"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/spotify/songs/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playMusic = (track ,pause=false) => {
    currentSongs.src = "/spotify/songs/" + track;
    if(!pause){
        currentSongs.play();
        play.src = "pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
async function main() {
    songs = await getSongs();
    playMusic(songs[0], false)
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
                                <img src="music.svg" alt="">
                                <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                            </div>
                            <div class="playnow"> 
                            <img src="play.svg" alt="">
                        </div>
       </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    // let play = document.getElementsByClassName("play");
    play.addEventListener("click", () => {
        if (currentSongs.paused) {
            play.src = "pause.svg"
            currentSongs.play()
        }
        else {
            currentSongs.pause()
            play.src = "play.svg"
        }
    })

    currentSongs.addEventListener("timeupdate", () => {
        console.log(currentSongs.currentTime, currentSongs.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds
            (currentSongs.currentTime)} / ${secondsToMinutesSeconds(currentSongs.duration)}`
    })
    back.addEventListener("click", ()=>{
        console.log("Previous clicked")
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    front.addEventListener("click", ()=>{
        console.log("Next clicked")

        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        console.log(songs,index)
        if ((index + 1) > length) {
            playMusic(songs[index + 1])
        }
    })


}
main()



