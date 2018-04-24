---
title: Alerta Alert Handler

menu:
  kapacitor_1_5:
    name: Alerta
    weight: 2
    parent: alert-handlers
---

#### Alerta

Send alert events to an Alerta instance.

Options:

| Name         | Type           | Description                                                                                                                                    |
| ----         | ----           | -----------                                                                                                                                    |
| token        | string         | Alerta authentication token. If empty uses the token from the configuration.                                                                   |
| token-prefix | string         | Alerta authentication token prefix. If empty uses Bearer.                                                                                      |
| resource     | string         | Alerta resource. Can be a template and has access to the same data as the AlertNode.Details property. Default: {{ .Name }}                     |
| event        | string         | Alerta event. Can be a template and has access to the same data as the idInfo property. Default: {{ .ID }}.                                    |
| environment  | string         | Alerta environment. Can be a template and has access to the same data as the AlertNode.Details property. Defaut is set from the configuration. |
| group        | string         | Alerta group. Can be a template and has access to the same data as the AlertNode.Details property. Default: {{ .Group }}.                      |
| value        | string         | Alerta value. Can be a template and has access to the same data as the AlertNode.Details property. Default is an empty string.                 |
| origin       | string         | Alerta origin.   If empty uses the origin from the configuration.                                                                              |
| service      | list of string | List of effected Services.                                                                                                                     |

Example:

```yaml
kind: alerta
options:
    resource: system
```
