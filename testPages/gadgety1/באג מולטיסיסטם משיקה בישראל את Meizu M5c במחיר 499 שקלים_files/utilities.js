	// vertical ad message
	setTimeout(function(){
		$('.message').css("visibility", "visible");
		$('.message').css("opacity", "1");
	}, 4000);
	
	// mobile menu & slidebars
	(function($) {
		if ( $( "#mainMenu" ).length ){
		$(document).ready(function() {
			var mySlidebars = new $.slidebars({
				scrollLock: true
			});
			var sbtt = $('.scroll-back-to-top-wrapper');
			$('.open-mobile-menu').on('click', function() {
				mySlidebars.slidebars.toggle('right');
				sbtt.toggleClass('transform');
			});
			$( window ).resize(function() {
				mySlidebars.slidebars.close();
			});
		});

		}
	}) (jQuery);
	
	
	// timeline box in posts
	$(function(){
		if ( $('.post-timeline').length ) {
			$('.timeline-items').slimScroll({
				height: '230px',
				color: '#ccc',
				size: '6px',
				position: 'left',
				alwaysVisible: true
			});
		}
	});


	// specs news tabs
	function moveTab(tabid){
		tabs = 2;
		for(i = 1; i <= tabs; i++){
			if(i != tabid){
				document.getElementById("related_articles["+i+"]").style.display = "none";
				document.getElementById("related_article_link["+i+"]").className = "ra_link";
				}
		}
		document.getElementById("related_articles["+tabid+"]").style.display = "block";
		document.getElementById("related_article_link["+tabid+"]").className = "ra_clicked";
	}
		
		
	// makeMeScrollable
	$(document).ready(function () {
		$("div#makeMeScrollable").smoothDivScroll({
			manualContinuousScrolling: false,
			visibleHotSpotBackgrounds: "always",
			startAtElementId: "leaf",
			hotSpotScrolling: true,
		});
	});
		

	// whatsapp & facebook buttons on mobile header
	$(function() {
		if ( $( ".social-likes" ).length ) {
			var social_bar = $('.social-likes').offset().top;
			var sticky_share = function(){
				var scrl_top = $(window).scrollTop();
				if (scrl_top > social_bar) { 
					$('.float-social').css({ 'visibility': 'visible', 'opacity':1 });
				} else {
					$('.float-social').css({ 'visibility': 'hidden', 'opacity':0 });
				}   
			};
			sticky_share();
			$(window).scroll(function() {
			sticky_share();
			});
		}
	});
	
	
	// facebook manual share
    function fbShare(url, title, descr) {
    	var winWidth = 530;
    	var winHeight = 350;
        var winTop = (screen.height / 2) - (winHeight / 2);
        var winLeft = (screen.width / 2) - (winWidth / 2);
        window.open('https://www.facebook.com/sharer/sharer.php?u='+url+'/', 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
    }