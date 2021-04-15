(function(index,$) {
   $(function() {
      $('#bltsize')
         .hoochiHexBox({ type: 'word' })
         .on('newValue', onNewBltsize);

      $('#_bplcon0')
         .hoochiHexBox({ type: 'word' })
         .on('newValue', onNewBplcon0);


      $('#width')
         .on('change', function(e) {
            var w = getNumber($(this));
            if(w === 0) { w = 1024; }
            if(isNaN(w) || w%16 !== 0) {
               errorDialog("Invalid number entered."); 
               return;
            }
            w &= 0x3f;

            var word = ((getCurrentBltsize() & ~0x3f) | (w/16)) & 0xffff;
            setBltsize(word.toString(16));
         });


      $('#height')
         .on('change', function(e) {
            var h = getNumber($(this));
            if(h === 0) { h = 1024; }
            if(isNaN(h)) {
               errorDialog("Invalid number entered.");
               return;
            }

            var word = ((getCurrentBltsize() & ~0xffc0) | (h<<6)) & 0xffff;
            setBltsize(word.toString(16));
         });

      $('#_ash').hoochiMinMaxNumberBox({
         min: 0,
         max: 0xf
      }).on('newValue', onAshChange);

      $('#_bltcon0')
         .hoochiHexBox({ type: 'word'})
         .on('newValue', onNewBltcon0);

      $('input[data-source]').on('change', onDataSourceChange);

      $('#_logic')
         .hoochiHexBox({ type: 'byte'})
         .on('newValue', onNewLogicFunction);

      $('#_bpu').on('change', onBpuChange);

      $('[data-toggle="tooltip"]').tooltip();

      $('#_hires').hoochiBitCheckBox({ bit: 15, size: 16 }).on('bitStateChange', onBplcon0BitChange);
      $('#_ham').hoochiBitCheckBox({ bit: 11, size: 16 }).on('bitStateChange', onBplcon0BitChange);
      $('#_dpf').hoochiBitCheckBox({ bit: 10, size: 16 }).on('bitStateChange', onBplcon0BitChange);
      $('#_color').hoochiBitCheckBox({ bit: 9, size: 16 }).on('bitStateChange', onBplcon0BitChange);
      $('#_gaud').hoochiBitCheckBox({ bit: 8, size: 16 }).on('bitStateChange', onBplcon0BitChange);
      $('#_uhres').hoochiBitCheckBox({ bit: 7, size: 16 }).on('bitStateChange', onBplcon0BitChange);
      $('#_shres').hoochiBitCheckBox({ bit: 6, size: 16 }).on('bitStateChange', onBplcon0BitChange);
      $('#_bypass').hoochiBitCheckBox({ bit: 5, size: 16 }).on('bitStateChange', onBplcon0BitChange);
      $('#_bpu3').hoochiBitCheckBox({ bit: 4, size: 16 }).on('bitStateChange', onBplcon0BitChange);
      $('#_lpen').hoochiBitCheckBox({ bit: 3, size: 16 }).on('bitStateChange', onBplcon0BitChange);
      $('#_lace').hoochiBitCheckBox({ bit: 2, size: 16 }).on('bitStateChange', onBplcon0BitChange);
      $('#_ersy').hoochiBitCheckBox({ bit: 1, size: 16 }).on('bitStateChange', onBplcon0BitChange);
      $('#_ecsena').hoochiBitCheckBox({ bit: 0, size: 16 }).on('bitStateChange', onBplcon0BitChange);


      $('#_dmacon')
         .hoochiHexBox({ type: 'word'})
         .on('newValue', onNewDmacon);

      $('#_dmaconSETCLR').hoochiBitCheckBox({ bit: 15, size: 16 }).on('bitStateChange', onDmaconBitChange);
      $('#_dmaconBLTPRI').hoochiBitCheckBox({ bit: 10, size: 16 }).on('bitStateChange', onDmaconBitChange);
      $('#_dmaconDMAEN').hoochiBitCheckBox({ bit: 9, size: 16 }).on('bitStateChange', onDmaconBitChange);
      $('#_dmaconBPLEN').hoochiBitCheckBox({ bit: 8, size: 16 }).on('bitStateChange', onDmaconBitChange);
      $('#_dmaconCOPEN').hoochiBitCheckBox({ bit: 7, size: 16 }).on('bitStateChange', onDmaconBitChange);
      $('#_dmaconBLTEN').hoochiBitCheckBox({ bit: 6, size: 16 }).on('bitStateChange', onDmaconBitChange);
      $('#_dmaconSPREN').hoochiBitCheckBox({ bit: 5, size: 16 }).on('bitStateChange', onDmaconBitChange);
      $('#_dmaconDSKEN').hoochiBitCheckBox({ bit: 4, size: 16 }).on('bitStateChange', onDmaconBitChange);
      $('#_dmaconAUD3').hoochiBitCheckBox({ bit: 3, size: 16 }).on('bitStateChange', onDmaconBitChange);
      $('#_dmaconAUD2').hoochiBitCheckBox({ bit: 2, size: 16 }).on('bitStateChange', onDmaconBitChange);
      $('#_dmaconAUD1').hoochiBitCheckBox({ bit: 1, size: 16 }).on('bitStateChange', onDmaconBitChange);
      $('#_dmaconAUD0').hoochiBitCheckBox({ bit: 0, size: 16 }).on('bitStateChange', onDmaconBitChange);
   });

   onBplcon0BitChange = function(event, checked, bitMask) {
      var c = getCurrentBplcon0();
      $('#_bplcon0').val((checked ? c | bitMask : c & bitMask).toString(16));
   };

   onNewBltsize = function(event, newValue, newValueString) {
      var val = newValue;
      if(val === '') {
         clearWidthAndHeight();
         return;
      }

      var h = (val & 0xffc0) >> 6;
      var w = (val & 0x3f) * 2 * 8;

      if(h === 0) { h = 1024; }
      if(w === 0) { w = 1024; }

      $('#width').val(w);
      $('#height').val(h);
      $('#total').val((w/8)*h);
   };

   setTotalBytes = function() {
      var c = getCurrentBltsize();
      var h = (c&0xffc0)>>6;
      var w = (c&0x3f);

      if(h === 0) { h = 1024; }
      if(w === 0) { w = 1024/8/2; }

      $('#total').val(h*w*2);
   };

   setBltsize = function(word) {
      $('#bltsize').val(word);
      setTotalBytes();
   };

   getCurrentBltsize = function() {
      var x = parseInt($('#bltsize').val(),16);
      return isNaN(x) ? 0 : x;
   };

   errorDialog = function(message) {
      $.alert({
         'title': 'Error',
         'content': message,
         'type': 'dark',
         'animation': 'zoom',
         escapeKey: true,
         backgroundDismiss: true
      });
   };

   getNumber = function($input) {
      return parseInt($input.val(), 10);
   };

   clearWidthAndHeight = function() {
      $('#width').val('');
      $('#height').val('');
   };

   onAshChange = function(event, value) {
      var x = (parseInt($('#_bltcon0').val(),16) & 0xfff) + (value<<12);
      $('#_bltcon0').val(x.toString(16));
   };

   onNewBltcon0 = function(event, value) {
      $('#_logic').val((value & 0xff).toString(16));
      $('#_ash').val((value & 0xf000) >> 12);

      $('#_srca').prop('checked', value & 0x800 ? true : false);
      $('#_srcb').prop('checked', value & 0x400 ? true : false);
      $('#_srcc').prop('checked', value & 0x200 ? true : false);
      $('#_srcd').prop('checked', value & 0x100 ? true : false);
   };

   onDataSourceChange = function(event) {
      var source = parseInt($(this).attr('data-source'),16);
      var cur = getCurrentBltcon0();
      var val = $(this).is(':checked') ? (cur|source) : (cur&~source);
      $('#_bltcon0').val(val.toString(16));
   };

   onNewLogicFunction = function(event, value) {
      var cur = getCurrentBltcon0();
      cur &= 0xff00;
      cur |= value;
      $('#_bltcon0').val(cur.toString(16));
   };

   getCurrentBltcon0 = function() {
      var c = $('#_bltcon0').val();
      return parseInt(c ? c : 0, 16);
   };


   onNewBplcon0 = function(event, value) {
      $('#_hires').prop('checked', value & 0x8000);
      $('#_ham').prop('checked', value & 0x800);
      $('#_dpf').prop('checked', value & 0x400);
      $('#_color').prop('checked', value & 0x200);
      $('#_gaud').prop('checked', value & 0x100);
      $('#_uhres').prop('checked', value & 0x80);
      $('#_shres').prop('checked', value & 0x40);
      $('#_bypass').prop('checked', value & 0x20);
      $('#_bpu3').prop('checked', value & 0x10);
      $('#_lpen').prop('checked', value & 0x8);
      $('#_lace').prop('checked', value & 0x4);
      $('#_ersy').prop('checked', value & 0x2);
      $('#_ecsena').prop('checked', value & 0x1);

      var bpl = (value & 0x7000) >> 12;
      if(bpl > 6) { bpl = 6; }
      $('#_bpu').val(bpl);

   };

   getCurrentBplcon0 = function() {
      var c = $('#_bplcon0').val();
      return parseInt(c ? c : 0, 16);
   };

   onBpuChange = function(event) {
      var c = getCurrentBplcon0() & 0x8fff;
      var d = parseInt($(this).val()) << 12;
      $('#_bplcon0').val((c|d).toString(16));
   };


   onNewDmacon = function(event, value) {
      $('#_dmaconSETCLR').prop('checked', value & 0x8000);
      $('#_dmaconBLTPRI').prop('checked', value & 0x0400);
      $('#_dmaconDMAEN').prop('checked', value & 0x0200);
      $('#_dmaconBPLEN').prop('checked', value & 0x0100);
      $('#_dmaconCOPEN').prop('checked', value & 0x0080);
      $('#_dmaconBLTEN').prop('checked', value & 0x0040);
      $('#_dmaconSPREN').prop('checked', value & 0x0020);
      $('#_dmaconDSKEN').prop('checked', value & 0x0010);
      $('#_dmaconAUD3').prop('checked', value & 0x0008);
      $('#_dmaconAUD2').prop('checked', value & 0x0004);
      $('#_dmaconAUD1').prop('checked', value & 0x0002);
      $('#_dmaconAUD0').prop('checked', value & 0x0001);
   };

   onDmaconBitChange = function(event, checked, bitMask) {
      var c = getCurrentDmacon();
      $('#_dmacon').val((checked ? c | bitMask : c & bitMask).toString(16));
   }

   getCurrentDmacon = function() {
      var c = $('#_dmacon').val();
      return parseInt(c ? c : 0, 16);
   }

})(window.index = window.index || {}, jQuery);
