"use strict";
apingApp.config(['$provide', function ($provide) {
    $provide.value("apingDefaultSettings", {
        apingApiKeys: {
            //...
            twitter: [
                {'bearer_token':'<YOUR_TWITTER_BEARER_TOKEN>'},
            ],
            //...
        }
    });
}]);
