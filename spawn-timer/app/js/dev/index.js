(function(index,$){
   $(function() {
      initSelect();
      $(".btn-reset").on("click", onReset);
      $("body")
         .on("click", ".btn-go", go)
         .on("click", ".btn-stop", stop)
         .on("click", ".btn-sound", toggleSound);
   });

   var _myTime = null,
      _enemyTime = null,
      _timer = null,
      _myTimeValue = null,
      _enemyTimeValue = null,
      _meSoundEnabled = true,
      _enemySoundEnabled = true;

   go = function(e) {
      if(_timer !== null) {
        clearTimeout(_timer);
        _timer = null;
      }

      var $source = $(this)
         .closest(".input-group")
         .find("select");

      var time = $source.val();

      if($source.attr("data-type") === "me") {
         _myTimeValue = _myTime = time;
      }
      else {
         _enemyTimeValue = _enemyTime = time;
      }

      setTimerText();
      _timer = setInterval(onTimer, 1000);
   };


   initSelect = function() {
      var $myTime = $("#myTimeValue");
      var $enemyTime = $("#enemyTimeValue");
      for(var i = 10; i <= 40; i++) {
         var $option = $("<option>")
            .val(i)
            .text(i.toString());

         if(i === 25) { $option.attr("selected", "selected"); }

         $myTime.append($option);
         $enemyTime.append($option.clone());
      }
   };

   stop = function(e) {
      if($(this).attr("data-type") === "me") {
         _myTime = _myTimeValue = null;
      }
      else {
         _enemyTime = _enemyTimeValue = null;
      }

      if(_myTime == null && _enemyTime == null && _timer !== null) {
         clearTimeout(_timer);
         _timer = null;
      }

      setTimerText();
   };

   onTimer = function() {
      var meWarning = parseInt($("#meWarning").val());
      var enemyWarning = parseInt($("#enemyWarning").val());

      if(_myTime !== null) {
         _myTime--;
         if(_meSoundEnabled && _myTime === meWarning) {
            playMeSound();
         }
      }

      if(_enemyTime !== null) {
         _enemyTime--;
         if(_enemySoundEnabled && _enemyTime === enemyWarning) {
            playEnemySound();
         }
      }

      if(_myTime < 1) _myTime = _myTimeValue;
      if(_enemyTime < 1) _enemyTime = _enemyTimeValue;

      setTimerText();
   };

   setTimerText = function() {
      $('#myTime').text((_myTime !== null) ? _myTime : "--");
      $('#enemyTime').text((_enemyTime !== null) ? _enemyTime : "--");
   };

   onReset = function(e) {
      if(_timer === null) { return; }

      if($(this).attr("data-type") === "me") {
         _myTime = _myTimeValue;
      }
      else {
         _enemyTime = _enemyTimeValue;
      }

      setTimerText();
   };

   toggleSound = function(e) {
      var $source = $(this);
      var state = !$source.hasClass("active");

      if($source.attr('data-type') === "me") {
         _meSoundEnabled = state;
      }
      else {
         _enemySoundEnabled = state;
      }
   };

   playMeSound = function() {
      document.getElementById("meSound").play();
   };

   playEnemySound = function() {
      document.getElementById("enemySound").play();
   };
}(window.index = window.index || {}, jQuery));
