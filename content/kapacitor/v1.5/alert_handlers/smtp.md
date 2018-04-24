---
title: SMTP Alert Handler

menu:
  kapacitor_1_5:
    name: SMTP
    weight: 14
    parent: alert-handlers
---

#### SMTP

Send alert events via email.

Options:

| Name | Type           | Description              |
| ---- | ----           | -----------              |
| to   | list of string | List of email addresses. |

Example:

```yaml
kind: smtp
options:
    to:
        - oncall1@example.com
        - oncall2@example.com
```
