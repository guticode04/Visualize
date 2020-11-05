window.onload = function() {

   let canvas, ctx, audio, audioAnalyser, 
      audioContext, source, frequencyArr,
      typeOfDisplay;

   // set default display type
   typeOfDisplay = "circleBars";

   // Make sample track clickable
   let sampleTrack = document.getElementsByClassName('sample-track')[0];

   sampleTrack.addEventListener('click', function () {
      // audio = new Audio('./sounds/ImmigrantSong.mp3');
      audio = new Audio();
      audio.crossOrigin = 'anonymous'; //doesnt work for some reason
      audio.src = './sounds/ImmigrantSong.mp3';
      setupTrackAudio();
   });

   // Setup audio
   function setupTrackAudio() {
      audio.addEventListener('canplay', function () {
         // audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
         audioContext = audioContext || new (AudioContext || webkitAudioContext)();
         audioAnalyser = audioAnalyser || audioContext.createAnalyser();
         audioAnalyser.smoothingTimeConstant = 0.1;
         // audioAnalyser.fftSize = 512;//2048 -> 1024
         audioAnalyser.fftSize = 2048;//2048 -> 1024
         startAudio();
      })
   }

   function startAudio() {
      source = audioContext.createMediaElementSource(audio);
      source.connect(audioAnalyser);
      // this connects our music back to the default output,
      // such as your speakers 
      source.connect(audioContext.destination);

      audio.play();
      animationLoop();
   }

   // Controls Logic
   document.getElementsByClassName('play')[0].addEventListener('click', playAudio.bind(null,source));
   document.getElementsByClassName('stop')[0].addEventListener('click', stopAudio);

   function playAudio() {
      if ( audioContext ) {
         if ( audioContext.state === 'suspended' ) {
            audioContext.resume();
         }
      }
   }

   function stopAudio() {
      if ( audioContext ) {
         if ( audioContext.state === 'running') {
            audioContext.suspend();
         }
      }
   }

   // Setup Canvas
   canvas = document.getElementById("renderer");
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   ctx = canvas.getContext('2d');

   // Default Display Btn 
   let circleBarsBtn = document.getElementById('circle-bars');
   circleBarsBtn.addEventListener('click', function () {
      typeOfDisplay = "circleBars";
   });
   
   // Default Display Logic
   let bars = 200;
   let barWidth = 2;

   function drawCircleBars(frequencyArr) {
      // find center of window
      let centerX = canvas.width / 2;
      let centerY = canvas.height / 2;
      let radius = 150;

      //draw circle
      ctx.beginPath();
      ctx.arc(centerX,centerY,radius,0,2*Math.PI);
      ctx.stroke();

      let radians, x, y, xEnd, yEnd, barHeight;
      audioAnalyser.getByteFrequencyData(frequencyArr);
      for (let i = 0; i < bars; i++) {
         // divide circle into equal parts
         radians = (Math.PI * 2) / bars;
         barHeight = frequencyArr[i] * 0.7;

         //set cordinates
         x = centerX + Math.cos(radians * i) * (radius);
         y = centerY + Math.sin(radians * i) * (radius);
         xEnd = centerX + Math.cos(radius * i) * (radius + barHeight);
         yEnd = centerY + Math.sin(radius * i) * (radius + barHeight);
         
         //draw bar
         drawBar(x, y, xEnd, yEnd, barWidth, frequencyArr[i]);
      }
   }

   function drawBar(x1, y1, x2, y2, width, frequency ) {
      let lineColor = "rgb(" + frequency + ", " + frequency + ", " + 205 + ")";

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
   }

   // Second Visuals Options button
   let circlesBtn = document.getElementById('circles');

   circlesBtn.addEventListener('click', function () {
      typeOfDisplay = "circles";
   })

   let hue = 240;

   // Second Visuals Logic
   function drawCircles(frequencyVal) {
      let x = canvas.width / 2;
      let y = canvas.height / 2;
      ctx.beginPath();
      ctx.arc(x - (frequencyVal / 8), y - (frequencyVal / 8), (Math.abs(frequencyVal - 120)) * 5, 0, 2 * Math.PI, false);
      ctx.strokeStyle = 'hsla(' + hue + ',' + 100 + '%,' + 50 + '%,' + 0.6 + ')';
      ctx.fillStyle = 'hsla(' + hue + ', 100%, 50%, .01)';

      ctx.fill();
      ctx.lineWidth = 4;
      ctx.stroke();
   }

   function animationLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frequencyArr = new Uint8Array(audioAnalyser.frequencyBinCount);
      if ( typeOfDisplay === "circleBars") {
         drawCircleBars(frequencyArr);
      } else if ( typeOfDisplay === "circles" ) {
         audioAnalyser.getByteFrequencyData(frequencyArr);
         let length = frequencyArr.length;
         for( let i = 0; i < length; i++ ) {
            drawCircles(frequencyArr[i]);
         }
      }
      requestAnimationFrame(animationLoop);
   }
}