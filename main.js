
// 5. Create a way to listen for a click that will play the song in the audio play


let form = document.querySelector(".search-form");
form.addEventListener("submit",function(event){ event.preventDefault(); });

function searchArtist(){
  let inputField = document.querySelector("#query");
  console.log("inputField",inputField);
  let query = inputField.value;
  console.log("You want to search for: ",query);
  fetchData(query)
}

function fetchData(query){
  let clientID = "8538a1744a7fdaa59981232897501e04";
  let url = "https://api.soundcloud.com/users.json?client_id="+clientID+"&q="+query+"&limit=5";

  fetch(url).then(
      function(response){
        if(response.status !== 200){
          console.log("Status error: ",response.status);
          return;
        }
        response.json().then(function(data){
          console.log("First artist is: ",data[0]);
          let newURL = data[0].uri + "/tracks.json?client_id="+clientID+"&limit=30";
          fetch(newURL).then(
            function(tracksResponse){
              if(tracksResponse.status !== 200){
                return;
              }
              tracksResponse.json().then(function(tracks){
                console.log("Track listings",tracks);
                addTracks(data[0], tracks);
              })
            },
            function(tracksReject){
              console.log("API request rejected");
            }
          )
        })
      },
      function(reject){
        console.log("API request rejected");
        return;
      }
  );
}

function addTracks(artist, tracksArray){
  let inputField = document.querySelector("#query");
  let query = inputField.value;
  inputField.value="";

  console.log("Artist received:",artist);
  console.log("Tracks to add:",tracksArray);
  let resultsContainer = document.querySelector(".results");

  //Removes all previous search results display
  while( resultsContainer.hasChildNodes() ){
    resultsContainer.removeChild(resultsContainer.lastChild);
  }

  let heading = document.createElement("h4");
  heading.textContent = "Search Results: " + query + " (" + tracksArray.length + " results displayed)";
  resultsContainer.appendChild(heading);

  let ul = document.createElement("ul");

  //Add Track listings
  for(let i = 0; i < tracksArray.length; i++){
    let li = document.createElement("li");

    let div = document.createElement("div");
    div.id = tracksArray[i].title;
    div.addEventListener("click", function(){
      playSong(event.target.id);
    });


    let img = document.createElement("img");
    img.src = tracksArray[i].artwork_url;
    div.appendChild(img);

    let h4 = document.createElement("h4");
    h4.textContent = tracksArray[i].title;
    div.appendChild(h4);

    let h5 = document.createElement("h5");
    h5.textContent = artist.full_name;
    div.appendChild(h5);

    li.appendChild(div);
    resultsContainer.appendChild(li);
  }

  resultsContainer.appendChild(ul);
}

function playSong(title){
  let clientID = "8538a1744a7fdaa59981232897501e04";

  console.log("Attempting to play a song...");
  let audioPlayer = document.querySelector("audio");
  console.log(audioPlayer);
  fetch("https://api.soundcloud.com/tracks/296167727/stream?client_id="+clientID).then(
    function(response){
      console.log("Ready to play music...maybe...");
      console.log("Response received:");
      console.log(response);
      audioPlayer.src = response.url;
      audioPlayer.play();
      console.log("Processing Data...");
      // response.blob().then(function(song){
      //   console.log("Data processed:");
      //   console.log(song);
      //   audioPlayer.src = song;
      // })
    },
    function(reject){
      console.log("API request rejected");
    }
  )
}
