"use strict";

angular.module("jtt_aping_codebird")
    .service('apingCodebirdHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
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
            if (_item) {
                if (_item.media_url_https) {
                    return this.getBigImageUrlFromSmallImageUrl(_item.media_url_https);
                }
                if (_item.media_url) {
                    return this.getBigImageUrlFromSmallImageUrl(_item.media_url);
                }
            }
            return undefined;
        };
        this.getImageUrlFromUserObject = function (_item) {
            if (_item) {
                if (_item.profile_image_url_https) {
                    return this.getBigImageUrlFromSmallImageUrl(_item.profile_image_url_https);
                }
                if (_item.profile_image_url) {
                    return this.getBigImageUrlFromSmallImageUrl(_item.profile_image_url);
                }
            }
            return undefined;
        };

        this.getImagesObjectFromMediaObject = function (_item) {
            var returnObject = {
                thumb_url: undefined,
                thumb_width: undefined, // best case 200px (min)
                thumb_height: undefined,
                img_url: undefined,
                img_width: undefined, // best case 700px
                img_height: undefined,
                native_url: undefined,
                native_width: undefined,
                native_height: undefined,
            };

            var baseUrl = this.getImageUrlFromMediaObject(_item);

            if (_item.sizes) {
                if (typeof _item.sizes['small'] !== "undefined") {
                    returnObject.thumb_url = baseUrl + ":small";
                    returnObject.thumb_width = _item.sizes['small'].w || undefined;
                    returnObject.thumb_height = _item.sizes['small'].h || undefined;
                } else {
                    returnObject.thumb_url = baseUrl;
                }

                if (typeof _item.sizes['medium'] !== "undefined") {
                    returnObject.img_url = baseUrl + ":medium";
                    returnObject.img_width = _item.sizes['medium'].w || undefined;
                    returnObject.img_height = _item.sizes['medium'].h || undefined;
                } else {
                    returnObject.img_url = baseUrl;
                }

                if (typeof _item.sizes['large'] !== "undefined") {
                    returnObject.native_url = baseUrl + ":large";
                    returnObject.native_width = _item.sizes['large'].w || undefined;
                    returnObject.native_height = _item.sizes['large'].h || undefined;
                } else {
                    returnObject.native_url = baseUrl;
                }
            }

            return returnObject;
        };

        this.getObjectByJsonData = function (_data, _helperObject) {

            var requestResults = [];
            if (_data) {
                var _this = this;

                if (_data.statuses) {

                    angular.forEach(_data.statuses, function (value, key) {
                        var tempResult = _this.getItemByJsonData(value, _helperObject);
                        if (tempResult) {
                            requestResults.push(tempResult);
                        }
                    });
                } else if (_data.length > 0) {
                    angular.forEach(_data, function (value, key) {
                        var tempResult = _this.getItemByJsonData(value, _helperObject);
                        if (tempResult) {
                            requestResults.push(tempResult);
                        }
                    });
                }

            }

            return requestResults;
        };

        this.getItemByJsonData = function (_item, _helperObject) {
            var returnObject = {};
            if (_item && _helperObject.model) {

                if (_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                    returnObject = this.getNativeItemByJsonData(_item, _helperObject.model);
                } else {
                    switch (_helperObject.model) {
                        case "social":
                            returnObject = this.getSocialItemByJsonData(_item, _helperObject);
                            break;

                        case "image":
                            returnObject = this.getImageItemByJsonData(_item, _helperObject);
                            break;

                        default:
                            return false;
                    }
                }
            }
            return returnObject;
        };

        this.getSocialItemByJsonData = function (_item, _helperObject) {
            var socialObject = apingModels.getNew("social", this.getThisPlattformString());

            angular.extend(socialObject, {
                blog_name: _item.user.screen_name,
                blog_id: _item.user.id_str,
                blog_link: this.getThisPlattformLink() + _item.user.screen_name + "/",
                intern_id: _item.id_str,
                timestamp: new Date(Date.parse(_item.created_at.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/, "$1 $2 $4 $3 UTC"))).getTime(),
                text: _item.text,
                shares: _item.retweet_count,
                likes: _item.favorite_count,
            });

            if(socialObject.timestamp) {
                socialObject.date_time = new Date(socialObject.timestamp);
            }

            if (_item.entities && _item.entities.media && _item.entities.media.length > 0) {

                socialObject.source = _item.entities.media;

                var tempImageArray = this.getImagesObjectFromMediaObject(_item.entities.media[0]);

                tempImageArray.thumb_width = undefined;
                tempImageArray.thumb_height = undefined;
                tempImageArray.img_width = undefined;
                tempImageArray.img_height = undefined;
                tempImageArray.native_width = undefined;
                tempImageArray.native_height = undefined;

                angular.extend(socialObject, tempImageArray);

                if (!socialObject.img_url) {
                    socialObject.img_url = this.getImageUrlFromMediaObject(_item.entities.media[0]);
                }
            }

            if (socialObject.img_url) {
                socialObject.type = "image";
            } else {
                socialObject.type = "tweet";
                if (_item.user && (_helperObject.showAvatar === true || _helperObject.showAvatar === 'true' )) {
                    socialObject.img_url = this.getImageUrlFromUserObject(_item.user);
                }
            }

            socialObject.post_url = socialObject.blog_link + "status/" + socialObject.intern_id;

            return socialObject;
        };

        this.getImageItemByJsonData = function (_item) {
            var imageObject = apingModels.getNew("image", this.getThisPlattformString());

            angular.extend(imageObject, {
                blog_name: _item.user.screen_name,
                blog_id: _item.user.id_str,
                blog_link: this.getThisPlattformLink() + _item.user.screen_name + "/",
                intern_id: _item.id_str,
                timestamp: new Date(Date.parse(_item.created_at.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/, "$1 $2 $4 $3 UTC"))).getTime(),
                text: _item.text,
                shares: _item.retweet_count,
                likes: _item.favorite_count,
            });

            if(imageObject.timestamp) {
                imageObject.date_time = new Date(imageObject.timestamp);
            }

            if (_item.entities && _item.entities.media && _item.entities.media.length > 0) {

                imageObject.source = _item.entities.media;

                var tempImageArray = this.getImagesObjectFromMediaObject(_item.entities.media[0]);
                angular.extend(imageObject, tempImageArray);

                if (!imageObject.img_url) {
                    imageObject.img_url = this.getImageUrlFromMediaObject(_item.entities.media[0]);
                }
            }

            if (!imageObject.img_url) {
                return false;
            }

            imageObject.post_url = imageObject.blog_link + "status/" + imageObject.intern_id;

            return imageObject;
        };

        this.getNativeItemByJsonData = function (_item, _model) {

            var nativeItem = {};

            switch (_model) {
                case "image":
                    if (!_item.entities || !_item.entities.media || !_item.entities.media.length > 0 || !this.getImageUrlFromMediaObject(_item.entities.media[0])) {
                        return false;
                    } else {
                        nativeItem = _item;
                    }
                    break;
            }

            nativeItem = _item;

            return nativeItem;
        }
    }]);