(function(printable,$){
   $(function() {
      et.buildPrintableCharacters($("#colourControls"));
      $("#tag").html(et.buildColour("^I#^7hoochi^Iloves^7you"));
      $("[data-toggle=\"tooltip\"]").tooltip();
   });
})(window.printable = window.printable || {}, jQuery);
