[logo]: http://aping.io/logo/320/aping-plugin.png "apiNG Plugin"
![apiNG][logo]

**_apiNG-plugin-codebird_** is a [Twitter REST API](https://dev.twitter.com/rest/public) plugin for [**apiNG**](https://github.com/JohnnyTheTank/apiNG).

[![Join the chat at https://gitter.im/JohnnyTheTank/apiNG](https://img.shields.io/badge/GITTER-join%20chat-green.svg)](https://gitter.im/JohnnyTheTank/apiNG?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/aping-plugin-codebird.png)](https://badge.fury.io/js/aping-plugin-codebird)
[![Bower version](https://badge.fury.io/bo/apiNG-plugin-codebird.png)](https://badge.fury.io/bo/apiNG-plugin-codebird)

# Information
* **Supported apiNG models: `social`, `image`**
* This plugin supports the [`get-native-data` parameter](https://aping.readme.io/docs/advanced#parameters)
* This plugin needs an [bearer token](#2-bearer-token) :warning:
* Used JavaScript library: [codebird-js](https://github.com/jublonet/codebird-js) _(included in distribution files)_

# Documentation
1. [INSTALLATION](#1-installation)
    1. Get file
    2. Include file
    3. Add dependency
    4. Add plugin
2. [BEARER TOKEN](#2-bearer-token)
    1. Generate your `bearer_token`
    2. Insert your `bearer_token` into `aping-config.js`
3. [USAGE](#3-usage)
    1. Models
    2. Requests
    3. Rate limit

## 1. INSTALLATION

### I. Get file
Install via either [bower](http://bower.io/), [npm](https://www.npmjs.com/), CDN (jsDelivr) or downloaded files:

* `bower install apiNG-plugin-codebird --save`
* `npm install aping-plugin-codebird --save`
* use [CDN file](https://www.jsdelivr.com/projects/aping.plugin-codebird)
* download [apiNG-plugin-codebird.zip](https://github.com/JohnnyTheTank/apiNG-plugin-codebird/zipball/master)

### II. Include file
Include `aping-plugin-codebird.min.js` in your apiNG application

```html
<!-- when using bower -->
<script src="bower_components/apiNG-plugin-codebird/dist/aping-plugin-codebird.min.js"></script>

<!-- when using npm -->
<script src="node_modules/aping-plugin-codebird/dist/aping-plugin-codebird.min.js"></script>

<!-- when using cdn file -->
<script src="//cdn.jsdelivr.net/aping.plugin-codebird/latest/aping-plugin-codebird.min.js"></script>

<!-- when using downloaded files -->
<script src="aping-plugin-codebird.min.js"></script>
```

### III. Add dependency
Add the module `jtt_aping_codebird` as a dependency to your app module:
```js
angular.module('app', ['jtt_aping', 'jtt_aping_codebird']);
```

### IV. Add the plugin
Add the plugin's directive `aping-codebird="[]"` to your apiNG directive and [configure your requests](#ii-requests)
```html
<aping
    template-url="templates/social.html"
    model="social"
    items="20"
    aping-codebird="[{'search':'#music'}]">
</aping>
```

## 2. BEARER TOKEN
### I. Generate your `bearer_token`
1. Login on [dev.twitter.com](https://dev.twitter.com/)
2. Navigate to [apps.twitter.com](https://apps.twitter.com/)
    - Create an new app
    - Navigate to `https://apps.twitter.com/app/<YOUR_APP_ID>/permissions`
        - Change Access to **Read only** and save
    - Navigate to `https://apps.twitter.com/app/<YOUR_APP_ID>` 
3. Get your `bearer_token`
    - Follow this official introductions: https://dev.twitter.com/oauth/reference/post/oauth2/token
    - OR just use this simple generator: https://gearside.com/nebula/documentation/utilities/twitter-bearer-token-generator/

### II. Insert your `bearer_token` into `aping-config.js`
Create and open `js/apiNG/aping-config.js` in your application folder. It should be look like this snippet:
```js
angular.module('jtt_aping').config(['$provide', function ($provide) {
    $provide.value("apingDefaultSettings", {
        apingApiKeys : {
            twitter: [
                {'bearer_token':'<YOUR_TWITTER_BEARER_TOKEN>'}
            ],
            //...
        }
    });
}]);
```

:warning: Replace `<YOUR_TWITTER_BEARER_TOKEN>` with your twitter `bearer_token`

## 3. USAGE

### I. Models
Supported apiNG models

|  model   | content | support | max items<br>per request | (native) default items<br>per request |
|----------|---------|---------|--------|---------|
| `social` | recent **tweets**, **videos**, **images** | full    | `100`   | `15`   |
| `image`  | recent **images** | partly    | `100`   | `15`   |

**support:**
* full: _the source platform provides a full list with usable results_ <br>
* partly: _the source platfrom provides just partly usable results_


### II. Requests
Every **apiNG plugin** expects an array of **requests** as html attribute.

#### Requests by User
|  parameter  | sample | default | description | optional |
|----------|---------|---------|---------|---------|
| **`user`** | `jquery` |  | The twitter screen name of the user for whom to return results for | no |
| **`items`**  | `20` | `15` | Items per request (`0`-`100`) |  yes  |
| **`showAvatar`** | `true` | `false` | Use `true` for show users avatar as image if post has no own image | yes |
| **`exclude_replies`** | `true` | `false` | This parameter will prevent replies from appearing in the returned timeline. Using exclude_replies with the `items` parameter will mean you will receive up-to count tweets — this is because the `items` parameter retrieves that many tweets before filtering out retweets and replies. | yes |
| **`include_rts`** | `false` | `true` | When set to `false`, the timeline will strip any native retweets (though they will still count toward both the maximal length of the timeline and the slice selected by the count parameter). | yes |

Sample requests:
* `[{'user':'johnnyzeitlos'}, {'user':'jowe'}, {'user':'angularui'}]`
* `[{'user':'AngularAir', 'items':10, 'showAvatar':'true', 'exclude_replies':true}]`

#### Requests by Search
|  parameter  | sample | default | description | optional |
|----------|---------|---------|---------|---------|
| **`search`** | `jquery` |  | Searchterm. A UTF-8, URL-encoded [search query](https://dev.twitter.com/rest/public/search) of 500 characters maximum, including operators. Queries may additionally be limited by complexity. | no |
| **`items`**  | `20` | `15` | Items per request (`0`-`100`) |  yes  |
| **`showAvatar`** | `true` | `false` | Use `true` for show users avatar as image if post has no own image | yes |
| **`result_type`** | `recent` | `mixed` | `mixed` include both popular and real time results in the response<br>`recent` return only the most recent results in the response<br>`popular` return only the most popular results in the response | yes |
| **`lat`** | `-13.163333` |  | Returns tweets by users located within a given radius of the given **latitude**/longitude | yes |
| **`lng`** | `-72.545556` |  | Returns tweets by users located within a given radius of the given latitude/**longitude** | yes |
| **`distance`** | `5` | `1` | Returns tweets by users located within a given **radius in kilometers** of the given latitude/longitude | yes |
| **`language`** | `de` | | Restricts tweets to the given language, given by an [ISO 639-1](http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code | yes |

Sample requests:
* `[{'search':'#eagles', 'result_type':'recent'}, {'search':'Thomas Müller', 'result_type':'popular'}]`
* `[{'search':'machu picchu', 'lat':'-13.163333', 'lng':'-72.545556', 'distance':5}]`

### III. Rate limit

Visit the official Twitter REST API rate limit documentations
* [Rate Limits](https://dev.twitter.com/rest/public/rate-limiting)
* [Rate Limits: Chart](https://dev.twitter.com/rest/public/rate-limits)

# Licence
MIT

