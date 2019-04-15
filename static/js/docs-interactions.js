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
	$('#sidebar, .sidebar--toggle').toggleClass('open');
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

/**
 * Behavior for the tabs widgets.
 */

 function tabbedContent(container, tab, content) {

	// Add the active class to the first tab in each tab group,
	// in case it wasn't already set in the markup.
	$(container).each(function () {
		$(tab, this).removeClass('is-active');
		$(tab + ':first', this).addClass('is-active');
	});

	$(tab).on('click', function(e) {
		e.preventDefault();

		// Make sure the tab being clicked is marked as active, and make the rest inactive.
		$(this).addClass('is-active').siblings().removeClass('is-active');

		// Render the correct tab content based on the position of the tab being clicked.
		const activeIndex = $(tab).index(this);
		$(content).each(function(i) {
			if (i === activeIndex) {
				$(this).show();
				$(this).siblings(content).hide();
			}
		});
	});
}

tabbedContent('.code-tabs-wrapper', '.code-tabs p a', '.code-tab-content');
tabbedContent('.tabs-container', '.tabs p a', '.tab-content');


// Randomize advertisement content on page load
// Ad content stored in object

$advertContent = [
  {
    ctaText: "Try InfluxCloud",
    ctaLink: "https://cloud.influxdata.com/trial/user",
    advertText: "Collect, store, and retrieve time-series data in one minute.",
    style: "support-ad--cloud",
  },
  {
    ctaText: "Try InfluxEnterprise",
    ctaLink: "https://portal.influxdata.com/users/new",
    advertText: "Unlock powerful insights that help you delight your customers.",
    style: "support-ad--enterprise",
  },
]
$(document).on('ready', function(){
  $numAdverts = $advertContent.length;
  $randomizer = Math.floor(Math.random() * $numAdverts);
  $contentToInject = $advertContent[$randomizer];

  $ctaButton = $('<a />')
  	.addClass('sidebar--support-ad--cta')
  	.attr({
  		'href': $contentToInject.ctaLink,
  		'target': '_blank'
  	})
  	.text($contentToInject.ctaText);
  $advertText = $('<p />')
  	.addClass('sidebar--support-ad--desc')
  	.text($contentToInject.advertText);

  $('#support-ad')
  	.addClass($contentToInject.style)
  	.append($advertText,$ctaButton);
});

// $ads = [
// 	{ class: "cloud",	file: "/ads/ad-cloud.html" },
// 	{ class: "cloud",	file: "/ads/ad-cloud.html" }
// ]
//
// $(document).on('ready', function(){
//
//   $numAds = $ads.length;
//   $randomizer = Math.floor(Math.random() * $numAds);
//   $adContent = $ads[$randomizer];
//
// 	$('#sidebar--ad').addClass('ad-' + $adContent.class)
// 	$('#sidebar--ad').load($adContent.file)
// });


/*
 * Add class to outbound title links on section landing pages
 * Force external links to open in a new tab/window
 * Handle headings without content
 */

$(document).ready( function(){
	// Add arrow icon if h2 links go to a different doc
  $('h2 a:not([href^="#"])').addClass('off-page');

	// Force links to other sites open in a new tab/window
	$('.article-content a[href^="http"]').attr('target', '_blank');

	// Remove heading border if not followed by a paragraph
	$('h2').each(function() {
		var hasParagraph = $(this).next(':not(h1,h2)').length
		if(hasParagraph == 0) {
			$(this).addClass('no-paragraph');
		};
	});
});

/*
 * View in Chronograf button and settings
 */

$(document).ready( function(){

	// Inject the "View in Chronograf" button html on page load
	addChronografBtnHtml()

	// Open Chronograf settings modal
  $('.chronograf-url-settings').click(function() {
		var chronografUrlValue = getChronografUrl()
		openModal('#chronograf-url-modal');
		// Update the value of the chronograf url field using the saved cookie
		$('input#chronograf-url').val(chronografUrlValue)
	})

	// Close the modal by clicking anywhere but the modal
	$('.modal-overlay').click(function() {
		closeModal();
	})

	// Save Chronograf URL
	$('#save-chronograf-url').submit(function(e){
		e.preventDefault();
		var newChronografUrl = $('input#chronograf-url').val()

		// 1. Update cookie
		updateChronografUrl(newChronografUrl);

		// 2. Update html
		updateChronografBtnHtml(newChronografUrl);

		// 3. Button lifecycle
		saveBtnLifecycle('.save-btn', 150)
		setTimeout(function(){
			closeModal();
		}, 1000)

	})

	// Revert to default Chronograf URL
	$('#default-chronograf-url').click(function() {
		revertToDefault();
	})
})

/*
 * Reposition sidebar on vertical scroll
 */

$(document).ready( function() {
	var offsetElement = $("#main-nav")
	element = $("#sidebar")

	$("body").scroll(function() {
		var pos = offsetElement.offset().top + offsetElement.outerHeight(true);
		if ( pos < 0 ) {
			$(element).css("top", "0px");
		} else if ( pos <= 64 ){
			$(element).css("top", pos + "px");
		}
	})
})

/*
 * Nested left nav toggle behavior
 */

$(document).ready( function() {
	$(".sidebar--children-toggle").click(function(e) {
		e.preventDefault()
		$(this).toggleClass('open');
		$(this).siblings('.sidebar--children').toggleClass('open');
	})
})

/*
 * Content Truncate toggle
 */

$(document).ready( function() {
	$(".article-content .truncate-toggle").click(function(e) {
		e.preventDefault()
		$(this).closest('.truncate').toggleClass('closed');
	})
})
