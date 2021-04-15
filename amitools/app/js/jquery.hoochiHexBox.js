(function($) {
   'use strict';
   
   $.fn.hoochiHexBox = function(options) {
      var settings = options ? $.extend(defaults, options) : defaults;
      if(supportedTypes.indexOf(settings.type) === -1) { settings.type = 'word'; }

      return this.each(function() {
         var $this = $(this);
         $this.attr('maxlength',maxLengths[settings.type]);
         $this.css('text-transform', 'uppercase');

         $this
            .on('keydown', function(event) { onKeyDown(event,settings); })
            .on('keyup', onKeyUp)
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


   var onKeyUp = function(event) {
      var val = $(this).val();

      if(val !== lastValue && event.key.toUpperCase() != 'TAB') {
         $(this).trigger('newValue', [
            val ? parseInt(val,16) : 0,
            val ? val.toUpperCase() : ''
         ]);
      }

      lastValue = val;
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
   var supportedTypes = ['byte', 'word', 'long'];
   var defaults = { type: 'word' };
   
   var maxLengths = {
      'byte': 2,
      'word': 4,
      'long': 8
   };

   var validInput = {
      48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
      96: '0', 97: '1', 98: '2', 99: '3', 100: '4', 101: '5', 102: '6', 103: '7', 104: '8', 105: '9',
      65: 'A', 66: 'B', 67: 'C', 68: 'D', 69: 'E', 70: 'F'
   };

   var controlKeys = {
      8: 'backspace',
      9: 'tab',
      13: 'enter',
      17: 'ctrl',
      18: 'alt',
      27: 'esc',
      16: 'shift',
      35: 'end',
      36: 'home',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      46: 'delete'
   };
})(jQuery);