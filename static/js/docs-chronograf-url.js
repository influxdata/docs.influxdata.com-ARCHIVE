// Sets the chronograf url of query examples so users can
// open the examples queries at a custom chronograf url.

var chronograf_cookie_name = 'influx-chronograf-url'
var chronograf_default_url = 'http://localhost:8888/sources/1/chronograf/data-explorer'

// Set/Update the cookie
function updateChronografUrl ( chronograf_url ) {
  Cookies.set(chronograf_cookie_name, chronograf_url)
}

// Get/set the Chronograf URL
function getChronografUrl() {
  var chronografUrl = ( Cookies.get('influx-chronograf-url') === undefined ? chronograf_default_url : Cookies.get('influx-chronograf-url') )
  return chronografUrl
}

// Add the Chronograf button html
function addChronografBtnHtml() {
  $('.view-in-chronograf').each(function() {
    var query = $(this).data('query');
    var encodedQuery = encodeURIComponent(query);
		var chronografLink = getChronografUrl() + "?query=" + encodedQuery;

		$(this).html("<a class='chronograf-url-settings settings icon cog'></a><a class='chronograf-btn gradient-h klavika-font' href='"+chronografLink+"' target='_blank'>View in Chronograf</a>");
	})
}

// Update the Chronograf button html
function updateChronografBtnHtml(newLinkUrl) {
  $.each($('.view-in-chronograf'), function() {
    var newQuery = $(this).data('query')
    var newEncodedQuery = encodeURIComponent(newQuery)
    $('.chronograf-btn', this).attr('href', newLinkUrl + "?query=" + newEncodedQuery )
  })
}

// Open modal window
function openModal(modalId) {
	$('.modal-overlay, .modal-content').fadeIn(200);
	$('.modal-content').addClass('open');
}

// Close modal window
function closeModal() {
	$('.modal-overlay, .modal-content').fadeOut(200);
	$('.modal-content').removeClass('open');
}

// Save Button Lifecycle
function saveBtnLifecycle(btnSelector, duration) {
	var btnText = btnSelector + ' span'
	$(btnText).fadeTo(duration, 0)
	setTimeout(function() {
		$(btnText).text('').delay().addClass('icon').fadeTo(duration, 1)
	}, duration);

	setTimeout(function() {
		$(btnText).fadeTo(duration, 0)
		setTimeout(function() {
			$(btnText).text('Save').delay().removeClass('icon').fadeTo(duration, 1)
		}, duration);
	}, duration * 12);
}

// Revert Chronograf URL to the default value
function revertToDefault() {
  $('input#chronograf-url').val(chronograf_default_url);
}
