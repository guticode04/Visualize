window.onload = function() {
   let canvas, ctx, audio, audioAnalyser, 
      audioContext, source, frequencyArr,
      typeOfDisplay;

   // canvas = document.getElementById("renderer");
   // canvas.width = window.innerWidth;
   // canvas.height = window.innerHeight;
   // ctx = canvas.getContext("2d");

   // audio = new Audio();
   // audioContext = new (window.AudioContext || window.webkitAudioContext)();
   // audioAnalyser = audioContext.createAnalyser();

   let sampleTrack = document.getElementsByClassName("sample-track");

   sampleTrack.addEventListener('click', function () {
      audio = new Audio('');
      setupTrackAudio();
   });

   function setupTrackAudio() {
      audio.addEventListener('canplay', function () {
         audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
         audioAnalyser = audioAnalyser || audioContext.createAnalyser();
         audioAnalyser.smoothingTimeConstant = 0.1;
         audioAnalyser.fftSize = 512;//2048 -> 1024
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

   document.getElementsByClassName('play').addEventListener('click', playAudio.bind(null,source));
   document.getElementsByClassName('stop').addEventListener('click', stopAudio);

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

   canvas = document.getElementById("renderer");
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   ctx = canvas.getContext("2d");

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

   function animationLoop() {
      
   }
}