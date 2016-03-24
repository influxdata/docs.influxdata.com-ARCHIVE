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

/* Open Large Screen Product Switcher */
$('#product-switcher').click( function() {
	$(this).toggleClass('show');
	$('#product-switcher--container').toggleClass('show');

	$('#page-title--toggle').toggleClass('open');
	$('#page-content').toggleClass('hide');
});
/* Close Large Screen Product Switcher */
$('#product-switcher--dismiss').click( function() {
	$('#product-switcher').removeClass('show');
	$('#product-switcher--container').removeClass('show');
});
$('#product-switcher--menu').click( function() {
	$('#product-switcher').removeClass('show');
	$('#product-switcher--container').removeClass('show');
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