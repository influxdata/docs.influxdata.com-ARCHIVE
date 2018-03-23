---
title: Authentication and Authorization
draft: true

menu:
  enterprise_kapacitor_1_4:
    weight: 7
    parent: Administration
---

<!-- The Modal -->
<!-- div id="modal" style="display:none; position:absolute; z-index: 100; top: 100px; left: 400px; max-width: 250%; max-height: 250%; background: linear-gradient(to right,#22ADF6 0,#9394FF 100%);; padding: 30px;" -->

<div id="peekaboo" style="display:none">
</div>

<div id="modal" style="display:none; position: relative; z-index: 100; background: linear-gradient(to right,#22ADF6 0,#9394FF 100%);; padding: 30px; margin: 10px;">

  <span id="modalMax" style="display:inherit; position: absolute; color: #4591ED; top: 35px; right: 75px; font-size: 40px; font-weight: bold; transition: 0.3s">⤢</span>
  <!-- The Close Button -->
  <span id="modalClose" style="display:inherit; position: absolute; color: #4591ED; top: 35px; right: 45px; font-size: 40px; font-weight: bold; transition: 0.3s">&times;</span>

  <!-- Modal Content (The Image) -->
  <img style="margin: auto; display: block; " id="img01">

</div>

<script>

var currentModalImageLocal = "";


function doModal(imgID){

    if(currentModalImageLocal.length > 0){ // modal already open
        document.getElementById("modalClose").click()
    }

    currentModalImageLocal = imgID;
    // Get the modal
    var peekaboo = document.getElementById("peekaboo");
    var modal = document.getElementById("modal");
    var anchor = document.getElementById("anchor-" + imgID);
    var holder = document.getElementById("holder-" + imgID);
    var article = document.getElementsByClassName("article-content")[0];

    var img = document.getElementById(imgID);
    var modalImg = document.getElementById("img01");

   if(window.innerWidth > window.innerHeight){ //typical PC/Laptop dimensions

       peekaboo.appendChild(anchor);
       holder.appendChild(modal);

       modal.style.display = "block";

       if(img.naturalWidth > img.naturalHeight){ // Landscape
           var idealWidth = Math.min(article.clientWidth * 0.9, img.naturalWidth);
//           var idealWidth = article.clientWidth * 0.9;
           console.log(idealWidth)
           modalImg.style.width = idealWidth + "px";

           modalImg.style.height = img.naturalHeight * (idealWidth/img.naturalWidth) + "px";
           modal.style.height = parseInt(modalImg.style.height, 10) + (parseInt(modal.style.padding, 10) * 2) + "px" ;
           modal.style.width = parseInt(modalImg.style.width) + (parseInt(modal.style.padding, 10) * 2) + "px" ;

           if( idealWidth === img.naturalWidth){
               document.getElementById("modalMax").style.display = "none";
           }

       }else{ //portrait
           var idealHeight = Math.min(window.innerHeight * 0.9, img.naturalHeight);
//           var idealHeight = window.innerHeight * 0.9;
           modalImg.style.height = idealHeight + "px";
           modalImg.style.width = img.naturalWidth * (idealHeight/img.naturalHeight) + "px";
           modal.style.width = parseInt(modalImg.style.width, 10) + (parseInt(modal.style.padding, 10) * 2) + "px" ;
           modal.style.height = parseInt(modalImg.height ) + (parseInt(modal.style.padding, 10) * 2) + "px" ;

           if( idealHeight === img.naturalHeight){
               document.getElementById("modalMax").style.display = "none";
           }

       }

       modalImg.src = img.src;

   }else{ // typical smartphone dimensions

      // do nothing for now

   }

}


// Get the <span> element that closes the modal
var spanMCL = document.getElementById("modalClose");

var spanMMX = document.getElementById("modalMax");

// When the user clicks on <span> (x), close the modal
spanMCL.onclick = function() {

  var holder = document.getElementById("holder-" + currentModalImageLocal)
  var modal = document.getElementById("modal");
  var anchor = document.getElementById("anchor-" + currentModalImageLocal);
  var peekaboo = document.getElementById("peekaboo");
  var modalImg = document.getElementById("img01");


  modal.style.display = "none";
  modal.style.maxWidth = "100%";
  modal.style.maxHeight = "100%";
  modalImg.style.width = "100%";
  modalImg.style.height = "100%";

  peekaboo.appendChild(modal);
  holder.appendChild(anchor);

  currentModalImageLocal = ""
  document.getElementById("modalMax").style.display = "inherit";

}

spanMMX.onclick = function(){

    var holder = document.getElementById("holder-" + currentModalImageLocal)
    var modal = document.getElementById("modal");
    var anchor = document.getElementById("anchor-" + currentModalImageLocal);
    var peekaboo = document.getElementById("peekaboo");
    var modalImg = document.getElementById("img01");
    var img = document.getElementById(currentModalImageLocal)

    modalImg.style.width = img.naturalWidth + "px";
    modalImg.style.height = img.naturalHeight + "px";

    modal.style.width = img.naturalWidth + (parseInt(modal.style.padding, 10) * 2) + "px" ;
    modal.style.height = img.naturalHeight  + (parseInt(modal.style.padding, 10) * 2) + "px" ;

    document.getElementById("modalMax").style.display = "none";


}


</script>

## Contents

* [Overview of Authentication and Authorization in the TICK stack](#overview-of-authentication-and-authorization-in-the-tick-stack)
* [Enabling Authentication in Kapacitor](#enabling-authentication-in-kapacitor)
* [User and Privilege Management](#user-and-privilege-management)
   * [User and Privilege Management over the Influxd-Meta API](#user-and-privilege-management-over-the-influxd-meta-api)
   * [User and Privilege Management with Chronograf](#user-and-privilege-management-with-chronograf)

## Overview of Authentication and Authorization in the TICK stack


Kapacitor authorization and authentication involves three components of the
enterprise TICK stack: InfluxDB Enterprise meta nodes, Enterprise Kapacitor and,
to aid in the creation of users and roles, Chronograf and its InfluxDB Admin
console.  

InfluxDB meta nodes provide the API for the user and permission store.  This API
makes available standard operations such as creating, retrieving, updating and
deleting users and roles.  When retrieving users, it becomes the TICK
authentication service for other TICK components, returning a JSON document
describing the user, if the user exists, to the requesting component.  To save
time and calls, components, such as Kapacitor, can cache user documents in their
local data stores.  

The Influx-Meta schema includes a limited set of predefined permissions.  Among
these are `KapacitorAPI` and `KapacitorConfigAPI`.  These permissions can be
assigned directly to the user or to a role, to which the user can then be assigned
in turn.

A high level view of the authentication and authorization architecture is
presented in Image 1.

**Image 1 &ndash; Authentication and authorization in the TICK stick (click to enlarge  )**

<div id="holder-arch-dia">
<a href="javascript:doModal('arch-dia')" id="anchor-arch-dia">
<img id='arch-dia' src='/img/enterprise/kapacitor/tm-chart-2.jpg' alt="Auth arch view" style="max-width: 300px"></img>
</a>
</div>

<!-- N.B. This is likely to be superseded by JWT -->

With authentication enabled for the Kapacitor HTTP service, when a Kapacitor
user seeks to use the Kapacitor API directly or to use the command line client,
credentials need to be supplied.

For example when using the Kapacitor client.
```
$ kapacitor -url http://tux:changeit@localhost:9092 list tasks
ID                                                 Type      Status    Executing Databases and Retention Policies
172-31-16-108-cpu-alert                            stream    enabled   true      ["telegraf"."autogen"]
chronograf-v1-9199dfc1-90d3-4a22-a34b-93577057daa3 stream    disabled  false     ["telegraf"."autogen"]
```

Or, as an alternative example, when accessing the API directly.
```
$ curl -v http://tux:changeit@localhost:9092/kapacitor/v1/tasks
```

Authentication roughly follows these steps:  

1. When processing the request, Kapacitor will strip out the credentials.
2. Kapacitor then checks to see whether the user name currently matches any user details document in its local cache in the Kapacitor database.  If so it jumps to step 7.
3. If the user details are not in the cache, Kapacitor sends the credentials to the Influx-Meta API endpoint.
4. If the credentials are valid, the Influx-Meta server then returns a user details JSON document.
5. Kapacitor in turn inspects the user details document for the correct privileges.
6. Kapacitor caches the user details document.
7. If the document shows the user has the correct privileges, Kapacitor completes
the requested transaction.  If the user does not have the proper privileges, the
transaction is aborted and Kapacitor returns 403 and a message like the following:

```
{"error":"user <USER> does not have \"read\" privilege for API endpoint \"/kapacitor/v1/tasks\""}
```

## Enabling Authentication in Kapacitor

Authentication can be declared in the configuration file in two parameter
groups: `[http]` and `[auth]`.  

**Example 1 &ndash; Configuring Authentication in kapacitor.conf**
```
[http]
  # HTTP API Server for Kapacitor
  # This server is always on,
  # it serves both as a write endpoint
  # and as the API endpoint for all other
  # Kapacitor calls.
  bind-address = ":9092"
  auth-enabled = true
  log-enabled = true
  write-tracing = false
  pprof-enabled = false
  https-enabled = false
  https-certificate = "/etc/ssl/kapacitor.pem"
  shared-secret = ""

[auth]
  # Configure authentication service.
  # User permissions cache expiration time.
  cache-expiration = "10m"
  # Cost to compute bcrypt password hashes.
  # bcrypt rounds = 2^cost
  bcrypt-cost = 10
  # Address of a meta server.
  # If empty then meta is not used as a user backend.
  # host:port
  meta-addr = "172.17.0.2:8091"
```

In the `[http]` group the value of `authe-enabled` needs to be set to `true`.

Enterprise Kapacitor also contains a set of authentication specific properties
in the `[auth]` group.  These include:

* `cache-expiration` &ndash; Defines how long a consumer service can hold a credential document in its cache.
* `bcrypt-cost` &ndash; The number of iterations used when hashing the password using the bcrypt algorithm.  Higher values generate hashes more resilient to brute force cracking attempts, but lead to marginally longer resolution times.
* `meta-addr` &ndash; Declares the address of the InfluxDB Enterprise meta node to connect to in order to access the user and permission store.

Currently no alternative exists to using InfluxDB Enterprise meta nodes as the backend
user and privilege store, so an address and port need to be supplied.

These properties can also be defined as environment variables.  

**Example 2 &ndash; Configuring Authentication with ENVARS**
```
KAPACITOR_HTTP_AUTH_ENABLED=true;
KAPACITOR_AUTH_META_ADDR=172.17.0.2:8091
```

When managing Kapacitor with Systemd these environment variables can be stored
in the file `/etc/default/kapacitor`.

Once these key properties have been set, restart the Kapacitor service.

With Systemd this is done as follows:

```
$ sudo systemctl restart kapacitor.service
```

## User and Privilege Management

User and privilege management means managing the contents of a user store and
the access rights (privileges, permissions) that users can be granted. It entails
creating and deleting users and roles, granting them privileges, and assigning
roles to users.

User means an actor identified by a set of credentials including a username and
a password and granted a set of privileges, which define a set of TICK stack
resources and APIs available for his use.

Privilege means a level of access to a TICK stack resource.  Level of access can
mean simply viewing the resource, copying the resource, droping the resource,
writing to the resource or full management capabilities.  The level of access
and the resource are combined in predefined keys.  The enforcement of privileges
is handled by the respective TICK stack services.  Predefined key tokens
generally take the form of self-descriptive verb object pairs.  When the token
lacks the verb part, full management privileges are implied. These predefined
tokens include:

* `ViewAdmin`
* `ViewChronograf`
* `CreateDatabase`
* `CreateUserAndRole`
* `AddRemoveNode`
* `DropDatabase`
* `DropData`
* `ReadData`
* `WriteData`
* `Rebalance`
* `ManageShard`
* `ManageContinuousQuery`
* `ManageQuery`
* `ManageSubscription`
* `Monitor`
* `CopyShard`
* `KapacitorAPI`
* `KapacitorConfigAPI`

Note that these privileges are system privilges and are separate from the
database specific privileges that can be inspected using the `show grants for "<USER>"`
command when connected to an Influxd-Data node.  When working with Kapacitor the
last two privilege tokens are of interest.

* `KapacitorAPI` &ndash; Grants the user permission to create, read, update and delete tasks, topics, handlers and similar Kapacitor artefacts.
* `KapacitorConfigAPI` &ndash; Grants the user permission to override the Kapacitor configuration dynamically using the configuration endpoint.  

Role means a predefined collection of privileges that can be assigned to a user.

Managing users, roles and privileges is most easily handled using the Chronograf
InfluxDB Admin console.  However authentication and authorization entities can
also be managed directly over the Influxd-Meta API.

### User and Privilege management over the Influxd-meta API

#### Users

The Influxd-Meta API provides an endpoint `/user` for managing users.

To view a list of existing users.

```
$ curl -u "admin:changeit" -s http://localhost:8091/user | python -m json.tool
{
    "users": [
        {
            "hash": "$2a$10$NelNfrWdxubN0/TnP7DwquKB9/UmJnyZ7gy0i69MPldK73m.2WfCu",
            "name": "admin",
            "permissions": {
                "": [
                    "ViewAdmin",
                    "ViewChronograf",
                    "CreateDatabase",
                    "CreateUserAndRole",
                    "DropDatabase",
                    "DropData",
                    "ReadData",
                    "WriteData",
                    "ManageShard",
                    "ManageContinuousQuery",
                    "ManageQuery",
                    "ManageSubscription",
                    "Monitor"
                ]
            }
        },
        {
            "hash": "$2a$10$DJU3VGwJrpl.on9QyyJH3uBGq3UDSo1c.UXUSiCvR0gke85ZJYvsu",
            "name": "bob",
            "permissions": {
                "": []
            }
...            
```

Transactions that modify the user store are initiated using HTTP POST and must
be sent to the lead node in the Influxd-Meta raft.  If when POSTing a request the
node returns a 307 redirect message, try resending the request to the lead node
indicated by the `Location` field in the HTTP header.

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"create","user":{"name":"phantom","password":"changeit"}}' http://localhost:8091/user
*   Trying 127.0.0.1...
* Connected to localhost (127.0.0.1) port 8091 (#0)
> POST /user HTTP/1.1
> Host: localhost:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 68
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 68 out of 68 bytes
< HTTP/1.1 307 Temporary Redirect
< Influxdb-Metaindex: 28443
< Location: http://ip-172-31-16-140.us-west-1.compute.internal:8091/user
< Request-Id: ab2924b6-2834-11e8-b553-000000000000
< X-Influxdb-Version: 1.3.8-c1.3.8
< Date: Thu, 15 Mar 2018 09:38:51 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

To create a new user against the lead node.  

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"create","user":{"name":"phantom","password":"changeit"}}' http://ip-172-31-16-140.us-west-1.compute.internal:8091/user
*   Trying 172.31.16.140...
* Connected to ip-172-31-16-140.us-west-1.compute.internal (172.31.16.140) port 8091 (#0)
> POST /user HTTP/1.1
> Host: ip-172-31-16-140.us-west-1.compute.internal:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 67
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 67 out of 67 bytes
< HTTP/1.1 200 OK
< Request-Id: 3a99b41e-2834-11e8-b1a4-000000000000
< X-Influxdb-Version: 1.3.8-c1.3.8
< Date: Thu, 15 Mar 2018 09:35:42 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

To get a user details document.

```
$ curl --negotiate -u "admin:changeit" -s http://localhost:8091/user?name=phantom | python -m json.tool
{
    "users": [
        {
            "hash": "$2a$10$LqNj.EmmYutGj3jI0E4SEOJFOVHjOoRUgkwMSI5gH1lzObeAc0r7y",
            "name": "phantom"
        }
    ]
}
```

To grant permissions to a user.

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"add-permissions","user":{"name":"phantom","permissions":{"":["KapacitorAPI","KapacitorConfigAPI"]}}}' http://ip-172-31-16-140.us-west-1.compute.internal:8091/user
*   Trying 172.31.16.140...
* Connected to ip-172-31-16-140.us-west-1.compute.internal (172.31.16.140) port 8091 (#0)
> POST /user HTTP/1.1
> Host: ip-172-31-16-140.us-west-1.compute.internal:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 111
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 111 out of 111 bytes
< HTTP/1.1 200 OK
< Request-Id: 4bc990ab-2835-11e8-b1fd-000000000000
< X-Influxdb-Version: 1.3.8-c1.3.8
< Date: Thu, 15 Mar 2018 09:43:20 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

Verify permission grant.

```
$ curl --negotiate -u "admin:changeit" -s http://localhost:8091/user?name=phantom | python -m json.tool{
    "users": [
        {
            "hash": "$2a$10$LqNj.EmmYutGj3jI0E4SEOJFOVHjOoRUgkwMSI5gH1lzObeAc0r7y",
            "name": "phantom",
            "permissions": {
                "": [
                    "KapacitorAPI",
                    "KapacitorConfigAPI"
                ]
            }
        }
    ]
}
```

To remove permissions.

```
$  curl --negotiate -u "admin:changeit" -s -v -d '{"action":"remove-permissions","user":{"name":"phantom","permissions":{"":["KapacitorConfigAPI"]}}}' http://ip-172-31-16-140.us-west-1.compute.internal:8091/user
*   Trying 172.31.16.140...
* Connected to ip-172-31-16-140.us-west-1.compute.internal (172.31.16.140) port 8091 (#0)
> POST /user HTTP/1.1
> Host: ip-172-31-16-140.us-west-1.compute.internal:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 99
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 99 out of 99 bytes
< HTTP/1.1 200 OK
< Request-Id: 8cbebdc1-2835-11e8-b212-000000000000
< X-Influxdb-Version: 1.3.8-c1.3.8
< Date: Thu, 15 Mar 2018 09:45:09 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

To delete a user.

```
p-172-31-16-140.us-west-1.compute.internal left intact
ubuntu@ip-172-31-16-108:~$  curl --negotiate -u "admin:changeit" -s -v -d '{"action":"delete","user":{"name":"phantom"}}' http://ip-172-31-16-140.us-west-1.compute.internal:8091/user
*   Trying 172.31.16.140...
* Connected to ip-172-31-16-140.us-west-1.compute.internal (172.31.16.140) port 8091 (#0)
> POST /user HTTP/1.1
> Host: ip-172-31-16-140.us-west-1.compute.internal:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 45
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 45 out of 45 bytes
< HTTP/1.1 200 OK
< Request-Id: c9cd5800-2835-11e8-b229-000000000000
< X-Influxdb-Version: 1.3.8-c1.3.8
< Date: Thu, 15 Mar 2018 09:46:51 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

To verify user has been removed.

```
$ curl --negotiate -u "admin:changeit" -s http://localhost:8091/user?name=phantom
{"error":"user not found"}
```

#### Roles

To list roles.

```
$ curl --negotiate -u "admin:changeit" -s http://localhost:8091/role | python -m json.tool
{}
```

In a fresh installation no roles will have been created yet. As when creating a
user the lead node must be used.

To create a role.

```
$ curl --negotiate -u "admin:changeit"  -v -d '{"action":"create","role":{"name":"spectre"}}' http://ip-172-31-16-140.us-west-1.compute.internal:8091/role
*   Trying 172.31.16.140...
* Connected to ip-172-31-16-140.us-west-1.compute.internal (172.31.16.140) port 8091 (#0)
> POST /role HTTP/1.1
> Host: ip-172-31-16-140.us-west-1.compute.internal:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 45
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 45 out of 45 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 28461
< Request-Id: e9937ae1-2836-11e8-b2a5-000000000000
< X-Influxdb-Version: 1.3.8-c1.3.8
< Date: Thu, 15 Mar 2018 09:54:54 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

Verify the node has been created.

```
$ curl --negotiate -u "admin:changeit" -s http://localhost:8091/role | python -m json.tool{
    "roles": [
        {
            "name": "djinn"
        },
        {
            "name": "spectre"
        }
    ]
}
```

Retrieve a record for a single node.

```
$ curl --negotiate -u "admin:changeit" -s http://localhost:8091/role?name=spectre | python -m json.tool{
    "roles": [
        {
            "name": "spectre"
        }
    ]
}
```

Add permissions to a role.

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"add-permissions","role":{"name":"spectre","permissions":{"":["KapacitorAPI","KapacitorConfigAPI"]}}}' http://ip-172-31-16-140.us-west-1.compute.internal:8091/role
```

Verify permissions have been added.

```
$ curl --negotiate -u "admin:changeit" -s http://localhost:8091/role?name=spectre | python -m json.tool{
    "roles": [
        {
            "name": "spectre",
            "permissions": {
                "": [
                    "KapacitorAPI",
                    "KapacitorConfigAPI"
                ]
            }
        }
    ]
}
```

Add user to role.

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"add-users","role":{"name":"spectre","users":["phantom"]}}'  http://ec2-13-57-192-165.us-west-1.compute.amazonaws.com:8091/role
*   Trying 172.31.16.140...
* Connected to ec2-13-57-192-165.us-west-1.compute.amazonaws.com (172.31.16.140) port 8091 (#0)
> POST /role HTTP/1.1
> Host: ec2-13-57-192-165.us-west-1.compute.amazonaws.com:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 68
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 68 out of 68 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 28467
< Request-Id: ec76460f-2838-11e8-b35d-000000000000
< X-Influxdb-Version: 1.3.8-c1.3.8
< Date: Thu, 15 Mar 2018 10:09:18 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

Verify user has been added to role.

```
$ curl --negotiate -u "admin:changeit" -s http://localhost:8091/role?name=spectre | python -m json.tool{
    "roles": [
        {
            "name": "spectre",
            "permissions": {
                "": [
                    "KapacitorAPI",
                    "KapacitorConfigAPI"
                ]
            },
            "users": [
                "phantom"
            ]
        }
    ]
}
```

Remove a user from a role.

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"remove-users","role":{"name":"spectre","users":["phantom"]}}' http://admin:changeit@ip-172-31-16-140.us-west-1.compute.internal:8091/role
*   Trying 172.31.16.140...
* Connected to ip-172-31-16-140.us-west-1.compute.internal (172.31.16.140) port 8091 (#0)
> POST /role HTTP/1.1
> Host: ip-172-31-16-140.us-west-1.compute.internal:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 71
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 71 out of 71 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 28470
< Request-Id: ae85d2a2-2839-11e8-b39f-000000000000
< X-Influxdb-Version: 1.3.8-c1.3.8
< Date: Thu, 15 Mar 2018 10:14:44 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

Remove a permission from a role.

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"remove-permissions","role":{"name":"spectre","permissions":{"":["KapacitorConfigAPI"]}}}' http://ip-172-31-16-140.us-west-1.compute.internal:8091/role
*   Trying 172.31.16.140...
* Connected to ip-172-31-16-140.us-west-1.compute.internal (172.31.16.140) port 8091 (#0)
> POST /role HTTP/1.1
> Host: ip-172-31-16-140.us-west-1.compute.internal:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 99
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 99 out of 99 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 28471
< Request-Id: 3a9f2761-283a-11e8-b3d5-000000000000
< X-Influxdb-Version: 1.3.8-c1.3.8
< Date: Thu, 15 Mar 2018 10:18:39 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

Delete a role.

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"delete","role":{"name":"spectre"}}' http://ip-172-31-16-140.us-west-1.compute.internal:8091/role
*   Trying 172.31.16.140...
* Connected to ip-172-31-16-140.us-west-1.compute.internal (172.31.16.140) port 8091 (#0)
> POST /role HTTP/1.1
> Host: ip-172-31-16-140.us-west-1.compute.internal:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 45
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 45 out of 45 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 28474
< Request-Id: 82f6260f-283a-11e8-b3f4-000000000000
< X-Influxdb-Version: 1.3.8-c1.3.8
< Date: Thu, 15 Mar 2018 10:20:40 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

Verify role no longer exists.

```
$ curl --negotiate -u "admin:changeit" -s http://localhost:8091/role?name=spectre | python -m json.tool
{
    "error": "role not found"
}
```

### User and Privilege Management with Chronograf

Connect to Chronograf with a browser at the default port `8888` of the host
where the Chronograf service is running.  Adding an Influx Server is covered in
the [Chronograf documentation](/chronograf/v1.4/introduction/getting-started/#chronograf-setup).

Note that when integrating Chronograf with Enterprise InfluxDB, an additional
field labeled **Meta Service Connection URL** is specified in the Connection
Configuration form.  This is where the endpoint to a node in the InfluxDB-Meta
cluster needs to be supplied.

Once the Chronograf graphical user interface is loaded, open the **InfluxDBAdmin**
console through the left side navigation bar.

<img id='open-admin' src='/img/enterprise/kapacitor/OpenInfluxDBAdmin.png' alt="Open InfluxDBAdmin" style="max-width: 300px"></img>

To manage users open the **Users** tab in the console.

<img id='open-user-tab' src='/img/enterprise/kapacitor/OpenUsersTab.png' alt="Open Users Tab" style="max-width: 300px"></img>

#### Managing Users

##### To create a user.
<br/>

1) First click on the **Create User** button.  This will create a new user entry in the users table.

<div id="holder-create-user-01">
<a href="javascript:doModal('create-user-01')" id="anchor-create-user-01">
<img id='create-user-01' src='/img/enterprise/kapacitor/CreateUser01.png' alt="Create User 01" style="max-width: 300px"></img>
</a>
</div>

2) In the new user entry in the table fill in the fields **name** and **password** and then click the **save** control.

<div id="holder-create-user-02">
<a href="javascript:doModal('create-user-02')" id="anchor-create-user-02">
<img id='create-user-02' src='/img/enterprise/kapacitor/CreateUser02.png' alt="Create User 02" style="max-width: 300px"></img>
</a>
</div>

3) The new user is now a standard entry in the users table.

<div id="holder-create-user-03">
<a href="javascript:doModal('create-user-03')" id="anchor-create-user-03">
<img id='create-user-03' src='/img/enterprise/kapacitor/CreateUser03.png' alt="Create User 03" style="max-width: 300px"></img>
</a>
</div>

##### To Add Privileges to a User
<br/>

1) Locate the user in the users table and then open the drop down **Permissions** list box.  

2) Select the permissions to add.

3) Click the **Apply** button.  

<div id="holder-add-permissions-user-01">
<a href="javascript:doModal('add-permissions-user-01')" id="anchor-add-permissions-user-01">
<img id='add-permissions-user-01' src='/img/enterprise/kapacitor/AddPermissionsToUser01.png' alt="Add Privileges to User 01" style="max-width: 300px"></img>
</a>
</div>

4) A notification message "User Permissions Updated" appears and the new permissions are partially visible in the **Permissions** column of the user entry.  

<div id="holder-add-permissions-user-02">
<a href="javascript:doModal('add-permissions-user-02')" id="anchor-add-permissions-user-02">
<img id='add-permissions-user-02' src='/img/enterprise/kapacitor/AddPermissionsToUser02.png' alt="Add Privileges to User 02" style="max-width: 300px"></img>
</a>
</div>

##### To Remove Privileges from a User
<br/>

1) Locate the user in the users table and then open the drop down **Permissions** list box.  

2) Deselect the permissions to remove.

3) Click the **Apply** button.  

<div id="holder-remove-permissions-user-01">
<a href="javascript:doModal('remove-permissions-user-01')" id="anchor-remove-permissions-user-01">
<img id='remove-permissions-user-01' src='/img/enterprise/kapacitor/RemovePermissionsToUser01.png' alt="Remove Privileges from User 01" style="max-width: 300px"></img>
</a>
</div>

4) A notification message "User Permissions Updated" appears and the permissions are no longer partially visible in the **Permissions** column of the user entry.  

<div id="holder-remove-permissions-user-02">
<a href="javascript:doModal('remove-permissions-user-02')" id="anchor-remove-permissions-user-02">
<img id='remove-permissions-user-02' src='/img/enterprise/kapacitor/RemovePermissionsToUser02.png' alt="Remove Privileges from User 02" style="max-width: 300px"></img>
</a>
</div>

##### To Delete a User
<br/>

1) Locate the user in the users table and click the **Delete** button.  This will open **Confirmation** and **Cancel** buttons.

<div id="holder-delete-user-01">
<a href="javascript:doModal('delete-user-01')" id="anchor-delete-user-01">
<img id='delete-user-01' src='/img/enterprise/kapacitor/DeleteUser01.png' alt="Delete User 01" style="max-width: 300px"></img>
</a>
</div>

2) Click the green **Confirmation** button.

<div id="holder-delete-user-02">
<a href="javascript:doModal('delete-user-02')" id="anchor-delete-user-02">
<img id='delete-user-02' src='/img/enterprise/kapacitor/DeleteUser02.png' alt="Delete User 01" style="max-width: 300px"></img>
</a>
</div>

3) A confirmation message "User Deleted" appears and the user entry is no longer visible in the users table.

<div id="holder-delete-user-03">
<a href="javascript:doModal('delete-user-03')" id="anchor-delete-user-03">
<img id='delete-user-03' src='/img/enterprise/kapacitor/DeleteUser03.png' alt="Delete User 01" style="max-width: 300px"></img>
</a>
</div>

#### Managing Roles

To manage roles open the **Roles** tab in the Chronograf InfluxDB Admin console.

<img id='manage-roles-tab' src='/img/enterprise/kapacitor/OpenRolesTab01.png' alt="Open Roles Tab" style="max-width: 300px"></img>


##### To Create a Role
<br/>

1) First click on the **Create Role** button.  A new role entry will appear in the role table with text edit f

<div id="holder-create-role-01">
<a href="javascript:doModal('create-role-01')" id="anchor-create-role-01">
<img id='create-role-01' src='/img/enterprise/kapacitor/CreateRole01.png' alt="Create Role 01" style="max-width: 300px"></img>
</a>
</div>

2) Add a name and click the **Save** button.

<div id="holder-create-role-02">
<a href="javascript:doModal('create-role-02')" id="anchor-create-role-02">
<img id='create-role-02' src='/img/enterprise/kapacitor/CreateRole02.png' alt="Create Role 02" style="max-width: 300px"></img>
</a>
</div>

3) A notification message will appear, "Roll Created Successfully".

<div id="holder-create-role-03">
<a href="javascript:doModal('create-role-03')" id="anchor-create-role-03">
<img id='create-role-03' src='/img/enterprise/kapacitor/CreateRole03.png' alt="Create Role 03" style="max-width: 300px"></img>
</a>
</div>

##### To Add Privileges to a Role
<br/>

1) Locate the role in the roles table and then open the drop down **Permissions** list box.  

2) Select the permissions to add.

3) Click the **Apply** button.  


<div id="holder-add-perm-role-01">
<a href="javascript:doModal('add-perm-role-01')" id="anchor-add-perm-role-01">
<img id='add-perm-role-01' src='/img/enterprise/kapacitor/AddPermissionsToRole01.png' alt="Add Privileges to Role 01" style="max-width: 300px"></img>
</a>
</div>

4) A notification message "Role Permissions Updated" appears and the new permissions are partially visible in the **Permissions** column of the role entry.  

<div id="holder-add-perm-role-02">
<a href="javascript:doModal('add-perm-role-02')" id="anchor-add-perm-role-02">
<img id='add-perm-role-02' src='/img/enterprise/kapacitor/AddPermissionsToRole02.png' alt="Add Privileges to Role 02" style="max-width: 300px"></img>
</a>
</div>


##### To Add a User to a Role
<br/>
1) Locate the role in the roles table and then open the drop down **Users** list box.  

2) Select the users to add.

3) Click the **Apply** button.  

<div id="holder-add-user-role-01">
<a href="javascript:doModal('add-user-role-01')" id="anchor-add-user-role-01">
<img id='add-user-role-01' src='/img/enterprise/kapacitor/AddUserToRole01.png' alt="Add User to Role 01" style="max-width: 300px"></img>
</a>
</div>

4) A notification message "Role Users Updated" appears and the new users are partially visible in the **Users** column of the role entry.  

<div id="holder-add-user-role-02">
<a href="javascript:doModal('add-user-role-02')" id="anchor-add-user-role-02">
<img id='add-user-role-02' src='/img/enterprise/kapacitor/AddUserToRole02.png' alt="Add User to Role 02" style="max-width: 300px"></img>
</a>
</div>

##### To Remove a User from a Role
<br/>
1) Locate the role in the roles table and then open the drop down **Users** list box.  

2) Deselect the users, so that they will be removed.

3) Click the **Apply** button.  

<div id="holder-remove-user-role-01">
<a href="javascript:doModal('remove-user-role-01')" id="anchor-remove-user-role-01">
<img id='remove-user-role-01' src='/img/enterprise/kapacitor/RemoveUserFromRole01.png' alt="Remove User from Role 01" style="max-width: 300px"></img>
</a>
</div>

4) A notification message "Role Users Updated" appears and the users are no longer visible in the **Users** column of the role entry.  

<div id="holder-remove-user-role-02">
<a href="javascript:doModal('remove-user-role-02')" id="anchor-remove-user-role-02">
<img id='remove-user-role-02' src='/img/enterprise/kapacitor/RemoveUserFromRole02.png' alt="Remove User from Role 02" style="max-width: 300px"></img>
</a>
</div>

##### To Remove Privileges from a Role
<br/>

1) Locate the role in the roles table and then open the drop down **Permissions** list box.  

2) Deselect the permissions, that should be removed.

3) Click the **Apply** button.  

<div id="holder-remove-perm-role-01">
<a href="javascript:doModal('remove-perm-role-01')" id="anchor-remove-perm-role-01">
<img id='remove-perm-role-01' src='/img/enterprise/kapacitor/RemovePermissionFromRole01.png' alt="Remove User from Role 02" style="max-width: 300px"></img>
</a>
</div>

4) A notification message "Role Permissions Updated" appears and the permissions are no longer visible in the **Permissions** column of the role entry.  

<div id="holder-remove-perm-role-02">
<a href="javascript:doModal('remove-perm-role-02')" id="anchor-remove-perm-role-02">
<img id='remove-perm-role-02' src='/img/enterprise/kapacitor/RemovePermissionsFromRole02.png' alt="Remove User from Role 02" style="max-width: 300px"></img>
</a>
</div>

##### To Delete a Role  
<br/>

1) Locate the role in the roles table and click the **Delete** button.  This will open **Confirmation** and **Cancel** buttons.

<div id="holder-delete-role-01">
<a href="javascript:doModal('delete-role-01')" id="anchor-delete-role-01">
<img id='delete-role-01' src='/img/enterprise/kapacitor/DeleteRole01.png' alt="Delete Role 01" style="max-width: 300px"></img>
</a>
</div>

2) Click the green **Confirmation** button.

<div id="holder-delete-role-02">
<a href="javascript:doModal('delete-role-02')" id="anchor-delete-role-02">
<img id='delete-role-02' src='/img/enterprise/kapacitor/DeleteRole02.png' alt="Delete Role 02" style="max-width: 300px"></img>
</a>
</div>

3) A confirmation message "Role deleted" appears and the role entry is no longer visible in the roles table.

<div id="holder-delete-role-03">
<a href="javascript:doModal('delete-role-03')" id="anchor-delete-role-03">
<img id='delete-role-03' src='/img/enterprise/kapacitor/DeleteRole03.png' alt="Delete Role 03" style="max-width: 300px"></img>
</a>
</div>
