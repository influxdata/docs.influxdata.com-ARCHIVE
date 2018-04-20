---
title: Authentication and authorization in Kapacitor Enterprise
description: Includes and overview of TICK stack authentication and authorization, enabling authentication in Kapacitor Enterprise, and user and privilege management using the InfluxDB Meta API.

menu:
  enterprise_kapacitor_1_4:
    name: Authentication and authorization
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

* [Overview of authentication and authorization in the TICK stack](#overview-of-authentication-and-authorization-in-the-tick-stack)
* [Enabling authentication in Kapacitor](#enabling-authentication-in-kapacitor)
* [User and privilege management](#user-and-privilege-management)
   * [User and privilege management over the InfluxDB Meta API](#user-and-privilege-management-over-the-influxd-meta-api)
   * [User and privilege management with Chronograf](#user-and-privilege-management-with-chronograf)

## Overview of authentication and authorization in the TICK stack


Kapacitor authorization and authentication involves three components of the
enterprise TICK stack: InfluxDB Enterprise meta nodes, Enterprise Kapacitor and,
to aid in the creation of users and roles, Chronograf and its InfluxDB Admin
console. 

InfluxDB meta nodes provide the API for the user and privilege store.  This API
makes available standard operations such as creating, retrieving, updating and
deleting users and roles.  When retrieving users, it becomes the TICK
authentication service for other TICK components, returning a JSON document
describing the user, if the user exists, to the requesting component.  To save
time and calls, components, such as Kapacitor, can cache user documents in their
local data stores.  

The InfluxDB Meta schema includes a limited set of predefined privileges.  Among
these are `KapacitorAPI` and `KapacitorConfigAPI`.  These permissions can be
assigned directly to the user or to a role, to which the user can then be assigned
in turn.

A high level view of the authentication and authorization architecture is
presented in Image 1.

**Image 1: Authentication and authorization in the TICK stack (click to enlarge)**

<div id="holder-arch-dia">
<a href="javascript:doModal('arch-dia')" id="anchor-arch-dia">
<img id='arch-dia' src='/img/enterprise/kapacitor/tm-chart-2.jpg' alt="Auth arch view" style="max-width: 300px"></img>
</a>
</div>

<!-- N.B. This is likely to be superseded by JWT -->

With authentication enabled for the Kapacitor HTTP service, when a Kapacitor
user seeks to use the Kapacitor API directly or to use the command line client,
credentials need to be supplied.

For example, when using the Kapacitor client.

**Example 1: Using credentials with Kapacitor CLI client**

```
kapacitor -url https://admin:changeit@cluster_node_1:9092 list tasks
ID                                                 Type      Status    Executing Databases and Retention Policies
cluster_node_1-cpu-alert                            stream    enabled   true      ["telegraf"."autogen"]
chronograf-v1-9199dfc1-90d3-4a22-a34b-93577057daa3 stream    disabled  false     ["telegraf"."autogen"]
```

Or, as an alternative example, when accessing the API directly.
```
$ curl -v https://admin:changeit@cluster_node_1:9092/kapacitor/v1/tasks
```

Authentication roughly follows these steps:  

1. When processing the request, Kapacitor parses the credentials.
2. Kapacitor then validates the credentials.  The first step is to check to see whether the user name and password currently match any user details document in its local cache in the Kapacitor database.  If so it jumps to step 7.
3. If the user details are not in the cache, Kapacitor sends the credentials to the InfluxDB Meta API endpoint.
4. If the credentials are valid, the InfluxDB Meta server then returns a user details JSON document.
5. Kapacitor in turn inspects the user details document for the correct privileges.
6. Kapacitor caches the user details document.
7. If the document shows the user has the correct privileges, Kapacitor completes
the requested transaction.  If the user does not have the proper privileges, the
transaction is aborted and Kapacitor returns 403 and a message like the following:

```
{"error":"user <USER> does not have \"read\" privilege for API endpoint \"/kapacitor/v1/tasks\""}
```

## Enabling authentication in Kapacitor

Authentication can be declared in the configuration file in two parameter
groups: `[http]` and `[auth]`.  

**Example 2: Configuring authentication in `kapacitor.conf`**

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
  meta-addr = "cluster_node_1:8091"
  # meta-use-tls = false
```

In the `[http]` group the value of `auth-enabled` needs to be set to `true`.

The core authentication specific properties of Enterprise Kapacitor are found
in the `[auth]` group.  These include:

* `cache-expiration`: Defines how long a consumer service can hold a credential document in its cache.
* `bcrypt-cost`: The number of iterations used when hashing the password using the bcrypt algorithm.  Higher values generate hashes more resilient to brute force cracking attempts, but lead to marginally longer resolution times.
* `meta-addr`: Declares the address of the InfluxDB Enterprise meta node to connect to in order to access the user and permission store.
* `meta-use-tls`: Declares whether to use TLS when communication with the influxdb-meta node or not.  Default is `false`.

Currently no alternative exists to using InfluxDB Enterprise meta nodes as the backend
user and privilege store, so an address and port need to be supplied.

These properties can also be defined as environment variables.  

**Example 3: Configuring authentication with ENVARS**
```
KAPACITOR_HTTP_AUTH_ENABLED=true;
KAPACITOR_AUTH_META_ADDR=172.17.0.2:8091
```

When managing Kapacitor with `systemd`, these environment variables can be stored
in the file `/etc/default/kapacitor`.

Once these key properties have been set, restart the Kapacitor service.

With `systemd`, this is done as follows:

```
$ sudo systemctl restart kapacitor.service
```

## User and privilege management

User and privilege management means managing the contents of a user store and
the access rights (privileges, permissions) that users can be granted. It entails
creating and deleting users and roles, granting them privileges, and assigning
roles to users.

User means an actor identified by a set of credentials including a username and
a password and granted a set of privileges, which define a set of TICK stack
resources and APIs available for his use.

Privilege means a level of access to a TICK stack resource.  Level of access can
mean simply viewing the resource, copying the resource, dropping the resource,
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

Note that these privileges are system privileges and are separate from the
database specific privileges that can be inspected using the `show grants for "<USER>"`
command when connected to an Influxd-Data node.  When working with Kapacitor the
last two privilege tokens are of interest.

* `KapacitorAPI`: Grants the user permission to create, read, update and delete tasks, topics, handlers and similar Kapacitor artefacts.
* `KapacitorConfigAPI`: Grants the user permission to override the Kapacitor configuration dynamically using the configuration endpoint.  

Role means a predefined collection of privileges that can be assigned to a user.

÷Managing users, roles and privileges is most easily handled using the Chronograf
InfluxDB Admin console.  However authentication and authorization entities can
also be managed directly over the Influxd-Meta API.

### User and privilege management over the Influxd-meta API

#### Users

The Influxd-Meta API provides an endpoint `/user` for managing users.

To view a list of existing users.

**Example 4: Listing users**

```
$ curl -u "admin:changeit" -s https://cluster_node_1:8091/user | python -m json.tool
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
                    "AddRemoveNode",
                    "DropDatabase",
                    "DropData",
                    "ReadData",
                    "WriteData",
                    "Rebalance",
                    "ManageShard",
                    "ManageContinuousQuery",
                    "ManageQuery",
                    "ManageSubscription",
                    "Monitor",
                    "CopyShard",
                    "KapacitorAPI",
                    "KapacitorConfigAPI"
                ]
            }
        }
    ]
}
...            
```

Transactions that modify the user store are initiated using HTTP POST and must
be sent to the lead node in the Influxd-Meta raft.  If when POSTing a request the
node returns a 307 redirect message, try resending the request to the lead node
indicated by the `Location` field in the HTTP header.

**Example 5: Creating a user against a follower node**

```
$ curl -u "admin:changeit" -s -v -d '{"action":"create","user":{"name":"phantom2","password":"changeit"}}' https://cluster_node_2:8091/user
*   Trying 172.31.16.140...
* Connected to cluster_node_2 (172.31.16.140) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_2 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_2
* 	 start date: Tue, 27 Mar 2018 12:34:09 GMT
* 	 expire date: Thu, 26 Mar 2020 12:34:09 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
* Server auth using Basic with user 'admin'
> POST /user HTTP/1.1
> Host: cluster_node_2:8091
> Authorization: Basic YWRtaW46Y2hhbmdlaXQ=
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 68
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 68 out of 68 bytes
< HTTP/1.1 307 Temporary Redirect
< Influxdb-Metaindex: 33402
< Location: https://cluster_node_1:8091/user
< Request-Id: b7489b68-38c4-11e8-9cf7-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 11:30:17 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

To create a new user against the lead node.  

**Example 6: Creating a user against the lead node**

```
$ curl -u "admin:changeit" -s -v -d '{"action":"create","user":{"name":"phantom","password":"changeit"}}' https://cluster_node_1:8091/user
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
* Server auth using Basic with user 'admin'
> POST /user HTTP/1.1
> Host: cluster_node_1:8091
> Authorization: Basic YWRtaW46Y2hhbmdlaXQ=
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 68
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 68 out of 68 bytes
< HTTP/1.1 200 OK
< Request-Id: 6711760c-38c4-11e8-b7ff-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 11:28:02 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

To get a user details document.

**Example 7: Retrieving a user details document**

```
$ curl --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/user?name=phantom | python -m json.tool
{
    "users": [
        {
            "hash": "$2a$10$hR.Ih6DpIHUaynA.uqFhpOiNUgrADlwg3rquueHDuw58AEd7zk5hC",
            "name": "phantom"
        }
    ]
}
```

To grant permissions to a user.

**Example 8: Granting permissions to a user**

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"add-permissions","user":{"name":"phantom","permissions":{"":["KapacitorAPI","KapacitorConfigAPI"]}}}' https://cluster_node_1:8091/user
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /user HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 111
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 111 out of 111 bytes
< HTTP/1.1 200 OK
< Request-Id: 604141f2-38c6-11e8-bc15-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 11:42:10 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

Verify permission grant.

**Example 9: Verifying user permissions**

```
$ curl --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/user?name=phantom | python -m json.tool
{
    "users": [
        {
            "hash": "$2a$10$hR.Ih6DpIHUaynA.uqFhpOiNUgrADlwg3rquueHDuw58AEd7zk5hC",
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

**Example 10: Removing permissions from a user**

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"remove-permissions","user":{"name":"phantom","permissions":{"":["KapacitorConfigAPI"]}}}' https://cluster_node_1:8091/user
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /user HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 99
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 99 out of 99 bytes
< HTTP/1.1 200 OK
< Request-Id: 1d84744c-38c7-11e8-bd97-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 11:47:27 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

To delete a user.

**Example 11: Removing a user**

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"delete","user":{"name":"phantom2"}}' https://cluster_node_1:8091/user
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /user HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 46
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 46 out of 46 bytes
< HTTP/1.1 200 OK
< Request-Id: 8dda5513-38c7-11e8-be84-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 11:50:36 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

To verify user has been removed.

**Example 12: Verifying user removal**

```
$ curl --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/user?name=phantom
{"error":"user not found"}
```

#### Roles

The Influxd-Meta API provides an endpoint `/role` for managing roles.

To list roles.

**Example 13: Listing roles**

```
$ curl --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/role | python -m json.tool
{}
```

In a fresh installation no roles will have been created yet. As when creating a
user the lead node must be used.

To create a role.

**Example 14: Creating a role**

```
$ curl --negotiate -u "admin:changeit"  -v -d '{"action":"create","role":{"name":"spectre"}}' https://cluster_node_1:8091/role
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /role HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 45
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 45 out of 45 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 33408
< Request-Id: 733b3294-38c8-11e8-805f-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 11:57:01 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

Verify the role has been created.

**Example 15: Verifying roles**

```
$ curl --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/role | python -m json.tool
{
    "roles": [
        {
            "name": "djinn",
        },
        {
            "name": "spectre"
        },
    ]
}

```

Retrieve a record for a single node.

**Example 16: Retrieving a role document**

```
curl --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/role?name=spectre | python -m json.tool
{
   "roles": [
       {
           "name": "spectre"
       }
   ]
}
```

Add permissions to a role.

**Example 17: Adding permissions to a role**

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"add-permissions","role":{"name":"spectre","permissions":{"":["KapacitorAPI","KapacitorConfigAPI"]}}}' https://cluster_node_1:8091/role
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /role HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 111
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 111 out of 111 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 33412
< Request-Id: 603934f5-38c9-11e8-8252-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 12:03:38 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

Verify permissions have been added.

**Example: Verifying role permissions**

```
$ curl --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/role?name=spectre | python -m json.tool
{
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

**Example 19: Adding a user to a role**

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"add-users","role":{"name":"spectre","users":["phantom"]}}'  https://cluster_node_1:8091/role
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /role HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 68
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 68 out of 68 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 33413
< Request-Id: 2f3f4310-38ca-11e8-83f4-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 12:09:26 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

Verify user has been added to role.

**Example 20: Verifying user in role**

```
$ curl --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/role?name=spectre | python -m json.tool
{
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

**Example 21: Removing a user from a role**

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"remove-users","role":{"name":"spectre","users":["phantom"]}}' https://admin:changeit@cluster_node_1:8091/role
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /role HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 71
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 71 out of 71 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 33414
< Request-Id: 840896df-38ca-11e8-84a9-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 12:11:48 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

Remove a permission from a role.

**Example 22: Removing a permission from a role**

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"remove-permissions","role":{"name":"spectre","permissions":{"":["KapacitorConfigAPI"]}}}' https://cluster_node_1:8091/role
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /role HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 99
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 99 out of 99 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 33415
< Request-Id: a1d9a3e4-38ca-11e8-84f0-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 12:12:38 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

Delete a role.

**Example 23: Deleting a role**

```
$ curl --negotiate -u "admin:changeit" -s -v -d '{"action":"delete","role":{"name":"spectre"}}' https://cluster_node_1:8091/role
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /role HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 45
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 45 out of 45 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 33416
< Request-Id: c9ae3c8b-38ca-11e8-8546-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 12:13:45 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

Verify role no longer exists.

**Example 24: Verifying role deletion**

```
$ curl --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/role?name=spectre | python -m json.tool
{
    "error": "role not found"
}
```
### Kapacitor user and privilege management using Chronograf

See [Kapacitor user and privilege management](/chronograf/v1.4/administration/kapacitor-user-privilege-management/) in the Chronograf documentation.

