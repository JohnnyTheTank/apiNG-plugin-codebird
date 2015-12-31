"use strict";
apingApp.config(['$provide', function ($provide) {

    $provide.constant("apingApiKeys", {
        twitter: [
            {'bearer_token':'<YOUR_TWITTER_BEARER_TOKEN>'},
        ],
    });

    $provide.constant("apingDefaultSettings", {
        templateUrl : "aping_design_sample.html",
        items : 5, //items per request
        maxItems: 100, //max items per aping
        orderBy : "timestamp",
        orderReverse : "true",
        model: "social",
        getNativeData: false,
    });

}]);