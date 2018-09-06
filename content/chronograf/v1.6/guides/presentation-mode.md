---
title: Viewing Chronograf dashboards in presentation mode
description: View dashboards in full screen using presentation mode.
menu:
  chronograf_1_6:
    name: Viewing dashboards in presentation mode
    weight: 130
    parent: Guides
---

Presentation mode allows you to view Chronograf in full screen, hiding the left and top navigation menus so only the cells appear. This mode might be helpful, for example, for stationary screens dedicated to monitoring visualizations.

##Entering presentation mode manually
To enter presentation mode manually, click the icon in the upper right:

<img src="/img/chronograf/chronograf-presentation-mode.png" style="width:100%; max-width:500px"/>

To exit presentation mode, press `ESC`.

##Using the URL query parameter
To load the dashboard in presentation mode, add URL query parameter `present=true` to your dashboard URL. For example, your URL might look like this:

`http://example.com:8888/sources/1/dashboards/2?present=true`

Note that if you use this option, you won't be able to exit presentation mode using `ESC`.
