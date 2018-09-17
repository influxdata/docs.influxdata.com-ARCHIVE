---
title: Using annotations in Chronograf views
description: Annotations provide contextual information by adding explanatory notes or comments to Chronograf graph views and charts in the user interface and dashboards.
menu:
  chronograf_1_6:
    name: Using annotations
    weight: 50
    parent: Guides
---

## Using annotations in the Chronograf interface

Annotations in Chronograf are notes of explanation or comments added to graph views by editors or administrators. Annotations can provide Chronograf users with useful contextual information about single points in time or time intervals. Users can use annotations to correlate the effects of important events, such as system changes or outages across multiple metrics, with Chronograf data.

When an annotation is added, a solid white line appears on all graph views for that point in time or an interval of time.

### Annotations example

The following screenshot of five graph views displays annotations for a single point in time and a time interval.
The text and timestamp for the single point in time can be seem above the annotation line in the graph view on the lower right.
The annotation displays "`Deploy v3.8.1-2`" and the time "`2018/28/02 15:59:30:00`".

![Annotations on multiple graph views](/img/chronograf/chrono-annotations-example.png)


**To add and edit an annotation:**

1. In the top menu bar, click **Annotations**.
2. Click **Annotate** in the upper right.
2. Click **Add Annotation**, then move your cursor to point in time you want to annotate and click or drag to create an annotation.
4. To edit, hover over the annotation and select the edit (pencil) button from the tooltip that appears. The **Edit Annotation** window appears:
  * **Name**: The name for the annotation.
  * **Type**: Point annotations are for a single point in time. Window annotations cover a specified interval.
  * **Start and End** (window) or **Time** (point): The timestamp(s) for the annotation.
  * **Annotation Tags**: Click **+ Add Tag**, then enter a tag key and values.
5. To delete the annotation, click **Delete**.
6. Click **Save**.

**To filter annotations by tag:**

1. In the top menu bar, click **Annotations**.
2. Select **Filter Annotations by Tags** from the drop-down menu in the upper left.
3. Click **+ Filter** to add a filter.
4. Enter the tag key and values you want to filter by, then click the green check mark to add that filter.
5. To filter by more than one tag, repeat steps 3-4.

**To hide all annotations:**

* In the top menu bar, click **Annotations**.
* Select **Hide Annotations** from the drop-down menu in the upper left.
