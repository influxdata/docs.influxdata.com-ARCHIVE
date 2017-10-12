---
title: TICKscript Language Reference

menu:
  kapacitor_1_3:
    name: TICKscript
    identifier: tick
    weight: 2
---

## What is in this section?

This section provides introductory information on working with TICKscript.  

   * [Introduction](introduction/) - this document presents the fundamental concepts of working with TICKscript in Kapacitor and Chronograf.
   * [Syntax](syntax/) - this covers the essentials of how TICKscript statements and structures are organized.
   * [Lambda Expressions](expr/) - this section provides essential information about working with these argument types, which are commonly provided to TICKscript nodes.
   * [Specification](spec/) - this introduces the specification defining TICKscript.

Outside of this section the following articles may also be of interest.

   * [Getting Started](/kapacitor/v1.3/introduction/getting_started/) - an introduction to Kapacitor, which presents TICKscript basics.
   * [Node Overview](/kapacitor/v1.3/nodes/) - a catalog of the types of nodes available in TICKscript.
   * [Guides](/kapacitor/v1.3/guides/) - a collection of intermediate to advanced solutions using the TICKscript language.

   <br/>

### Checkout the Influxdata blog as well.

   * Influxdata blog for [Kapacitor](https://www.influxdata.com/blog/category/tech/kapacitor/)
   * Influxdata blog latest content:

<script  type="text/javascript" src="/js/vendor/jquery-2.1.4.min.js"></script>
<script>
console.log('ahoj')

$.get('/feed', function (data) {
    let count = 0;
    $(data).find("item").each(function () { // or "item" or whatever suits your feed
        var el = $(this);
        if(count < 3){
           $(".article-content:eq(1)").append('<div><h4><a href="' + el.find("link").text() + '">' +
                                           el.find("title").text() + '</a></h4></p><p>' +
                                           el.find("pubDate").text() + '</p><p>' +
                                           el.find("description").text() +
                                           '</p></div>');

           count++;
           console.log("------------------------");
           console.log("title      : " + el.find("title").text());
           console.log("author     : " + el.find("author").text());
           console.log("description: " + el.find("description").text());
        }
    });
});
</script>
