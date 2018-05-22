---
title: Telegram event handler
description: The Telegram event handler allows you to send Kapacitor alerts to Telegram. This page includes configuration options and usage examples.
menu:
  kapacitor_1_5:
    name: Telegram
    weight: 1900
    parent: event-handlers
---

[Telegram](https://telegram.org/) is a messaging app built with a focus on
security and speed.
Kapacitor can be configured to send alert messages to a Telegram bot.

## Configuration
Configuration as well as default [option](#options) values for the Telegram
alert handler are set in your `kapacitor.conf`.
Below is an example config:

```toml
[telegram]
  enabled = false
  url = "https://api.telegram.org/bot"
  token = ""
  chat-id = ""
  parse-mode  = "Markdown"
  disable-web-page-preview = false
  disable-notification = false
  global = false
  state-changes-only = false
```

#### `enabled`
Set to `true` to enable the Telegram event handler.

#### `url`
The Telegram Bot URL.
_**This should not need to be changed.**

#### `token`
Telegram bot token.
_[Contact @BotFather](https://telegram.me/botfather) to obtain a bot token._

#### `chat-id`
Default recipient for messages.
_[Contact @myidbot](https://telegram.me/myidbot) on Telegram to get an ID._

#### `parse-mode`
Specifies the syntax used to format messages. Options are `Markdown` or `HTML`
which allow Telegram apps to show bold, italic, fixed-width text or inline URLs
in alert message.

#### `disable-web-page-preview`
Disable link previews for links in this message.

#### `disable-notification`
Sends the message silently. iOS users will not receive a notification.
Android users will receive a notification with no sound.

#### `global`
If `true`, all alerts will be sent to Telegram without explicitly specifying
Telegram in the TICKscript.

#### `state-changes-only`
If `true`, alerts will only be sent to Telegram if the alert state changes.
This only applies if the `global` is also set to `true`.


## Options
The following Telegram event handler options can be set in a
[handler file](/kapacitor/v1.5/event_handlers/#handler-file) or when using
`.telegram()` in a TICKscript.

| Name                     | Type   | Description                                                                                   |
| ----                     | ----   | -----------                                                                                   |
| chat-id                  | string | Telegram user/group ID to post messages to. If empty uses the chati-d from the configuration. |
| parse-mode               | string | Parse node, defaults to Markdown. If empty uses the parse-mode from the configuration.         |
| disable-web-page-preview | bool   | Web Page preview. If empty uses the disable-web-page-preview from the configuration.          |
| disable-notification     | bool   | Disables Notification. If empty uses the disable-notification from the configuration.         |

### Example: handler file
```yaml
topic: topic-name
id: handler-id
kind: telegram
options:
  chat-id: '123456789'
  parse-mode: 'Markdown'
  disable-web-page-preview: false
  disable-notification: false
```

### Example: TICKscript
```js
|alert()
  // ...  
  .telegram()
    .chatId('123456789')
    .disableNotification()
    .disableWebPagePreview()
    .parseMode('Markdown')
```


## Telegram Setup

### Requirements

To configure Kapacitor with Telegram, the following is needed:

* a Telegram bot
* a Telegram API access token
* a Telegram chat ID


### Create a Telegram bot
1. Search for the `@BotFather` username in your Telegram application
2. Click `Start` to begin a conversation with `@BotFather`
3. Send `/newbot` to `@BotFather`. `@BotFather` will respond:

    ---

    _Alright, a new bot. How are we going to call it? Please choose a name for your bot._

    ---

    `@BotFather` will prompt you through the rest of the bot-creation process;
    feel free to follow his directions or continue with our version of the steps
    below. Both setups result in success!

4. Send your bot's name to `@BotFather`. Your bot's name can be anything.

    > Note that this is not your bot's Telegram `@username`. You will create the
    > username in step 5.

    `@BotFather` will respond:

    ---

    _Good. Now let's choose a username for your bot. It must end in `bot`.
    Like this, for example: TetrisBot or tetris\_bot._

    ---

5. Send your bot's username to `@BotFather`. `BotFather` will respond:

    ---

    _Done! Congratulations on your new bot.
    You will find it at t.me/<bot-username>.
    You can now add a description, about section and profile picture for your
    bot, see /help for a list of commands. By the way, when you've finished creating
    your cool bot, ping our Bot Support if you want a better username for it.
    Just make sure the bot is fully operational before you do this._

    _Use this token to access the HTTP API:  
    \<API-access-token\>_

    _For a description of the Bot API, see this page:
    [https://core.telegram.org/bots/api](https://core.telegram.org/bots/api)_

    ---

6. Begin a conversation with your bot.
   Click on the `t.me/<bot-username>` link in `@BotFather`'s response and click
   `Start` at the bottom of your Telegram application.
   Your newly-created bot will appear in the chat list on the left side of the application.


### Get a Telegram API access token
Telegram's `@BotFather` bot sent you an API access token when you created your bot.
See the `@BotFather` response in step 5 of the previous section for where to find your token.
If you can't find the API access token, create a new token with the following steps
below.

1. Send `/token` to `@BotFather`
2. Select the relevant bot at the bottom of your Telegram application.
   `@BotFather` responds with a new API access token:

    ---

    _You can use this token to access HTTP API:  
    \<API-access-token\>_

    _For a description of the Bot API, see this page:
    [https://core.telegram.org/bots/api](https://core.telegram.org/bots/api)_

    ---

### Get your Telegram chat ID
1. Paste the following link in your browser. Replace `<API-access-token>` with
   the API access token that you identified or created in the previous section:

    ```
    https://api.telegram.org/bot<API-access-token>/getUpdates?offset=0
    ```

2. Send a message to your bot in the Telegram application.
   The message text can be anything.
   Your chat history must include at least one message to get your chat ID.
3. Refresh your browser.
4. Identify the numerical chat ID by finding the `id` inside the `chat` JSON object.
   In the example below, the chat ID is `123456789`.

    ```json
    {  
       "ok":true,
       "result":[  
          {  
             "update_id":XXXXXXXXX,
             "message":{  
                "message_id":2,
                "from":{  
                   "id":123456789,
                   "first_name":"Mushroom",
                   "last_name":"Kap"
                },
                "chat":{  
                   "id":123456789,
                   "first_name":"Mushroom",
                   "last_name":"Kap",
                   "type":"private"
                },
                "date":1487183963,
                "text":"hi"
             }
          }
       ]
    }
    ```


## Using the Telegram event handler
With the Telegram event handler enabled and configured in your `kapacitor.conf`,
use the `.telegram()` attribute in your TICKscripts to send alerts to your
Telegram bot or define a Telegram handler that subscribes to a topic and sends
published alerts to your Telegram bot.

> To avoid posting a message every alert interval, use
> [AlertNode.StateChangesOnly](/kapacitor/v1.5/nodes/alert_node/#statechangesonly)
> so only events where the alert changed state are sent to Telegram.

The examples below use the following Telegram configuration defined in the `kapacitor.conf`:

_**Telegram settings in kapacitor.conf**_
```toml
[telegram]
  enabled = true
  url = "https://api.telegram.org/bot"
  token = "mysupersecretauthtoken"
  chat-id = ""
  parse-mode  = "Markdown"
  disable-web-page-preview = false
  disable-notification = false
  global = false
  state-changes-only = false
```

### Send alerts to a Telegram bot from a TICKscript

The following TICKscript uses the `.telegram()` event handler to send the message,
"Hey, check your CPU" to a Telegram bot whenever idle CPU usage drops below 10%.
It uses the default Telegram settings defined in the `kapacitor.conf`.

_**telegram-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .stateChangesOnly()
    .message('Hey, check your CPU')
    .telegram()
```

### Send alerts to the Telegram bot from a defined handler

The following setup sends the message, "Hey, check your CPU" to a Telgram bot
with the `123456789` chat-ID.

Create a TICKscript that publishes alert messages to a topic.
The TICKscript below sends an alert message to the `cpu` topic any time CPU
idle usage drops below 10% _(or CPU usage is above 90%)_.

_**cpu\_alert.tick**_
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .stateChangesOnly()
    .message('Hey, check your CPU')
    .topic('cpu')
```

Add and enable the TICKscript:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor enable cpu_alert
```

Create a handler file that subscribes to the `cpu` topic and uses the Telegram
event handler to send alerts to the `123456789` chat-ID in Telegram.

_**telegram\_cpu\_handler.yaml**_
```yaml
id: telegram-cpu-alert
topic: cpu
kind: telegram
options:
  chat-id: '123456789'
```

Add the handler:

```bash
kapacitor define-topic-handler telegram_cpu_handler.yaml
```
