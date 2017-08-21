(function(index,$){
   var _text =[
      '^0Mortar^1.^0Be^1.^0Ghey',
      '^6Very^DStyle^N*^6Much^DFashion',
      '^1<3 ^7[^1!!!^7]',
      '^BTug^FLife',
      '^I#^7hoochi^Iloves^7you'
   ];

   $(function() {
      et.buildColourInput($('#colourControls'));
      $('body').on('click', '.btn-clear-addon', onClearAddonText);
      $('#name')
         .on('input', onNameChange)
         .change(onNameChange)
         .focus();
      $('#demo').on('click', onDemoClick);
      $('#tag').html(et.buildColour('^I#^7hoochi'));
      $('[data-toggle="tooltip"]').tooltip();
   });


   onClearAddonText = function(e) {
      $(this)
         .closest('.input-group')
         .find('[type="text"]')
         .val('')
         .change()
         .focus();
   };

   onNameChange = function(e) {
      var text = $(this).val();
      var html = et.buildColour(text);

      $('#light').html(html);
      $('#dark').html(html.clone());
   };

   var _demoIndex = 0;
   onDemoClick = function(e) {
      $('#name').val(_text[_demoIndex++]).change();
      if(_demoIndex >= _text.length) _demoIndex = 0;
   };

})(window.index = window.index || {}, jQuery);
