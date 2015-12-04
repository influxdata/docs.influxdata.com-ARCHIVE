---
title: PHP
---

There's a [PHP InfluxDB library on GitHub](https://github.com/crodas/InfluxPHP) thanks to [César D. Rodas](http://cesarodas.com/).

### Installation ([using composer](https://getcomposer.org/))

    composer require crodas/influx-php:\*

### Usage

```php
<?php

$client = new \crodas\InfluxPHP\Client(
    "localhost", // host
    8086,        // port
    "root",      // user
    "root"       // password
);
```

#### Creating a Database

```php
<?php

$db = $client->createDatabase("foobar");
$db->createUser("user", "pass");
```

#### Inserting Data

```php
<?php

$db = $client->foobar;
$db->insert("some label", ['foobar' => 'bar']);
```

#### Querying

```php
<?php

$db = $client->foobar;

foreach ($db->query("SELECT * FROM foo;") as $row) {
    var_dump($row, $row->time);
}
```

[Be a fantastic human and contribute to these docs](https://github.com/influxdb/influxdb.org).
