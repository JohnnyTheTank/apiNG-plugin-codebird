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

                    var codebirdSettings = {
                        showAvatar : request.showAvatar || false,
                    };

                    if(request.search) {

                        //https://dev.twitter.com/rest/reference/get/search/tweets
                        var params = {
                            q: request.search,
                            result_type: request.result_type || "mixed",
                            count:request.items || appSettings.items,
                        };

                        cb.__call(
                            "search_tweets",
                            params,
                            function (_data) {
                                apingController.concatToResults(apingCodebirdHelper.getObjectByJsonData(_data, appSettings.model, codebirdSettings));
                                apingController.apply();
                            },
                            true
                        );

                    } else if(request.user) {
                        //https://dev.twitter.com/rest/reference/get/statuses/user_timeline
                        var params = {
                            screen_name: request.user,
                            contributor_details: true,
                            count: request.items || appSettings.items
                        };

                        if(request.exclude_replies === true || request.exclude_replies === "true"){
                            params.exclude_replies = true;
                        }

                        if(request.include_rts === false || request.include_rts === "false"){
                            params.include_rts = false;
                        }

                        cb.__call(
                            "statuses_userTimeline",
                            params,
                            function (_data, rate, err) {
                                apingController.concatToResults(apingCodebirdHelper.getObjectByJsonData(_data, appSettings.model, codebirdSettings));
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