	 $(function() {
	 	
	 	var headerMenuPosition = $('#mainMenu').css('position');
	 	var isChrome = !!window.chrome;
	 	var sidebar_div_offset_top = $('#floatSidebar').offset().top;
	 	
	 	/* browser validation:
	 	 * chrome has floating divs malfunction
	 	 * (62px of the floating black-gray header)
	 	 */
	 	var extra = 0;
	 	if(isChrome && headerMenuPosition!="fixed"){
			var extra = 0;
	 	}
		
		var sticky_sidebar_div = function(){
		
			var scroll_top = $(window).scrollTop();
			var docHeight = $(document).height();
			var divHeight = $('#floatSidebar').height();
			var footerHeight = $('#footer').height();
			var customization = 40;
			var ovflw = docHeight - divHeight - footerHeight - customization;
			
			var D = docHeight - divHeight - footerHeight;
			
			if(D > sidebar_div_offset_top+100){
				
				if (scroll_top+extra > sidebar_div_offset_top-96) {
					
					if(scroll_top > ovflw-96){
						// don't cross the limits (aka - footer)
						$('#floatSidebar').css({ 'position': 'absolute', 'top':ovflw });
					} else {
						// scrooooooooling
						$('#floatSidebar').css({ 'position': 'fixed', 'top':'96px' });
					}
					
				} else {
					
					$('#floatSidebar').css({ 'position': 'relative', 'top':0 }); 
					
				}
				
			}
			
		};
		
		sticky_sidebar_div();
		$(window).scroll(function() {
			sticky_sidebar_div();
		});
		$(window).resize(function() {
			headerMenuPosition = $('#mainMenu').css('position');
			sidebar_div_offset_top = $('#floatSidebar').offset().top;
			sticky_sidebar_div();
		});
		
	});