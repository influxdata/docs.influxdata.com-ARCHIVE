/*
	InfluxData.com Developer Documentation
	--------------------------------------
	UI Interactions
*/


/* Toggle product switcher from hamburger */
$('#navbar--hamburger').click( function() {
	$(this).toggleClass('open');
	$('#navbar--product-container').toggleClass('open');
});

/* Open product switcher from dropdown */
$('#navbar--dropdown').click( function() {
	$(this).toggleClass('open');
	$('#navbar--product-container').toggleClass('open');
});

/* Close product switcher from "Dismiss Overlay" */
$('#navbar--dropdown-dismiss').click( function() {
	$('#navbar--dropdown').removeClass('open');
	$('#navbar--product-container').removeClass('open');
});
/* Close product switcher by clicking a link */
$('#navbar--product-menu').click( function() {
	$('#navbar--hamburger').removeClass('open');
	$('#navbar--product-container').removeClass('open');
	$('#navbar--dropdown').removeClass('open');
});

/* Open Sidebar */
$('#sidebar--toggle').click( function() {
	$('#sidebar').addClass('open');
	$('#sidebar--mask-container').addClass('open');
});
/* Close Sidebar */
$('#sidebar--mask').click( function() {
	$('#sidebar').removeClass('open');
	$('#sidebar--mask-container').removeClass('open');
});

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


$(function(){
	/* Inject tooltips on load */
	$('.tooltip').each( function(){
		$toolTipText = $('<div/>').addClass('tooltip-text').text($(this).attr('data-tooltip-text'));
		$toolTipElement = $('<div/>').addClass('tooltip-container').append($toolTipText);
		$(this).prepend($toolTipElement);
	});

	/* Set random header image */
	var imagePathString = "/img/header-images/header-image-"+getRandomIntInclusive(1,14)+".jpg";
	$('#page-title').css('background-image','url('+imagePathString+')');
});
