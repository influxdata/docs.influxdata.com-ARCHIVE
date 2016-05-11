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


/*
	Copied and pasted this script for CSS swaps w/ cookies from
	http://www.thesitewizard.com/javascripts/change-style-sheets.shtml
*/

// *** TO BE CUSTOMISED ***

var style_cookie_name = "influx-docs-theme" ;
var style_cookie_duration = 30 ;
var style_domain = "docs.influxdata.com" ;

// *** END OF CUSTOMISABLE SECTION ***
// You do not need to customise anything below this line

function switch_style ( css_title )
{
// You may use this script on your site free of charge provided
// you do not remove this notice or the URL below. Script from
// http://www.thesitewizard.com/javascripts/change-style-sheets.shtml
  var i, link_tag ;
  for (i = 0, link_tag = document.getElementsByTagName("link") ;
    i < link_tag.length ; i++ ) {
    if ((link_tag[i].rel.indexOf("stylesheet") != -1) &&
      link_tag[i].title) {
      link_tag[i].disabled = true ;
      if (link_tag[i].title == css_title) {
        link_tag[i].disabled = false ;
      }
    }
    Cookies.set(style_cookie_name, css_title);
  }
}

function set_style_from_cookie()
{
  var css_title = Cookies.get(style_cookie_name);
  if (css_title !== undefined) {
    switch_style(css_title);
  }
}
