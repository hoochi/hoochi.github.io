(function($) {
   'use strict';
   
   $.fn.hoochiMinMaxNumberBox = function(options) {
      var settings = options ? $.extend(defaults, options) : defaults;
      this.val(settings.min);

      return this.each(function() {
         var $this = $(this);
         $this.attr('maxlength',settings.max.toString().length);

         $this
            .on('keydown', function(event) { onKeyDown(event,settings); })
            .on('keyup', function(event) { onKeyUp($(this), event, settings); })
            .on('paste', onPaste);
      });
   };


   var onKeyDown = function(event,settings) {
      var input = validInput[event.which];
      var control = controlKeys[event.which];

      if(isCutCopyPaste(event)) {
         event.stopPropagation();
         return;
      }

      if(!input && !control) {
         event.preventDefault();
         return;
      }
   };


   var onKeyUp = function($this, event, settings) {
      var val = $this.val();
      val = val ? val : 0;

      if(val < settings.min) { val = settings.min; $this.val(val); }
      if(val > settings.max) { val = settings.max; $this.val(val); }

      if(val !== lastValue && event.key.toUpperCase() != 'TAB') {
         $this.trigger('newValue', [val]);
      }

      lastValue = val.toString();
   };

   var onPaste = function(event) {
      event.stopPropagation();
      event.preventDefault();
      
      var maxLength = parseInt($(this).attr('maxLength'));

      var clipboardData = event.originalEvent.clipboardData || window.clipboardData;
      var data = clipboardData.getData('text').toUpperCase();

      var current = $(this).val();
      var start = this.selectionStart, end = this.selectionEnd;
      var pre = current.substring(0,start);
      var post = current.substring(start);

      if(start === end) {
         pre = current.substring(0,start);
         current.substring(start);
      }
      else {
         pre = current.substring(0,start);
         post = current.substring(end);
      }

      // filter out any unwanted characters.
      var filteredData = '';
      for(var i = 0; i < data.length; i++) {
         var charCode = data.charCodeAt(i);
         if(validInput[charCode]) {
            filteredData += validInput[charCode];
         }
      }

      $(this)
         .val((pre + filteredData + post).substring(0,maxLength));
      this.selectionStart = this.selectionEnd = start + filteredData.length;
   };


   var isCutCopyPaste = function(event) {
      var key = event.key.toUpperCase();
      return event.ctrlKey && (key === 'V' || key === 'X' || key === 'C');
   };

   var lastValue = '';
   var defaults = { min: 0, max: Number.max };

   var validInput = {
      48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
      96: '0', 97: '1', 98: '2', 99: '3', 100: '4', 101: '5', 102: '6', 103: '7', 104: '8', 105: '9'
   };

   var controlKeys = {
      8: 'backspace', 9: 'tab', 13: 'enter', 17: 'ctrl', 18: 'alt', 27: 'esc', 16: 'shift', 35: 'end',
      36: 'home', 37: 'left', 38: 'up', 39: 'right', 40: 'down', 46: 'delete'
   };
})(jQuery);