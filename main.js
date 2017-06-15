/*
  Here is a guide for the steps you could take:
*/

// 1. First select and store the elements you'll be working with


// 2. Create your `onSubmit` event for getting the user's search term


// 3. Create your `fetch` request that is called after a submission


// 4. Create a way to append the fetch results to your page


// 5. Create a way to listen for a click that will play the song in the audio play


let form = document.querySelector(".search-form");
form.addEventListener("submit",function(event){ event.preventDefault(); });

function searchArtist(){
  let query = document.querySelector("#query").value;
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
          let newURL = data[0].uri + "/tracks.json?client_id="+clientID;
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
  console.log("Artist received:",artist);
  console.log("Tracks to add:",tracksArray);
  let resultsContainer = document.querySelector(".results");

  let heading = document.createElement("h4");
  heading.textContent = "Searh Results: " + artist.full_name;
  console.log("heading created:",heading);
  resultsContainer.appendChild(heading);
}

// fetchData("Paul Rudd");
