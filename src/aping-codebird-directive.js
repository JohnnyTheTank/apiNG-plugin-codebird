"use strict";

/**
 @author Jonathan Hornung (https://github.com/JohnnyTheTank)
 @url https://github.com/JohnnyTheTank/apiNG-plugin-codebird
 @licence MIT
 */

var jjtApingCodebird = angular.module("jtt_aping_codebird", [])
    .directive('apingCodebird', ['apingCodebirdHelper', 'apingUtilityHelper', function (apingCodebirdHelper, apingUtilityHelper) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController, interval) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingCodebird, apingCodebirdHelper.getThisPlattformString(), appSettings);

                var cb = new Codebird;

                cb.setBearerToken(apingUtilityHelper.getApiCredentials(apingCodebirdHelper.getThisPlattformString(), "bearer_token"));

                requests.forEach(function (request) {

                    //create helperObject for helper function call
                    var helperObject = {
                        model: appSettings.model,
                        showAvatar : request.showAvatar || false,
                    };
                    if(typeof appSettings.getNativeData !== "undefined") {
                        helperObject.getNativeData = appSettings.getNativeData;
                    } else {
                        helperObject.getNativeData = false;
                    }

                    //create requestObject for api request call
                    var requestObject = {};
                    if(typeof request.items !== "undefined") {
                        requestObject.count = request.items;
                    } else {
                        requestObject.count = appSettings.items;
                    }

                    if(requestObject.count == 0) {
                        return false;
                    }

                    // -1 is "no explicit limit". same for NaN value
                    if(requestObject.count < 0 || isNaN(requestObject.count)) {
                        requestObject.count = undefined;
                    }

                    // the api has a limit of 100 items per request
                    if(requestObject.count > 100) {
                        requestObject.count = 100;
                    }

                    if(request.search) {
                        // https://dev.twitter.com/rest/reference/get/search/tweets
                        requestObject.q = request.search;
                        requestObject.result_type = request.result_type || "mixed";

                        if(typeof request.lat !== "undefined" && typeof request.lng !== "undefined") {
                            requestObject.geocode = request.lat+","+request.lng+","+(request.distance || "1" )+"km";
                        }

                        if(typeof request.language !== "undefined") {
                            requestObject.lang = request.language;
                        }

                        cb.__call(
                            "search_tweets",
                            requestObject,
                            function (_data) {
                                apingController.concatToResults(apingCodebirdHelper.getObjectByJsonData(_data, helperObject));
                                apingController.apply();
                            },
                            true
                        );

                    } else if(request.user) {
                        // https://dev.twitter.com/rest/reference/get/statuses/user_timeline

                        requestObject.screen_name = request.user;
                        requestObject.contributor_details = true;

                        if(request.exclude_replies === true || request.exclude_replies === "true"){
                            requestObject.exclude_replies = true;
                        }

                        if(request.include_rts === false || request.include_rts === "false"){
                            requestObject.include_rts = false;
                        }

                        cb.__call(
                            "statuses_userTimeline",
                            requestObject,
                            function (_data, rate, err) {
                                apingController.concatToResults(apingCodebirdHelper.getObjectByJsonData(_data, helperObject));
                                apingController.apply();
                            },
                            true
                        );
                    } else {
                        return false;
                    }
                });
            }
        }
    }]);