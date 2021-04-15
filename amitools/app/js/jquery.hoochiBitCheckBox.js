(function($) {
   'use strict';

   $.fn.hoochiBitCheckBox = function(options) {
      if(!options || typeof(options.bit)===typeof(undefined)) {
         throw "hoochiBitCheckBox: you must pass a bit in the options object";
      }

      var bit = options.bit;
      var size = options.size ? options.size : 16;
      var resultMask = 0;
      for(var i = 0; i < size; i++) { resultMask |= 1<<i; }

      this.on('change', function() {
         var checked = $(this).is(':checked');
         var mask = ((checked ? 1<<bit : ~(1<<bit)) & resultMask) >>> 0;
         $(this).trigger('bitStateChange', [checked, mask]);
      });

      return this;
   };
})(jQuery);