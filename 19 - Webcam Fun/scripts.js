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
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with them
    // pixels = redEffect(pixels); // UNCOMMENT THIS FOR RED
    // pixels = rgbSplit(pixels);  // UNCOMMENT THIS FOR RGBSPLIT
    //put them back
    pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
    
  }, 16)
}

function takePhoto(){
  //played the sound
  snap.currentTime = 0; // sets time to 0 so we can do it again and again
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src=${data} alt="handsome guy">`
  strip.insertBefore(link, strip.firstChild);
  console.log(data);
}

function redEffect(pixels){
  for(let i = 0; i < pixels.data.length; i+=4){
    pixels.data[i]  = pixels.data[i] + 100;
    pixels.data[i + 1] = pixels.data[i + 1] - 50; 
    pixels.data[i + 2] = pixels.data[i + 2] * .5;
    // pixels[i + 3]//alpha
  }
  return pixels
}


function rgbSplit(pixels){
  for(let i = 0; i < pixels.data.length; i+=4){
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    // pixels[i + 3]//alpha
  }
  return pixels
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}


getVideo();
//once the video is playing listen for an event that emits
// 'canplay', then run the paintToCanvas
video.addEventListener('canplay', paintToCanvas); 