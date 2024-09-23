let currentsong=new Audio();
let songs
function ToMinutes(totalSeconds) {
    // Ensure the input is an integer
    totalSeconds = Math.floor(totalSeconds);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Pad minutes and seconds with leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(){
    
    let a=await fetch("http://127.0.0.1:3000/songs/")
    let  response =await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let as =div.getElementsByTagName("a")
    
    let songs=[]
    for (let index = 0; index <as.length; index++) {
        const element =as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split('/songs/')[1])
        }
       
    }
    return songs
   
}

const playMusic=(track)=>{
    //let audio=new Audio("/songs/"+track)
    currentsong.src="/songs/"+track
    currentsong.play()
    play.src="pause.svg"
    document.querySelector(".songinfo").innerHTML=track;
    document.querySelector(".songtime").innerHTML="00:00 / 00:00";
}

async function main(){
    

    songs= await getSongs();
    console.log(songs)

    let songUl=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML=songUl.innerHTML + `<li>
                        <img class="invert" src="music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20"," ")}</div>
                            <div>Aryan</div>
                        </div>
                        <div class="playnow">play now</div>
                            <img class="invert playnowbtn" src="player.svg" alt="">
                       
                       </li>`;
    }   
    //Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        })
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src="pause.svg"
        }
        else{
            currentsong.pause()
            play.src="player.svg"
        }
    })
    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime,currentsong.duration)
        document.querySelector(".songtime").innerHTML=`${ToMinutes(currentsong.currentTime)}/${ToMinutes(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
    })
    //add event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent =(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=percent+"%";
        currentsong.currentTime = ((currentsong.duration)*percent)/100;
    })

    //Add an event listener for hamburger
    document.querySelector(".ham").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-110%";
    })
    //Add event listener to prev and
    previous.addEventListener("click",()=>{
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1)>0){
            playMusic(songs[index-1])
        }
    })
    next.addEventListener("click",()=>{
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1)>length){
            playMusic(songs[index+1])
        }
})   

}

main()
