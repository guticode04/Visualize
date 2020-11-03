window.onload = function() {
   let canvas, ctx, audio, audioAnalyser, 
      audioContext, source, frequencyArr;

   canvas = document.getElementById("renderer");
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   ctx = canvas.getContext("2d");

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
         audioAnalyser.fftSize = 512;
         startAudio();
      })
   }

   function startAudio() {
      source = audioContext.createMediaElementSource(audio);
      source.connect(audioAnalyser);
      source.connect(audioContext.destination);

      audio.play();
   }

}