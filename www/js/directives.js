
(function () {

    "use strict";

    angular.module('Dreamchat.directives', [])
        .directive('map', function () {

            return {

                restrict: "E",
                scope: {

                    onCreate: '&'
                },
                link: function ($scope, $element, $attr) {

                    var initialize = function () {

                        var latitude = $attr.latitude || 43.07493;
                        var longitude = $attr.longitude ||-89.381388;
                        var myLatitudeLong  =  new google.maps.LatLng(latitude, longitude);
                        var mapOptions = {

                            center: myLatitudeLong,
                            zoom: 16,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        }

                        if($attr.inline){

                            mapOptions.disableDefaultUI = true;
                            mapOptions.disableDoubleClickZoom = true;
                            mapOptions.draggable = true;
                            mapOptions.mapMaker = true;
                            mapOptions.mapTypeControl = false;
                            mapOptions.panControl = false;
                            mapOptions.rotateControl = false;
                        }

                        var map = new google.maps.Map($element[0], mapOptions);

                        //custom function to manage markers
                        map._setMarker = function (map, latitude, longitude) {

                            var marker = new google.maps.Marker({
                                map: map,
                                position: new google.maps.LatLng(latitude, longitude)
                            });

                        }

                        $scope.onCreate({

                            map: map
                        });

                        map._setMarker(map, latitude, longitude);

                        if(document.readyState === "complete"){

                            initialize();
                        } else {

                            google.maps.event.addDomListener(window, 'load', initialize)
                        }

                    }

                }
            }

        });


})();

