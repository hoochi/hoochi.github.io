(function(index,$){
   $(function() {
      initSelect();

      $(".btn-reset").on("click", onReset);
      $("body")
         .on("click", ".btn-go", go)
         .on("click", ".btn-stop", stop)
         .on("click", ".btn-sound", toggleSound);
      $("#vol").on("change", volChanged);
   });

   var _time = null,
      _timer = null,
      _timeValue = null,
      _soundEnabled = true,
      _vol = parseFloat($("#vol").val());

   volChanged = function(e) {
      _vol = parseFloat($(this).val());
   };

   go = function(e) {
      if(_timer !== null) {
        clearTimeout(_timer);
        _timer = null;
      }

      var $source = $(this)
         .closest(".input-group")
         .find("select");

      var time = $source.val() - 1;

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

      if(_time < 0) { _time = _timeValue; }

      setTimerText();
   };

   setTimerText = function() {
      $("#myTime").text((_time !== null) ? _time : "--");
   };

   onReset = function(e) {
      if(_timer === null) { return; }
      _time = _timeValue;
      setTimerText();
   };

   toggleSound = function(e) {
      var $source = $(this);
      var state = !$source.hasClass("active");
      _soundEnabled = state;
   };

   playSound = function(sound) {
      var sound = document.getElementById(sound);
      sound.volume = _vol;
      sound.play();
   };
}(window.index = window.index || {}, jQuery));
