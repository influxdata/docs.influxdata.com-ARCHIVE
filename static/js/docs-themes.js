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

