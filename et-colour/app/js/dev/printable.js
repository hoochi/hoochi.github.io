(function(printable,$){
   $(function() {
      et.buildPrintableCharacters($('#colourControls'));
      $('#tag').html(et.buildColour('^I#^7hoochi'));
      $('[data-toggle="tooltip"]').tooltip();
   });
})(window.printable = window.printable || {}, jQuery);
