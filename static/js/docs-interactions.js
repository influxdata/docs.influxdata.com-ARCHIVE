/*
	InfluxData.com Developer Documentation
	--------------------------------------
	UI Interactions
*/


/* Toggle hamburger menu on mobile */
$('#main-nav--hamburger').click( function() {
	$(this).toggleClass('open');
	$('#main-nav--links').toggleClass('show');
	$('#product-switcher--menu').toggleClass('show');
});

/* Toggle sidebar on mobile */
$('#page-title').click( function() {
	$('#page-title--toggle').toggleClass('open');
	$('#product-sidebar').toggleClass('open');
	$('#page-content').toggleClass('hide');
});

/* Open Large Screen Product Switcher */
$('#product-switcher').click( function() {
	$(this).toggleClass('show');
	$('#product-switcher--container').toggleClass('show');
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