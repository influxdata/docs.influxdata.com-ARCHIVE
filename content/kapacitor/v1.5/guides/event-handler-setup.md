---
title: Event handler setup

menu:
  kapacitor_1_5:
    weight: 70
    parent: guides
---

Integrate Kapacitor into your monitoring system by sending [alert messages](/kapacitor/latest/nodes/alert_node/#message)
to supported event handlers.
Currently, Kapacitor can send alert messages to specific log files and specific URLs,
as well as to applications such as [Slack](https://slack.com/) and [HipChat](https://www.hipchat.com/).

This document offers step-by-step instructions for setting up event handlers with Kapacitor,
including relevant configuration options and [TICKscript](/kapacitor/latest/tick/) syntax.
Currently, this document doesn't cover every supported event handler, but we will
continue to add content to this page over time.
For a complete list of the supported event handlers and for additional information,
please see the [event handler reference documentation](/kapacitor/latest/nodes/alert_node/).

[HipChat Setup](#hipchat-setup)  
[Telegram Setup](#telegram-setup")  

## HipChat setup

[HipChat](https://www.hipchat.com/) is Atlassian's web service for group chat,
video chat, and screen sharing.
Configure Kapacitor to send alert messages to a HipChat room.

### Requirements

To configure Kapacitor with HipChat, you need:

- Your HipChat subdomain name
- Your HipChat room name
- A HipChat API access token for sending notifications

#### HipChat API access token
The following steps describe how to create the API access token.

1. From the HipChat home page, access **Account settings** by clicking on the
person icon in the top right corner.

2. Select **API access** from the items in the left menu sidebar.

3. Under **Create new token**, enter a label for your token (it can be anything).

4. Under **Create new token**, select **Send Notification** as the Scope.

5. Click **Create**.

    Your token appears in the table just above the **Create new token** section:

    ![HipChat token](/img/kapacitor/hipchat-token.png)

### Configuration

In the `[hipchat]` section of Kapacitor's configuration file, set:

- `enabled` to `true`
- `subdomain` in the `url` setting to your HipChat subdomain

The optional configuration settings are:

`room`  
Set to your HipChat room.
This serves as the default chat ID if the TICKscript doesn't specify a chat ID.

`token`  
Set to your HipChat [API access token](#hipchat-api-access-token).
This serves as the default token if the TICKscript doesn't specify an API access token.

`global`  
Set to `true` to send all alerts to HipChat without needing to specify HipChat in TICKscripts.

`state-changes-only`  
Set to `true` to only send an alert to HipChat if the alert state changes.
This setting only applies if the `global` setting is also set to `true`.

#### Sample configuration
```toml
[hipchat]
  enabled = true
  url = "https://my-subdomain.hipchat.com/v2/room"
  room = "my-room"
  token = "mytokentokentokentoken"
  global = false
  state-changes-only = false
```

#### TICKscript syntax
```js
|alert()
  .hipChat()
    .room('<HipChat-room>')
    .token('<HipChat-API-token>')
```

The `.room()` and `.token()` specifications are optional.
If they aren't set in the TICKscript, they default to the `room` and
`token` settings in the `[hipchat]` section of the `kapacitor.conf`.

> If `global` is set to `true` in the configuration file, there's no
> need to specify `.hipChat()` in the TICKscript.
> Kapacitor sends all alerts to HipChat by default.

`.room('<HipChat-room>')`  
Sets the HipChat room.

`.token('<HipChat-API-token>')`  
Sets the HipChat [API access token](#hipchat-api-access-token).


### Examples

#### Send alerts to the HipChat room set in the configuration file

_**Configuration file**_
```toml
[hipchat]
  enabled = true
  url = "https://testtest.hipchat.com/v2/room"
  room = "my-alerts"
  token = "tokentokentokentokentoken"
  global = false
  state-changes-only = true
```

_**TICKscript**_
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" <  97)
    .message('Hey, check your CPU')
    .hipChat()
```

The setup sends `Hey, check your CPU` to the **my-alerts** room associated with
the `testest` subdomain.

#### Send alerts to the HipChat room set in the TICKscript

_**Configuration file**_
```toml
[hipchat]
  enabled = true
  url = "https://testtest.hipchat.com/v2/room"
  room = "my-alerts"
  token = "tokentokentokentokentoken"
  global = false
  state-changes-only = true
```

_**TICKscript**_
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" <  97)
    .message('Hey, check your CPU')
    .hipChat()
    .room('random')
```

The setup sends `Hey, check your CPU` to the **random** room associated with
the `testest` subdomain.
Notice that `.room()` in the TICKscript overrides the `room` setting in the
configuration file.

## Telegram setup

[Telegram](https://telegram.org/) is a messaging app.
Configure Kapacitor to send alert messages to a Telegram bot.

### Requirements

To configure Kapacitor with Telegram, you need:

- A Telegram bot
- A Telegram API access token
- Your Telegram chat ID

#### Telegram bot

The following steps describe how to create a new Telegram bot.

1. Search for the **@BotFather** username in your Telegram application.

2. Click **Start** to begin a conversation with **@BotFather**.

3. Send `/newbot` to **@BotFather**.

    **@BotFather** responds:

    _Alright, a new bot. How are we going to call it? Please choose a name for your bot._

    **@BotFather** will prompt you through the rest of the bot-creation process; feel
    free to follow his directions or continue with our version of the steps below.
    Both setups result in success!

4. Send your bot's name to **@BotFather**.

    Your bot's name can be anything.
    Note that this is not your bot's Telegram `@username`; you'll create the username
    in step 5.

    **@BotFather** responds:

    _Good. Now let's choose a username for your bot. It must end in `bot`. Like this, for example: TetrisBot or tetris\_bot._

5. Send your bot's username to **@BotFather**.

    Your bot's username must end in `bot`.
    For example: `mushroomKap_bot`.

    `BotFather` responds:

    _Done! Congratulations on your new bot. You will find it at t.me/<bot-username>. You can now add a description, about section and profile picture for your bot, see /help for a list of commands. By the way, when you've finished creating your cool bot, ping our Bot Support if you want a better username for it. Just make sure the bot is fully operational before you do this._

    Use this token to access the HTTP API:
    <API-access-token>

    For a description of the Bot API, see this page: https://core.telegram.org/bots/api

6. Begin a conversation with your bot.

    Click on the `t.me/<bot-username>` link in **@BotFather**'s response
    and click **Start** at the bottom of your Telegram application.

    Your newly created bot will appear in the chat list on the left side of the application.

#### Telegram API access token

The following section describes how to identify or create the API access token.

Telegram's **@BotFather** bot sent you an API access token when you created your bot.
See the **@BotFather** response in step 5 of the previous section for where to find your token.
If you can't find the API access token, create a new token with the steps below.

1.  Send `/token` to **@BotFather**

2.  Select the relevant bot at the bottom of your Telegram application.

    **@BotFather** responds with a new API access token:

    You can use this token to access HTTP API:
    <API-access-token>

    For a description of the Bot API, see this page: https://core.telegram.org/bots/api


#### Telegram chat ID

The following steps describe how to identify your chat ID.

1.  Paste the following link in your browser.
    Replace `<API-access-token>` with the API access token that you identified
    or created in the previous section:

    `https://api.telegram.org/bot<API-access-token>/getUpdates?offset=0`

2.  Send a message to your bot in the Telegram application.
    The message text can be anything; your chat history must include at least
    one message to get your chat ID.

3.  Refresh your browser.

4.  Identify the numerical chat ID in the JSON provided in the browser.
    In the formatted example below, the chat ID is `123456789`.

    ```json
    {
      "ok": true,
      "result": [
        {
          "update_id": 101010101,
          "message": {
            "message_id": 2,
            "from": {
              "id": 123456789,
              "first_name": "Mushroom",
              "last_name": "Kap"
            },
            "chat": {
              "id": 123456789,
              "first_name": "Mushroom",
              "last_name": "Kap",
              "type": "private"
            },
            "date": 1487183963,
            "text": "hi"
          }
        }
      ]
    }
    ```


### Configuration

In the `[telegram]` section of Kapacitor's configuration file set:

- `enabled` to `true`
- `token` to your [API access token](#telegram-api-access-token)

The default `url` setting (`https://api.telegram.org/bot`) requires no additional configuration.

The optional configuration settings are:

`chat_id`  
Set to your Telegram [chat ID](#telegram-chat-id). This serves as the default chat ID if the TICKscript doesn't specify a chat ID.

`parse-mode`  
Set to `Markdown` or `HTML` for Markdown-formatted or HTML-formatted alert messages.
The default `parse-mode` is `Markdown`.

`disable-web-page-preview`  
Set to `true` to disable [link previews](https://telegram.org/blog/link-preview) in alert messages.

`disable-notification`  
Set to `true` to disable notifications on iOS devices and disable sounds on Android devices.
When set to `true`, Android users continue to receive notifications.

`global`  
Set to `true` to send all alerts to Telegram without needing to specify Telegram in TICKscripts.

`state-changes-only`  
Set to `true` to only send an alert to Telegram if the alert state changes.
This setting only applies if the `global` setting is also set to `true`.


#### Sample configuration
```toml
[telegram]
  enabled = true
  url = "https://api.telegram.org/bot"
  token = "abcdefghi:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  chat-id = "123456789"
  parse-mode = Markdown
  disable-web-page-preview = true
  disable-notification = false
  global = true
  state-changes-only = true
```

#### TICKscript syntax
```js
|alert()
  .telegram()
    .chatId('<chat_id>')
    .disableNotification()
    .disableWebPagePreview()
    .parseMode(['Markdown' | 'HTML'])
```

The `.chatId()`, `.disableNotification()`, `.disableWebPagePreview()`, and `.parseMode()` specifications are optional.
If they aren't set in the TICKscript, they default to the `chat-id`, `disable-notification`,
`disable-web-page-preview`, and `parse-mode` settings in the `[telegram]` section of the configuration file.
Note that if `global` is set to `true` in the configuration file, there's no need to specify
`.telegram()` in the TICKscript; Kapacitor sends all alerts to Telegram by default.

`.chatId('<chat_id>')`  
Sets the Telegram [chat ID](#telegram-chat-id).

`.disableNotification()`  
Disables notifications on iOS devices and disables sounds on Android devices.
Android users continue to receive notifications.

`.disableWebPagePreview()`  
Disables [link previews](https://telegram.org/blog/link-preview) in alert messages.

`.parseMode(['Markdown' | 'HTML'])`  
Sets `Markdown` or `HTML` as the format for alert messages.


### Examples

#### Send alerts to the Telegram chat ID set in the configuration file

_**Configuration file**_
```toml
[telegram]
  enabled = true
  url = "https://api.telegram.org/bot"
  token = "abcdefghi:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  chat-id = "123456789"
  parse-mode  = "Markdown"
  disable-web-page-preview = false
  disable-notification = false
  global = false
  state-changes-only = false
```

_**TICKscript**_
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 97)
    .message('Might want to check your CPU')
    .telegram()
```

The setup sends `Might want to check your CPU` to the Telegram bot associated
with the chat ID `123456789` and API access token `abcdefghi:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.

#### Send alerts to the Telegram chat ID set in the TICKscript

_**Configuration file**_
```toml
[telegram]
  enabled = true
  url = "https://api.telegram.org/bot"
  token = "abcdefghi:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  chat-id = ""
  parse-mode  = "Markdown"
  disable-web-page-preview = false
  disable-notification = false
  global = false
  state-changes-only = false
```

_**TICKscript**_
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 97)
    .message('Might want to check your CPU')
    .telegram()
      .chatId('123456789')
```

The setup sends `Might want to check your CPU` to the Telegram bot associated with the chat ID `123456789` and API access token `abcdefghi:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.
