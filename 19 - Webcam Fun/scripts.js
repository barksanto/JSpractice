const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// get video being piped into our video element
function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      video.srcObject = localMediaStream; //this is an object right now, we need to convert it to a url
      video.play();
    })
    .catch(err => {
      console.log("OH NOO", err);
    })
}

function paintToCanvas (){
  // get width and height of our video
  const width = video.videoWidth;
  const height = video.videoHeight;
  
  //check width and height of our canvas
  //make canvas same size as video
  canvas.width = width;
  canvas.height = height;
  
  //every 16ms - take image from webcam and put it into canvas
  setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height); // paint over top left corner @0,0 to the width variabeles we have
  }, 16)
}

getVideo();