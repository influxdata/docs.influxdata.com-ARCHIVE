---
title: Live Leaderboard of game scores

menu:
  kapacitor_1_1:
    name: Live Leaderboard
    identifier: live_leaderboard
    weight: 10
    parent: examples
---

**If you do not have a running Kapacitor instance check out the [getting started guide](/kapacitor/v1.1/introduction/getting_started/)
to get Kapacitor up and running on localhost.**

Today we are game developers.
We host a several game servers each running an instance of the game code with about a hundred players per game.

We need to build a leaderboard so spectators can see the player's scores in real time.
We would also like to have historical data on leaders in order to do post game
analysis on who was leading for how long etc.

We will use Kapacitor's stream processing to do the heavy lifting for us.
The game servers can send a UDP packet anytime a player's score changes
or at least every 10 seconds if the score hasn't changed.

### Setup

**All snippets below can be found [here](https://github.com/influxdb/kapacitor/tree/master/examples/scores)**

Our first order of business is to configure Kapacitor to receive the stream of scores.
In this case the scores update too often to store all of them in InfluxDB so we will send them directly to Kapacitor.
Like InfluxDB you can configure a UDP listener.
Add this configuration section to the end of your Kapacitor configuration.

```
[[udp]]
    enabled = true
    bind-address = ":9100"
    database = "game"
    retention-policy = "autogen"
```

This configuration tells Kapacitor to listen on port `9100` for UDP packets in the line protocol format.
It will scope in incoming data to be in the `game.autogen` database and retention policy.
Start Kapacitor running with that added to the configuration.

Here is a simple bash script to generate random score data so we can test it without
messing with the real game servers.

```bash
#!/bin/bash

# default options: can be overriden with corresponding arguments.
host=${1-localhost}
port=${2-9100}
games=${3-10}
players=${4-100}

games=$(seq $games)
players=$(seq $players)
# Spam score updates over UDP
while true
do
    for game in $games
    do
        game="g$game"
        for player in $players
        do
            player="p$player"
            score=$(($RANDOM % 1000))
            echo "scores,player=$player,game=$game value=$score" > /dev/udp/$host/$port
        done
    done
    sleep 0.1
done
```

Place the above script into a file `scores.sh` and run it:

```bash
chmod +x ./scores.sh
./scores.sh
```

Now we are spamming Kapacitor with our fake score data.
We can just leave that running since Kapacitor will drop
the incoming data until it has a task that wants it.

### Defining the Kapacitor task

What does a leaderboard need to do?

1.
Get the most recent score per player per game.
2.
Calculate the top X player scores per game.
3.
Publish the results.
4.
Store the results.

To complete step one we need to buffer the incoming stream and return the most recent score update per player per game.
Our [TICKscript](/kapacitor/v1.1/tick/) will look like this:

```javascript
var topPlayerScores = stream
    |from()
        .measurement('scores')
        // Get the most recent score for each player per game.
        // Not likely that a player is playing two games but just in case.
        .groupBy('game', 'player')
    |window()
        // keep a buffer of the last 11s of scores
        // just in case a player score hasn't updated in a while
        .period(11s)
        // Emit the current score per player every second.
        .every(1s)
        // Align the window boundaries to be on the second.
        .align()
    |last('value')
```

Place this script in a file called `top_scores.tick`.

Now our `topPlayerScores` variable contains each player's most recent score.
Next to calculate the top scores per game we just need to group by game and run another map reduce job.
Let's keep the top 15 scores per game.
Add these lines to the `top_scores.tick` file.

```javascript
// Calculate the top 15 scores per game
var topScores = topPlayerScores
    |groupBy('game')
    |top(15, 'last', 'player')
```

The `topScores` variable now contains the top 15 player's score per game.
All we need to be able to build our leaderboard.
Kapacitor can expose the scores over HTTP via the [HTTPOutNode](/kapacitor/v1.1/nodes/http_out_node/).
We will call our task `top_scores`; with the following addition the most recent scores will be available at
`http://localhost:9092/kapacitor/v1/tasks/top_scores/top_scores`.

```javascript
// Expose top scores over the HTTP API at the 'top_scores' endpoint.
// Now your app can just request the top scores from Kapacitor
// and always get the most recent result.
//
// http://localhost:9092/kapacitor/v1/tasks/top_scores/top_scores
topScores
   |httpOut('top_scores')
```

Finally we want to store the top scores over time so we can do in depth analysis to ensure the best game play.
But we do not want to store the scores every second as that is still too much data.
First we will sample the data and store scores only every 10 seconds.
Also let's do some basic analysis ahead of time since we already have a stream of all the data.
For now we will just do basic gap analysis where we will store the gap between the top player and the 15th player.
Add these lines to `top_scores.tick` to complete our task.

```javascript
// Sample the top scores and keep a score once every 10s
var topScoresSampled = topScores
    |sample(10s)

// Store top fifteen player scores in InfluxDB.
topScoresSampled
    |influxDBOut()
        .database('game')
        .measurement('top_scores')

// Calculate the max and min of the top scores.
var max = topScoresSampled
    |max('top')

var min = topScoresSampled
    |min('top')

// Join the max and min streams back together and calculate the gap.
max
    |join(min)
        .as('max', 'min')
    // Calculate the difference between the max and min scores.
    // Rename the max and min fields to more friendly names 'topFirst', 'topLast'.
    |eval(lambda: "max.max" - "min.min", lambda: "max.max", lambda: "min.min")
        .as('gap', 'topFirst', 'topLast')
    // Store the fields: gap, topFirst and topLast in InfluxDB.
    |influxDBOut()
        .database('game')
        .measurement('top_scores_gap')
```

Since we are writing data back to InfluxDB create a database `game` for our results.

```
curl -G 'http://localhost:8086/query?' --data-urlencode 'q=CREATE DATABASE game'
```

Here is the complete task TICKscript if you don't want to copy paste as much :)

```javascript
// Define a result that contains the most recent score per player.
var topPlayerScores = stream
    |from()
        .measurement('scores')
        // Get the most recent score for each player per game.
        // Not likely that a player is playing two games but just in case.
        .groupBy('game', 'player')
    |window()
        // keep a buffer of the last 11s of scores
        // just in case a player score hasn't updated in a while
        .period(11s)
        // Emit the current score per player every second.
        .every(1s)
        // Align the window boundaries to be on the second.
        .align()
    |last('value')

// Calculate the top 15 scores per game
var topScores = topPlayerScores
    |groupBy('game')
    |top(15, 'last', 'player')

// Expose top scores over the HTTP API at the 'top_scores' endpoint.
// Now your app can just request the top scores from Kapacitor
// and always get the most recent result.
//
// http://localhost:9092/kapacitor/v1/tasks/top_scores/top_scores
topScores
   |httpOut('top_scores')

// Sample the top scores and keep a score once every 10s
var topScoresSampled = topScores
    |sample(10s)

// Store top fifteen player scores in InfluxDB.
topScoresSampled
    |influxDBOut()
        .database('game')
        .measurement('top_scores')

// Calculate the max and min of the top scores.
var max = topScoresSampled
    |max('top')

var min = topScoresSampled
    |min('top')

// Join the max and min streams back together and calculate the gap.
max
    |join(min)
        .as('max', 'min')
    // calculate the difference between the max and min scores.
    |eval(lambda: "max.max" - "min.min", lambda: "max.max", lambda: "min.min")
        .as('gap', 'topFirst', 'topLast')
    // store the fields: gap, topFirst, and topLast in InfluxDB.
    |influxDBOut()
        .database('game')
        .measurement('top_scores_gap')
```

Define and enable our task to see it in action:

```bash
kapacitor define top_scores -tick top_scores.tick -type stream -dbrp game.autogen
kapacitor enable top_scores
```

First  let's check that the HTTP output is working.

```bash
curl 'http://localhost:9092/kapacitor/v1/tasks/top_scores/top_scores'
```

You should have a JSON result of the top 15 players and their scores per game.
Hit the endpoint several times to see that the scores are updating once a second.

Now, let's check InfluxDB to see our historical data.

```bash
curl \
    -G 'http://localhost:8086/query?db=game' \
    --data-urlencode 'q=SELECT * FROM top_scores  WHERE time > now() - 5m GROUP BY game'

curl \
    -G 'http://localhost:8086/query?db=game' \
    --data-urlencode 'q=SELECT * FROM top_scores_gap WHERE time > now() - 5m GROUP BY game'
```

Great!
The hard work is done.
All that is left is to configure the game server to send score updates to Kapacitor and update the spectator dashboard to pull scores from Kapacitor.
