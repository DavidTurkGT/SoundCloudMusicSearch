
// 5. Create a way to listen for a click that will play the song in the audio play


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

  for(let i = 0; i < artistArray.length; i++){
    let li = document.createElement("li");

    let div = document.createElement("div");
    div.classList.add("artist-container");
    div.id = artistArray[i].uri;

    div.addEventListener("click", function(event){
      console.log("Going to fetch tracks for: ");
      console.log(this.id);
      fetchTracks(this.id);
    })

    let img = document.createElement("img");
    img.classList.add("artist-image");
    img.src = artistArray[i].avatar_url;
    div.appendChild(img);

    let h4 = document.createElement("h4");
    h4.textContent = artistArray[i].full_name;
    div.appendChild(h4);

    let a = document.createElement("a");
    a.href = artistArray[i].permalink_url;
    a.textContent = "SoundCloud Page";
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

  for(let i = 0; i < tracksArray.length; i++){
    let li = document.createElement("li");

    let div = document.createElement("div");
    div.classList.add("track-container");
    div.id = tracksArray[i].stream_url;
    div.addEventListener("click", function(event){
      console.log("Going to play the song: ");
      console.log(this.id);
      playSong(this.id);
    })

    let img = document.createElement("img");
    img.classList.add("track-image");
    img.src = tracksArray[i].artwork_url;
    div.appendChild(img);

    let h4 = document.createElement("h4");
    h4.textContent = tracksArray[i].title;
    div.appendChild(h4);

    let a = document.createElement("a");
    a.href = tracksArray[i].permalink_url;
    a.textContent = "See Track on SoundCloud";
    div.appendChild(a);

    li.appendChild(div);

    ul.appendChild(li);
  }
  trackResults.appendChild(ul);
}

function playSong(song_URL){
  let clientID = "8538a1744a7fdaa59981232897501e04";

  console.log("Attempting to play a song from:");
  console.log(song_URL);
  let audioPlayer = document.querySelector("audio");
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
    },
    function(reject){
      console.log("API request rejected");
    }
  )
}
