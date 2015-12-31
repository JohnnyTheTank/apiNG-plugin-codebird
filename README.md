[logo]: http://aping.io/logo/320/aping-plugin.png "apiNG Plugin"
![apiNG][logo]

**_apiNG-plugin-codebird_** is a [Twitter REST API](https://dev.twitter.com/rest/public) plugin for [**apiNG**](https://github.com/JohnnyTheTank/apiNG).

# Information
* **Supported apiNG models: `social`, `image`**
* Used JavaScript library: [codebird-js](https://github.com/jublonet/codebird-js) _(included in minified distribution file)_

# Documentation
    I.   INSTALLATION
    II.  BEARER TOKEN
    III. USAGE

## I. INSTALLATION
    a) Get files
    b) Include files
    c) Add dependencies
    d) Add the plugin

### a) Get files
You can choose your preferred method of installation:

* Via bower: `bower install apiNG-plugin-codebird --save`
* Download from github: [apiNG-plugin-codebird.zip](https://github.com/JohnnyTheTank/apiNG-plugin-codebird/zipball/master)

### b) Include files
Include `apiNG-plugin-codebird.min.js` in your apiNG application
```html
<script src="bower_components/apiNG-plugin-codebird/dist/apiNG-plugin-codebird.min.js"></script>
```

### c) Add dependencies
Add the module `jtt_aping_codebird` as a dependency to your app module:
```js
var app = angular.module('app', ['jtt_aping', 'jtt_aping_codebird']);
```

### d) Add the plugin
Add the plugin's directive `aping-codebird="[]"` to your apiNG directive and configure your requests (_**III. USAGE**_)
```html
<aping
    template-url="templates/social.html"
    model="social"
    items="20"
    aping-codebird="[{'search':'#music'}]">
</aping>
```

## II. BEARER TOKEN
    a) Generate your `bearer_token`
    b) Insert your `bearer_token` into `aping-config.js`

### a) Generate your `bearer_token`
1. Login on [dev.twitter.com](https://dev.twitter.com/)
2. Navigate to [apps.twitter.com](https://apps.twitter.com/)
    - Create an new app
    - Navigate to https://apps.twitter.com/app/<YOUR_APP_ID>/permissions
        - Change Access to **Read only** and save
    - Navigate to https://apps.twitter.com/app/<YOUR_APP_ID>
3. Get your `bearer_token`
    - Follow this official introductions: https://dev.twitter.com/oauth/reference/post/oauth2/token
    - OR just use this simple generator: https://gearside.com/nebula/documentation/utilities/twitter-bearer-token-generator/

### b) Insert your `bearer_token` into `aping-config.js`
Open `js/apiNG/aping-config.js` in your application folder. It should be look like this snippet:
```js
apingApp.config(['$provide', function ($provide) {
    $provide.constant("apingApiKeys", {
        //...
        twitter: [
            {'bearer_token':"<YOUR_TWITTER_BEARER_TOKEN>"},
        ],
        //...
    });

    $provide.constant("apingDefaultSettings", {
        //...
    });
}]);
```

:warning: Replace `<YOUR_TWITTER_BEARER_TOKEN>` with your twitter `bearer_token`

## III. USAGE
    a) Models
    b) Requests
    c) Rate limit

### a) Models
Supported apiNG models

|  model   | content | support | max items<br>per request | (native) default items<br>per request |
|----------|---------|---------|--------|---------|
| `social` | recent **tweets**, **videos**, **images** | full    | `100`   | `15`   |
| `image`  | recent **images** | partly    | `100`   | `15`   |

**support:**
* full: _the source platform provides a full list with usable results_ <br>
* partly: _the source platfrom provides just partly usable results_


### b) Requests
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
* `[{'user':'AngularAir', 'items':10, 'showAvatar':'true', 'exclude_replies':'true'}]`

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
* `[{'search':'machu picchu', 'lat':'-13.163333', 'lng':'-72.545556', 'distance':5, 'result_type':'recent'}]`

### c) Rate limit

Visit the official Twitter REST API rate limit documentations
* [Rate Limits](https://dev.twitter.com/rest/public/rate-limiting)
* [Rate Limits: Chart](https://dev.twitter.com/rest/public/rate-limits)

# Licence
MIT

