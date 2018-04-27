---
title: Post Event Handler

menu:
  kapacitor_1_5:
    name: Post
    weight: 9
    parent: event-handlers
---

#### Post

Post JSON encoded alert data to an HTTP endpoint.

Options:

| Name     | Type                    | Description                                                                          |
| ----     | ----                    | -----------                                                                          |
| url      | string                  | The URL to which the alert data will be posted.                                      |
| endpoint | string                  | Name of a configured httppost endpoint, cannot be specified in conjunciton with URL. |
| headers  | map of string to string | Set of extra header values to set on the POST request.                               |

Example:

```yaml
kind: post
options:
    url: http://example.com
```
