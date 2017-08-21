(function(index, $){
   $(function() {
      $lbs = $('#lbs');
      $kg = $('#kg');
      $stone = $('#stone');
      $pounds = $('#pounds');

      var c = Cookies.getJSON('weights');
      if(typeof(c) === typeof undefined) { c = DEFAULT_COOKIE; }

      $lbs.val(c.l);
      $kg.val(c.k);
      $stone.val(c.s);
      $pounds.val(c.p);

      $('#convertlbs').on('click', onConvertLbs)
      $('#converkg').on('click', onConvertKg)
      $('#convertsap').on('click', onConvertSap)
   });

   var $lbs = null, $kg = null, $stone = null, $pounds = null;
   var DEFAULT_COOKIE = { l: 0, k: 0, s: 0, p: 0 }; // lbs, kg, stone, pounds

   onConvertLbs = function(e) {
      var input = $lbs.val();
      if(input.length === 0) {
         sweetAlert("Oops!", "You've done it wrong!\r\n\r\nYou must enter a value.", "error");
         return;
      }

      var lbs = parseFloat(input);
      if(isNaN(lbs)) {
         sweetAlert("Oops!", "You've done it wrong! The entered value must be a number\r\n\r\nE.G. 100 or 13.37.", "error");
         return;
      }

      $kg.val((0.453592 * lbs).toFixed(2));

      var s = Math.floor(lbs / 14);
      $stone.val(s);
      $pounds.val(lbs - (s*14));
      saveCookie();
   };

   onConvertKg = function(e) {
      var input = $kg.val();
      if(input.length === 0) {
         sweetAlert("Oops!", "You've done it wrong!\r\n\r\nYou must enter a value.", "error");
         return;
      }

      var kg = parseFloat(input);
      if(isNaN(kg)) {
         sweetAlert("Oops!", "You've done it wrong! The entered value must be a number\r\n\r\nE.G. 100 or 13.37.", "error");
         return;
      }

      var l = 2.20462 * kg;
      $lbs.val(l.toFixed(0));

      var s = Math.floor(l / 14);
      $stone.val(s);
      $pounds.val((l - (s*14)).toFixed(0));
      saveCookie();
   };


   onConvertSap = function(e) {
      var s = parseFloat($stone.val()), p = parseFloat($pounds.val());
      if(isNaN(s) || isNaN(p)) {
         sweetAlert("Oops!", "You've done it wrong!\r\n\r\nYou must enter a value and it must be a number.\r\n\r\nE.G. 100 or 13.37.", "error");
         return;
      }

      var l = s*14+p;
      $lbs.val(l);
      $kg.val((l * 0.453592).toFixed(2));
      saveCookie();
   };


   saveCookie = function() {
      Cookies.set('weights', { l: $lbs.val(), k: $kg.val(), s: $stone.val(), p: $pounds.val() });
   };

})(window.index = window.index || {}, jQuery);
