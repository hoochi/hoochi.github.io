(function(index,$){
   $(function() {
      initSelect();

      $("#vol").on("change", volChanged);

      $("#_go").on("click", go);
      $("#_stop").on("click", stop);
      $("#_sync").on("click", sync);
      $("#_mute").on("click", mute);
      $("#_countsToZero").on("change", onCountsToZero);
   });

   var
      _time = null,
      _timer = null,
      _timeValue = null,
      _soundEnabled = true,
      _vol = parseFloat($("#vol").val());

   onCountsToZero = function(e) {
      stop();
   }

   volChanged = function(e) {
      _vol = parseFloat($(this).val());
   };

   go = function(e) {
      if(_timer !== null) {
        clearTimeout(_timer);
        _timer = null;
      }

      var countsToZero = $("#_countsToZero").is(":checked");

      var time = countsToZero
         ? $("#timeValue").val() - 1
         : $("#timeValue").val();

      _timeValue = _time = time;

      setTimerText();
      _timer = setInterval(onTimer, 1000);
   };


   initSelect = function() {
      var $time = $("#timeValue");
      for(var i = 10; i < 60; i+=5) {
         var $option = $("<option>")
            .val(i)
            .text(i.toString());

         if(i === 20) { $option.attr("selected", "selected"); }

         $time.append($option);
      }
   };

   stop = function(e) {
      _time = _timeValue = null;

      if(_time === null && _timer !== null) {
         clearTimeout(_timer);
         _timer = null;
      }

      setTimerText();
   };

   onTimer = function() {
      var warning = parseInt($("#warning").val());

      if(_time !== null) {
         _time--;
         if(_soundEnabled && _time === warning) {
            playSound("sound");
         }
      }

      var comparison = $("#_countsToZero").is(":checked") ? 0 : 1;
      if(_time < comparison) {
         _time = _timeValue;
      }

      setTimerText();
   };

   setTimerText = function() {
      var str = "";

      if(_time !== null) {
         str = _time.toString();
         if(str.length < 2) { str = "0" + str; }
      }
      else {
         str = "--";
      }

      $("#myTime").text(str);
   };


   sync = function(e) {
      if(_timer === null) { return; }
      _time = _timeValue;
      setTimerText();
   };


   mute = function(e) {
      var $source = $(this);

      if($source.hasClass("btn-active")) {
         _soundEnabled = false;
         $source.removeClass("btn-active");
         $("#_muteIcon")
            .removeClass("fa-volume-up text-light")
            .addClass("fa-volume-mute text-muted");
      }
      else {
         _soundEnabled = true;
         $source.addClass("btn-active");
         $("#_muteIcon")
            .removeClass("fa-volume-mute text-muted")
            .addClass("fa-volume-up text-light");
      }
   };


   playSound = function(sound) {
      var sound = document.getElementById(sound);
      sound.volume = _vol;
      sound.play();
   };
}(window.index = window.index || {}, jQuery));
