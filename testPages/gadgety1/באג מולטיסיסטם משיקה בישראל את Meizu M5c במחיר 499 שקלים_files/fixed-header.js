	 $(function() {
	 	
	if ( $( "#mainMenu" ).length ){
	
		var sticky_header_offset_top = $('#mainMenu').offset().top;
		var sticky_header = function(){
			var scroll_top = $(window).scrollTop();
			
			if (scroll_top > sticky_header_offset_top) { 
				$('#mainMenu').css({ 'position': 'fixed', 'top':0 });
				$('#mainMenu').addClass('scrolled');
			} else {
				$('#mainMenu').css({ 'position': 'relative', 'top':0 }); 
				$('#mainMenu').removeClass('scrolled');
			}   
		};
		
		sticky_header();
		$(window).scroll(function() {
			sticky_header();
		});
		$(window).resize(function() {
			var header = $('#header').css('display');
			if(header=='none'){
				$('#mainMenu').css({ 'position': 'relative', 'top':0 }); 
				$('#mainMenu').removeClass('scrolled');
			}
			sticky_header_offset_top = $('#mainMenu').offset().top;
		});
		
	}
		
	});