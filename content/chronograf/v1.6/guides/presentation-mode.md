---
title: Viewing Chronograf dashboards in presentation mode
description:
menu:
  chronograf_1_6:
    name: Viewing dashboards in presentation mode
    weight: 130
    parent: Guides
---

Presentation mode allows you to view Chronograf in full screen, hiding the left and top navigation menus so only the cells appear. This mode might be helpful, for example, for stationary screens dedicated to monitoring visualizations.

##Entering presentation mode manually
To enter presentation mode manually, click the icon in the upper right:

<img src="/img/chronograf/chronograf-presentation-mode.png" width="500"/>

To exit presentation mode, press `ESC`.

#Using the URL query parameter
To load the dashboard in presentation mode, add URL query parameter `present=true` to your dashboard URL.

Note that if you use this option, you won't be able to exit presentation mode using `ESC`.
