let form = document.querySelector(".search-form");
form.addEventListener("submit",function(event){ event.preventDefault(); });

function searchArtist(){
  let inputField = document.querySelector("#query");
  console.log("inputField",inputField);
  let query = inputField.value;
  console.log("You want to search for: ",query);
  fetchArtists(query)
}

function fetchArtists(artistName){
  let clientID = "8538a1744a7fdaa59981232897501e04";
  let url = "https://api.soundcloud.com/users.json?client_id="+clientID+"&q="+artistName;
  fetch(url).then(
    function(response){
      if(response.status !== 200){
        console.log("Response error ",response.status);
        return;
      }
      response.json().then(function(data){
        console.log("Artists received: ",data);
        addArtists(data);
      })
    },
    function(reject){
      console.log("API request rejected");
    }
  )
}

function fetchTracks(artistURI){
  console.log("fetching Tracks...");
  let clientID = "8538a1744a7fdaa59981232897501e04";
  let url = artistURI + "/tracks.json?client_id="+clientID;
  fetch(url).then(
    function(response){
      if(response.status !== 200){
        console.log("Response status error: ",response.status);
        return;
      }
      response.json().then(function(data){
        console.log("Tracks received: ",data);
        addTracks(data);
      })
    },
    function(reject){
      console.log("API request rejected!");
    }
  )

}

function addArtists(artistArray){
  //Clear query field
  let inputField = document.querySelector("#query");
  // let query = inputField.value;
  inputField.value="";

  //Clear artist results
  let artistResults = document.querySelector(".artist-results");
  while(artistResults.hasChildNodes()){
    artistResults.removeChild(artistResults.lastChild);
  }
  //Clear Track results
  let trackResults = document.querySelector(".tracks-results");
  while(trackResults.hasChildNodes()){
    trackResults.removeChild(trackResults.lastChild);
  }

  let h3 = document.createElement("h3");
  h3.textContent = "Artists found:  (" + artistArray.length + " results)";
  artistResults.appendChild(h3);

  let p = document.createElement("p");
  p.textContent = "Click an artist to list tracks";
  artistResults.appendChild(p);

  let ul = document.createElement("ul");

  if(!artistArray.length){
    let h4 = document.createElement("h4");
    h4.classList.add("no-results");
    h4.textContent = "No Results Found";
    artistResults.appendChild(h4);
  }

  for(let i = 0; i < artistArray.length; i++){
    let li = document.createElement("li");

    let div = document.createElement("div");
    div.classList.add("artist-container");
    div.id = artistArray[i].uri;

    div.addEventListener("click", function(event){
      console.log("Going to fetch tracks for: ");
      console.log(this.id);
      turnSelectedOn(this, ul);
      fetchTracks(this.id);
      window.location.hash="bottom";
    })

    let img = document.createElement("img");
    img.classList.add("artist-image");
    img.src = artistArray[i].avatar_url ? artistArray[i].avatar_url : "missing-avatar.png";
    div.appendChild(img);

    let h4 = document.createElement("h4");
    h4.textContent = artistArray[i].full_name;
    div.appendChild(h4);

    let a = document.createElement("a");
    a.href = artistArray[i].permalink_url;
    a.textContent = "SoundCloud Page";
    a.target = "_blank";
    div.appendChild(a);

    li.appendChild(div);

    ul.appendChild(li);
  }
  artistResults.appendChild(ul);

}

function addTracks(tracksArray){
  let inputField = document.querySelector("#query");
  let query = inputField.value;
  inputField.value="";

  //Clear Track results
  let trackResults = document.querySelector(".tracks-results");
  while(trackResults.hasChildNodes()){
    trackResults.removeChild(trackResults.lastChild);
  }

  let h3 = document.createElement("h3");
  h3.textContent = "Tracks found:  (" + tracksArray.length + " results)";
  trackResults.appendChild(h3);

  let p = document.createElement("p");
  p.textContent = "Click a track to play";
  trackResults.appendChild(p);

  let ul = document.createElement("ul");
  ul.id="tracks";

  if(!tracksArray.length){
    let h4 = document.createElement("h4");
    h4.classList.add("no-results");
    h4.textContent = "No Results Found";
    trackResults.appendChild(h4);
  }

  for(let i = 0; i < tracksArray.length; i++){
    let li = document.createElement("li");

    let div = document.createElement("div");
    div.classList.add("track-container");
    div.id = tracksArray[i].stream_url;
    div.addEventListener("click", function(event){
      console.log("Going to play the song: ");
      console.log(this.id);
      turnSelectedOn(this, ul);
      playSong(this);
    })

    let img = document.createElement("img");
    img.classList.add("track-image");
    img.src = tracksArray[i].artwork_url ? tracksArray[i].artwork_url : "missing-track-image.png";
    div.appendChild(img);

    let h4 = document.createElement("h4");
    h4.textContent = tracksArray[i].title;
    div.appendChild(h4);

    let a = document.createElement("a");
    a.href = tracksArray[i].permalink_url;
    a.textContent = "See Track on SoundCloud";
    a.target = "_blank";
    div.appendChild(a);

    let audioPlayer = document.createElement("audio");
    div.appendChild(audioPlayer);

    li.appendChild(div);

    ul.appendChild(li);
  }
  trackResults.appendChild(ul);
  let foot = document.createElement("p");
  foot.textContent = "Scroll up to select a different artist"
  foot.id = "track-foot";
  foot.addEventListener("click",function(event){
    let artistResults = document.querySelector(".artist-results");
    artistResults.scrollIntoView(false);
  })
  trackResults.appendChild(foot);
  trackResults.scrollIntoView(false);
}

function playSong(song_div){
  //Turn off other audio players
  let all_tracks = document.querySelectorAll(".track-container");
  console.log("all_tracks");
  console.log(all_tracks);
  all_tracks.forEach(function(div){
    console.log("audio player");
    console.log(div.childNodes[3]);
    // div.childNodes[3].controls=false;
    div.childNodes[3].pause();
  });

  let clientID = "8538a1744a7fdaa59981232897501e04";

  console.log("Attempting to play a song from:");
  console.log(song_div);
  let song_URL = song_div.id;
  let audioPlayer = song_div.childNodes[3];
  console.log(audioPlayer);
  fetch(song_URL+"?client_id="+clientID).then(
    function(response){
      console.log("Ready to play music...maybe...");
      console.log("Response received:");
      console.log(response);
      console.log("Song url: ");
      console.log(response.url);
      audioPlayer.src = response.url;
      audioPlayer.play();
      // audioPlayer.controls = true;
      console.log("The audio player");
      console.log(audioPlayer);
    },
    function(reject){
      console.log("API request rejected");
    }
  )
}

function turnSelectedOn(div, list){
  for(let i = 0; i < list.childNodes.length; i++){
    let li = list.childNodes[i];
    let artistContainer = li.childNodes[0];
    if(artistContainer.classList[1] === "selected"){
      artistContainer.classList.toggle("selected");
    }
  }
  div.classList.toggle("selected");
}
