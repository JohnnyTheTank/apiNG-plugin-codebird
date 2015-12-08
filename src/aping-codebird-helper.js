"use strict";

/**
 @author Jonathan Hornung (https://github.com/JohnnyTheTank)
 @url https://github.com/JohnnyTheTank/apiNG-plugin-codebird
 @licence MIT
 */

jjtApingCodebird.service('apingCodebirdHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
    this.getThisPlattformString = function () {
        return "twitter";
    };

    this.getThisPlattformLink = function () {
        return "https://twitter.com/";
    };
    this.getBigImageUrlFromSmallImageUrl = function (_smallImageUrl) {
        return _smallImageUrl.replace("_normal", "");
    };
    this.getImageUrlFromMediaObject = function (_item) {
        if(_item) {
            if(_item.media_url_https) {
                return this.getBigImageUrlFromSmallImageUrl(_item.media_url_https);
            }
            if(_item.media_url) {
                return this.getBigImageUrlFromSmallImageUrl(_item.media_url);
            }
        }
        return false;
    };
    this.getImageUrlFromUserObject = function (_item) {
        if(_item) {
            if(_item.profile_image_url_https) {
                return this.getBigImageUrlFromSmallImageUrl(_item.profile_image_url_https);
            }
            if(_item.profile_image_url) {
                return this.getBigImageUrlFromSmallImageUrl(_item.profile_image_url);
            }
        }
        return false;
    };

    this.getObjectByJsonData = function (_data, _model, _codebirdSettings) {

        var requestResults = [];
        if (_data) {
            var _this = this;

            if (_data.statuses) {

                angular.forEach(_data.statuses, function (value, key) {
                    var tempResult = _this.getItemByJsonData(value, _model, _codebirdSettings);
                    if(tempResult) {
                        requestResults.push(tempResult);
                    }
                });
            } else if (_data.length > 0) {
                angular.forEach(_data, function (value, key) {
                    var tempResult = _this.getItemByJsonData(value, _model, _codebirdSettings);
                    if(tempResult) {
                        requestResults.push(tempResult);
                    }
                });
            }

        }

        return requestResults;
    };

    this.getItemByJsonData = function (_item, _model, _codebirdSettings) {
        var returnObject = {};
        if (_item && _model) {
            switch (_model) {
                case "social":
                    returnObject = this.getSocialItemByJsonData(_item, _codebirdSettings);
                    break;

                case "image":
                    returnObject = this.getImageItemByJsonData(_item, _codebirdSettings);
                    break;

                default:
                    return false;
            }
        }
        return returnObject;
    };

    this.getSocialItemByJsonData = function (_item, _codebirdSettings) {
        var socialObject = apingModels.getNew("social", this.getThisPlattformString());

        $.extend(true, socialObject, {
            blog_name: _item.user.screen_name,
            blog_id: _item.user.id_str,
            blog_link: this.getThisPlattformLink() + _item.user.screen_name + "/",
            intern_id: _item.id_str,
            timestamp: new Date(Date.parse(_item.created_at.replace(/( \+)/, ' UTC$1'))).getTime(),
            text: _item.text,
            shares: _item.retweet_count,
            likes: _item.favorite_count,
        });

        if(_item.entities && _item.entities.media && _item.entities.media.length>0) {
            socialObject.source = _item.entities.media;
            socialObject.img_url = this.getImageUrlFromMediaObject(_item.entities.media[0]);
        }

        if(socialObject.img_url) {
            socialObject.type = "image";
        } else {
            socialObject.type = "tweet";
            if(_item.user && (_codebirdSettings.showAvatar === true || _codebirdSettings.showAvatar === 'true' ) ) {
                socialObject.img_url = this.getImageUrlFromUserObject(_item.user);
            }
        }

        socialObject.post_url = socialObject.blog_link+"status/"+socialObject.intern_id;

        return socialObject;
    };

    this.getImageItemByJsonData = function (_item) {
        var imageObject = apingModels.getNew("image", this.getThisPlattformString());

        $.extend(true, imageObject, {
            blog_name: _item.user.screen_name,
            blog_id: _item.user.id_str,
            blog_link: this.getThisPlattformLink() + _item.user.screen_name + "/",
            intern_id: _item.id_str,
            timestamp: new Date(Date.parse(_item.created_at.replace(/( \+)/, ' UTC$1'))).getTime(),
            text: _item.text,
            shares: _item.retweet_count,
            likes: _item.favorite_count,
        });

        if(_item.entities && _item.entities.media && _item.entities.media.length>0) {
            imageObject.source = _item.entities.media;
            imageObject.img_url = this.getImageUrlFromMediaObject(_item.entities.media[0]);
        }

        if(!imageObject.img_url) {
            return false;
        }

        imageObject.post_url = imageObject.blog_link+"status/"+imageObject.intern_id;

        return imageObject;
    }



}]);