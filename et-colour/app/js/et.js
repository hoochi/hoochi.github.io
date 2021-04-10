(function(et,$){
   var _colours = [
      tinycolor.fromRatio({ r: 0.0, g: 0.0, b: 0.0 }),      // '0'
      tinycolor.fromRatio({ r: 1.0, g: 0.0, b: 0.0 }),      // '1'
      tinycolor.fromRatio({ r: 0.0, g: 1.0, b: 0.0 }),      // '2'
      tinycolor.fromRatio({ r: 1.0, g: 1.0, b: 0.0 }),      // '3'
      tinycolor.fromRatio({ r: 0.0, g: 0.0, b: 1.0 }),      // '4'
      tinycolor.fromRatio({ r: 0.0, g: 1.0, b: 1.0 }),      // '5'
      tinycolor.fromRatio({ r: 1.0, g: 0.0, b: 1.0 }),      // '6'
      tinycolor.fromRatio({ r: 1.0, g: 1.0, b: 1.0 }),      // '7'
      tinycolor.fromRatio({ r: 1.0, g: 0.5, b: 0.0 }),      // '8'
      tinycolor.fromRatio({ r: 0.5, g: 0.5, b: 0.5 }),      // '9'
      tinycolor.fromRatio({ r: 0.75, g: 0.75, b: 0.75 }),   // ':'
      tinycolor.fromRatio({ r: 0.75, g: 0.75, b: 0.75 }),   // ';'
      tinycolor.fromRatio({ r: 0.0, g: 0.5, b: 0.0 }),      // '<'
      tinycolor.fromRatio({ r: 0.5, g: 0.5, b: 0.0 }),      // '='
      tinycolor.fromRatio({ r: 0.0, g: 0.0, b: 0.5 }),      // '>'
      tinycolor.fromRatio({ r: 0.5, g: 0.0, b: 0.0 }),      // '?'
      tinycolor.fromRatio({ r: 0.5, g: 0.25, b: 0.0 }),     // '@'
      tinycolor.fromRatio({ r: 1.0, g: 0.6, b: 0.1 }),      // 'A'
      tinycolor.fromRatio({ r: 0.0, g: 0.5, b: 0.5 }),      // 'B'
      tinycolor.fromRatio({ r: 0.5, g: 0.0, b: 0.5 }),      // 'C'
      tinycolor.fromRatio({ r: 0.0, g: 0.5, b: 1.0 }),      // 'D'
      tinycolor.fromRatio({ r: 0.5, g: 0.0, b: 1.0 }),      // 'E'
      tinycolor.fromRatio({ r: 0.2, g: 0.6, b: 0.8 }),      // 'F'
      tinycolor.fromRatio({ r: 0.8, g: 1.0, b: 0.8 }),      // 'G'
      tinycolor.fromRatio({ r: 0.0, g: 0.4, b: 0.2 }),      // 'H'
      tinycolor.fromRatio({ r: 1.0, g: 0.0, b: 0.2 }),      // 'I'
      tinycolor.fromRatio({ r: 0.7, g: 0.1, b: 0.1 }),      // 'J'
      tinycolor.fromRatio({ r: 0.6, g: 0.2, b: 0.0 }),      // 'K'
      tinycolor.fromRatio({ r: 0.8, g: 0.6, b: 0.2 }),      // 'L'
      tinycolor.fromRatio({ r: 0.6, g: 0.6, b: 0.2 }),      // 'M'
      tinycolor.fromRatio({ r: 1.0, g: 1.0, b: 0.75 }),     // 'N'
      tinycolor.fromRatio({ r: 1.0, g: 1.0, b: 0.5 })       // 'O'
   ];

   et.buildColourInput = function($target) {
      $.each(_colours, function(i) {
         var char = charFromIndex(i);
         var $col = $("<div>").addClass("col-xs-6 col-sm-2 col-md-1");
         var colour = colourFromChar(char);

         var $btn = $("<button>")
            .addClass("btn btn-sm btn-colour")
            .text("^" + char)
            .css({
               "background-color": colour.toHexString(),
               "color": colour.isDark() ? "#fff" : "#000"
            });

         $col.append($btn);
         $target.append($col);
      });

      $target.on("click", ".btn-colour", onColourClick);
   };


   et.buildPrintableCharacters = function($target) {
      var start = 0x20, end = 0x7e;

      while(start <= end) {
         var $col = $("<div>").addClass("col-xs-6 col-sm-2 col-md-1");
         var colour = _colours[(start+48) & 31];

         var $btn = $("<button>")
            .addClass("btn btn-sm btn-colour")
            .text(" '" + String.fromCharCode(start) + "'")
            .css({
               "background-color": colour.toHexString(),
               "color": colour.isDark() ? "#fff" : "#000",
            })
            .attr("readonly", "readonly");

         $col.append($btn);
         $target.append($col);

         start++;
      }

   };

   colourFromChar = function(char) {
      return _colours[(char.charCodeAt(0) - "0".charCodeAt(0)) & 31];
   };

   charFromIndex = function(index) {
     return String.fromCharCode(("0".charCodeAt(0) + index));
   };

   onColourClick = function(e) {
      var $name = $("#name"),
         start = $name[0].selectionStart,
         val = $name.val();

      $name
         .val(val.substring(0,start) + $(this).text() + val.substring(start))
         .focus();

      $name[0].selectionStart = start + 2;
      $name[0].selectionEnd = start + 2;

      $name.change();
   };


   et.buildColour = function(text) {
      var i = 0;
      var $container = $("<span>").css("color", _colours[10].toHexString());
      var $current = $("<span>");

      while(i < text.length) {
         if(isColourString(text,i)) {
            if($current.text().length) {
               $container.append($current);
            }

            $current = $("<span>")
               .css("color", colourFromChar(text[i+1]).toHexString());
            i++;
         }
         else {
            $current.text($current.text() + text[i]);
         }

         i++;
      }
      if($current.text().length){
         $container.append($current);
      }

      return $container;
   };

   isColourString = function (text, index) {
      if(index >= text.length) { return false; }
      if(text[index] !== "^") { return false; }
      if(index + 1 >= text.length) { return false; }
      return text[index+1] !== "^";
   };

})(window.et = window.et || {}, jQuery);
