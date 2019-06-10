// Count tag elements
function countTag(tag) {
  return $(".visible[data-tags*='" + tag + "']").length
}

function getFilterCounts() {
  $('#plugin-filters label').each(function() {
    var tagName = $('input', this).attr('name').replace(/[\W]+/, "-");
    var tagCount = countTag(tagName);
    $(this).attr('data-count', '(' + tagCount + ')');
    if (tagCount <= 0) {
      $(this).fadeTo(200, 0.25);
    } else {
      $(this).fadeTo(400, 1.0);
    }
  })
}

// Get initial filter count on page load
getFilterCounts()

$("#plugin-filters input").click(function() {

  // List of tags to hide
  var tagArray = $("#plugin-filters input:checkbox:checked").map(function(){
      return $(this).attr('name').replace(/[\W]+/, "-");
    }).get();

  // List of tags to restore
  var restoreArray = $("#plugin-filters input:checkbox:not(:checked)").map(function(){
      return $(this).attr('name').replace(/[\W]+/, "-");
    }).get();

  // Actions for filter select
  if ( $(this).is(':checked') ) {
    $.each( tagArray, function( index, value ) {
      $(".plugin-card.visible:not([data-tags~='" + value + "'])").removeClass('visible').fadeOut()
    })
  } else {
    $.each( restoreArray, function( index, value ) {
      $(".plugin-card:not(.visible)[data-tags~='" + value + "']").addClass('visible').fadeIn()
    })
    $.each( tagArray, function( index, value ) {
      $(".plugin-card.visible:not([data-tags~='" + value + "'])").removeClass('visible').hide()
    })
  }

  // Refresh filter count
  getFilterCounts()
});
