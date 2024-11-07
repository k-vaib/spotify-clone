let currentSong = new Audio();

let songs;

let currFolder;

function secToMinSec(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid Input";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

    //show all the songs in the list
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "blank";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>  <img class="invert" src="music.svg" alt="music svg">
        <div class="info">
          <div>${song.replaceAll("%20", " ")} </div>
          <div>Song Artist</div>
        </div>
        <div class="playNow">
          <span>Play Now</span>
          <img class="invert" src="play.svg" alt="">
      </div>
        
        </li>`;
  }

  //play the first song
  // var audio = new Audio(songs[0]);
  // audio.play();

  //attach an event listener to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  
  return songs;
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";

};

async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  cardContainer = document.querySelector(".cardContainer");

  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    

    if(e.href.includes("/songs")){
      // console.log(e.href)
      let folder = e.href.split("/").slice(-1)[0];
      // console.log(e.href.split("/").slice(-1)[0]);



      // //get metadata of folder
      // let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      // let response = await a.json();
      // // console.log(response);



      // Check if the folder is not empty
      let folderData = await fetch(`http://127.0.0.1:5500/songs/${folder}/`);
      let folderResponse = await folderData.text();
      let folderDiv = document.createElement("div");
      folderDiv.innerHTML = folderResponse;
      let files = folderDiv.getElementsByTagName("a");
      if (files.length > 0) {
        // Folder is not empty, fetch metadata
        let metadataResponse = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
        let metadata = await metadataResponse.json();
        console.log(metadata);
        cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
      <div class="play">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Green circular background -->
          <circle cx="12" cy="12" r="12" fill="rgb(31, 223, 101)" />
          <!-- Black SVG content -->
          <svg
            x="4"
            y="4"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#000000"
          >
            <!-- Path for the icon -->
            <path
              d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
              stroke="#000000"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
          </svg>
        </svg>
      </div>
      <img
        src="/songs/${folder}/cover.jpeg"
        alt=""
      />
      <h2>${metadata.title}</h2>
      <p>${metadata.description}</p>
    </div>`
      } else {
        console.log(`Folder ${folder} is empty. Skipping metadata fetch.`);
      }
      
    }
  }
  //load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e=> {
    e.addEventListener("click", async item=>{
    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    playMusic(songs[0]);
    })
  })
}

async function main() {
  //get the list of all songs
  await getSongs("songs/bollywood");
  // console.log(songs);

  //to play first song automatically
  playMusic(songs[0], true);

//display all the albums on the page
displayAlbums();

  //attach an event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  //Listen for time update event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secToMinSec(
      currentSong.currentTime
    )}/${secToMinSec(currentSong.duration)}`;

    //seekbar
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //add an event listener to seekbar
  document.querySelector(".seekBar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //add an event listener for close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //add an event listener to previous
  previous.addEventListener("click", () => {
    currentSong.pause()
    console.log("previous clicked");
    
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1]);
      }
  });

  //add an event listener to next
  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("next clicked");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //add an event to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
    console.log("Setting volume to ", e.target.value, "/100");
    currentSong.volume = parseInt(e.target.value)/100;
  })

  //add event listener to mute the track
  document.querySelector(".volume>img").addEventListener("click", e=>{
    if(e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = .10;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
    }
  })

  
}
main();
