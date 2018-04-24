---
title: Snmptrap Alert Handler

menu:
  kapacitor_1_5:
    name: Snmptrap
    weight: 15
    parent: alert-handlers
---

#### Snmptrap

Trigger SNMP traps for alert events.

Options:

| Name      | Type   | Description                                                                     |
| ----      | ----   | -----------                                                                     |
| trap-oid  | string | OID of the trap.                                                                |
| data-list | object | Each data object has `oid`, `type`, and `value` fields. Each field is a string. |

Example:

```yaml
kind: snmptrap
options:
    trap-oid: '1.1.1.1'
    data-list:
        oid: '1.3.6.1.2.1.1.7'
        type: i
        value: '{{ index .Field "value" }}'
```
