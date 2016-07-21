

var app = angular.module('myapp', ['ngRoute']);
app.config(function($httpProvider, $interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
});
app.controller('MainCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    console.log('controller');

    var clipboard = new Clipboard('.btn');
    clipboard.on('success', function(e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
        $('#clipboard-pointing-label').css('display', 'inline-block');
    });

    $scope.init_map_geo = function(position) {
        console.log(position.coords.latitude, position.coords.longitude);

        var map_geo = new naver.maps.Map('map_geo', {
            center: new naver.maps.LatLng(position.coords.latitude, position.coords.longitude),
            zoom: 10
        });

        var marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(position.coords.latitude, position.coords.longitude),
            map: map_geo
        });
    };

    $scope.init_map_cluster = function() {
        new MapWrap();
    };

    $scope.init = function() {
        $scope.init_map_cluster();

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                $scope.init_map_geo(position);
            });
        } else {
            alert('이 브라우저는 Geolocation을 지원하지 않습니다');
        }
    };

    $scope.init();
}]);

function MapWrap() {
    this.icon_url = 'https://ssl.pstatic.net/static/maps/mantle/1x/marker-default.png';
    this.marker_positions = {
        '서울우면초등학교': [37.4648805, 127.0238376, [
            '<div class="c-info-wrap">',
            '    <span style="background-image: url(/static/img/우면.jpg)" class="list-cover has-image"></span>',
            '    <h5>서울우면초등학교</h5>',
            '    <p>서울특별시 서초구 태봉로 59</p>',
            '</div>'
        ]],
        '매헌초등학교': [37.4708922, 127.0418558, [
            '<div class="c-info-wrap">',
            '    <span style="background-image: url(/static/img/매헌.jpg)" class="list-cover has-image"></span>',
            '    <h5>매헌초등학교</h5>',
            '    <p>서울특별시 서초구 언남길 8</p>',
            '</div>'
        ]],
        '언남고등학교': [37.4730855, 127.0441792, [
            '<div class="c-info-wrap">',
            '    <span style="background-image: url(/static/img/언남.jpg)" class="list-cover has-image"></span>',
            '    <h5>언남고등학교</h5>',
            '    <p>서울특별시 서초구 동산로13길 35</p>',
            '</div>'

        ]],
    };

    this.map = null;
    this.bounds = null;
    this.markers = [];
    this.intersectMarkers = [];
    this.markersMap = {};
    this.infoWindow = null;
    this.rectangles = [];
    this.circles = [];
    this.init();
}
MapWrap.prototype = {
    init: function() {
        var self = this;

        var key = document.location.hostname.replace(/(^\s*)|(\s*$)|\./g, '');
        var clientId = {
            localhost: 'csgvJKLnW5XA63QGVDL6',
            yungyikimcom: 'vqE2e4NqqbLcq_1kv9Ug',
            wwwyungyikimcom: 'vqE2e4NqqbLcq_1kv9Ug',
        };
        var mapUrl = 'https://openapi.map.naver.com/openapi/v3/maps.js?clientId='+clientId[key];
        console.log(mapUrl);
        jQuery.getScript(mapUrl, function() {
            self.map = new naver.maps.Map('map_cluster', {
                center: new naver.maps.LatLng(self.marker_positions['서울우면초등학교'][0], self.marker_positions['서울우면초등학교'][1]),
                zoom: 7
            });

            naver.maps.Event.addListener(self.map, 'zoom_changed', function() {
                console.log('zoom_changed');
                self.update();
            });

            self.update();

            self.infoWindow = new naver.maps.InfoWindow({
                content: self.marker_positions[self.markers[0].title][2].join(''),
                maxWidth: 300,
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                borderWidth: 0,
                anchorSize: new naver.maps.Size(20, 18)
            });
            self.infoWindow.open(self.map, self.markers[0]);
        });
    },
    clear: function() {
        console.log(this.intersectMarkers);

        for (var i=0; i<this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        for (i=0; i<this.intersectMarkers.length; i++) {
            this.intersectMarkers[i].setMap(null);
        }

        this.markers.length = 0;
        this.markersMap = {};
        this.intersectMarkers.length = 0;

        if (this.infoWindow && this.infoWindow.getMap()) {
            this.infoWindow.close();
            this.infoWindow = null;
        }

    },
    update: function() {
        this.clear();
        this.updateMarkers();
        this.updateIntersectMarkers();
    },
    updateMarkers: function() {
        var self = this;
        for (var key in this.marker_positions) {
            var marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(this.marker_positions[key][0], this.marker_positions[key][1]),
                title: key,
                icon: {
                    url: this.icon_url,
                    size: new naver.maps.Size(22, 33),
                    anchor: new naver.maps.Point(12, 37),
                },
                map: this.map,
                zIndex: 100
            });

            function clickHandler(marker) {
                return function(e) {
                    // 마커를 중심으로 지도 좌표를 이동한다.
                    self.map.panTo(marker.position);
                    console.log(marker);

                    // 이미 열려있는 infowindow가 있다면 닫는다.
                    if (self.infoWindow && self.infoWindow.getMap()) {
                        self.infoWindow.close();
                    }

                    console.log(marker.title);
                    console.log(self.markersMap[marker.title]);
                    console.log(self.marker_positions[marker.title][2].join(''));
                    self.infoWindow = new naver.maps.InfoWindow({
                        content: self.marker_positions[marker.title][2].join(''),
                        maxWidth: 300,
                        backgroundColor: 'transparent',
                        borderColor: 'transparent',
                        borderWidth: 0,
                        anchorSize: new naver.maps.Size(20, 18)
                    });
                    self.infoWindow.open(self.map, marker);
                };
            }
            naver.maps.Event.addListener(marker, 'click', clickHandler(marker));
            this.markers.push(marker);
            this.markersMap[key] = marker;
        }
    },
    updateIntersectMarkers: function() {
        this.updateMarkersIntersectState();
    },
    updateMarkersIntersectState: function() {
        var store = this.getIntersectMarkerStore(this.markers);
        var intersectMarkers = this.getMarkersByStore(store);
        var boundsList = this.getIntersectMarkerBounds(intersectMarkers);
        // 겹치는 마커 제거
        for (var i=0; i<store.length; i++) {
            var titles = store[i];
            for (var j=0; j<titles.length; j++) {
                console.log(titles[j]);
                this.markersMap[titles[j]].setMap(null);
            }
        }
        this.setClusterMarkers(store, boundsList);

    },
    getIntersectMarkerStore: function(markers) {
        var store = [];
        var target, checked, targetBounds, checkedBounds;
        for (var i = 0; i < markers.length; i++) {
            target = markers[i];

            for (var j = 0; j < markers.length; j++) {
                checked = markers[j];

                if (target === checked) continue;
                targetBounds = target.getDrawingRect();
                checkedBounds = checked.getDrawingRect();

                if (targetBounds.intersects(checkedBounds)) {
                    this._inertToIntersectStore(store, target.getTitle(), checked.getTitle());
                }
            }
        }

        return store;
    },
    getMarkersByStore: function(store) {
        var intersectMarkers = [];

        for (var i = 0; i < store.length; i++) {

            intersectMarkers[i] = [];

            for (var j = 0; j < store[i].length; j++) {
                intersectMarkers[i].push(this.markersMap[store[i][j]]);
            }
        }

        return intersectMarkers;
    },
    getIntersectMarkerBounds: function(intersectMarkers) {
        var boundsList = [], bounds;

        for (var i = 0; i < intersectMarkers.length; i++) {

            for (var j = 0; j < intersectMarkers[i].length; j++) {

                if (j === 0) {
                    bounds = intersectMarkers[i][j].getDrawingRect();
                } else {
                    bounds = bounds.union(intersectMarkers[i][j].getDrawingRect());
                }
            }

            bounds = this._pixelBoundsToLatLngBounds(this.map, bounds);
            boundsList.push(bounds);
        }

        return boundsList;
    },
    resetMarkers: function(markers) {
        for (var i = 0; i < this.markers.length; i++) {
            var icon = this.markers[i].getIcon();
            icon.url = this.icon_url;
            this.markers[i].setIcon(icon);
        }
    },
    setClusterMarkers: function(store, boundsList) {
        var self = this;
        var circles = [];
        for (var i=0; i<boundsList.length; i++) {
            var bounds = boundsList[i];
            var x = ((bounds._max.x - bounds._min.x) / 2) + bounds._min.x;
            var y = bounds._max.y - ((bounds._min.y - bounds._max.y) / 2);
            var center = new naver.maps.LatLng(y, x);

            // 겹치는 마커를 대신하는 마커 추가
            var marker = new naver.maps.Marker({
                position: center,
                map: this.map,
                title: 'Green',
                icon: {
                    content: [
                                '<div class="c-marker"><div class="inner"><b>',
                                store[i].length,
                                '</b></div></div>'
                            ].join(''),
                    size: new naver.maps.Size(38, 58),
                    anchor: new naver.maps.Point(19, 58),
                },
                draggable: true
            });
            naver.maps.Event.addListener(marker, 'click', function(marker) {
                var coord = marker.coord;

                // 줌을 두 단계 당긴다.
                var zoom = self.map.getZoom();
                zoom += 2;
                if (zoom > 22) {
                    zoom = 22;
                }
                self.map.setZoom(zoom);

                // 마커를 중심으로 지도 좌표를 이동한다.
                self.map.panTo(coord);
            });
            this.intersectMarkers.push(marker);
        }
    },
    _pixelBoundsToLatLngBounds: function(map, pixelBounds) {
        var zoom = map.getZoom();
        var proj = map.getProjection();
        var min = pixelBounds.getMin();
        var max = pixelBounds.getMax();

        min = proj.scaleDown(min, zoom);
        max = proj.scaleDown(max, zoom);

        min = proj.fromPointToCoord(min);
        max = proj.fromPointToCoord(max);

        return new naver.maps.LatLngBounds(min, max);
    },
    _uniqueArray: function(a) {
        return a.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    },
    _inertToIntersectStore: function(store, value1, value2) {
        var index1 = this._has(store, value1);
        var index2 = this._has(store, value2);

        if (index1 !== -1 && index2 === -1) {
            index2 = index1;
        } else if (index1 === -1 && index2 !== -1) {
            index1 = index2;
        }

        if (index1 === -1 && index2 === -1) {
            store.push([value1, value2]);
        } else {
            store[index1].push(value1);
            store[index2].push(value2);

            if (index1 !== index2) {

                var low = Math.min(index1, index2);
                var high = Math.max(index1, index2);

                store[low] = store[low].concat(store[high]);
                store.splice(high, 1);
                store[low] = this._uniqueArray(store[low]);
            } else {

                store[index1] = this._uniqueArray(store[index1]);
            }
        }
    },
    _has: function(store, value) {
        var array;

        for (var i = 0; i < store.length; i++) {
            array = store[i];

            if (array.indexOf(value) !== -1) {

                return i;
            }
        }

        return -1;
    }
};




function resetRectangles(rectangles) {
    for (var i = 0; i < rectangles.length; i++) {
        rectangles[i].setMap(null);
    }
}

function drawRectangles(boundsList) {
    var rectangles = [];

    for (var i = 0; i < boundsList.length; i++) {

        rectangles.push(new naver.maps.Rectangle({
            map: map,
            bounds: boundsList[i],
            strokeColor: '#2F96FC',
            strokeWeight: 1,
            strokeOpacity: 0.8,
            fillColor: '#2F96FC',
            fillOpacity: 0.4
        }));
    }

    return rectangles;
}

function drawCircles(store, boundsList) {
    var circles = [];
    for (var i=0; i<boundsList.length; i++) {
        var bounds = boundsList[i];
        console.log(bounds);
        var x = (bounds._max.x - bounds._min.x) / 2;
        console.log(x);
        x = x + bounds._min.x;
        console.log(x);
        var y = (bounds._min.y - bounds._max.y) / 2;
        console.log(y);
        y = bounds._max.y - y;
        console.log(y);
        console.log(x, y);
        var center = new naver.maps.LatLng(y, x);
        console.log(center);

        // 겹치는 마커를 대신하는 마커 추가
        var greenMarker = new naver.maps.Marker({
            position: center,
            map: map,
            title: 'Green',
            icon: {
                content: [
                            '<div class="c-marker"><div class="inner"><b>',
                            store[i].length,
                            '</b></div></div>'
                        ].join(''),
                size: new naver.maps.Size(38, 58),
                anchor: new naver.maps.Point(19, 58),
            },
            draggable: true
        });
    /*
        var circle = new naver.maps.Circle({
            map: map,
            center: center,
            radius: 600,
            fillColor: '#2F96FC',
            fillOpacity: 0.8
        });
        */
    }
}





$(document).ready(function() {
    new Page();
});

function Page() {
    this.init();
}

Page.prototype = {
    init: function() {
        var self = this;

        $('#blog .pusher .masthead').removeClass('zoomed');

        if($(window).width() > 600) {
            $('body')
              .visibility({
                offset         : -10,
                observeChanges : false,
                once           : false,
                continuous     : false,
                onTopPassed: function() {
                  requestAnimationFrame(function() {
                    $('.following.bar')
                      .addClass('light fixed')
                      .find('.menu')
                        .removeClass('inverted')
                    ;
                    $('.following .additional.item')
                      .transition('scale in', 750)
                    ;
                  });
                },
                onTopPassedReverse: function() {
                  requestAnimationFrame(function() {
                    $('.following.bar')
                      .removeClass('light fixed')
                      .find('.menu')
                        .addClass('inverted')
                        .find('.additional.item')
                          .transition('hide')
                    ;
                  });
                }
              })
            ;
          }

        $(".ui.sidebar")
            .sidebar('setting', 'transition', 'overlay')
            .sidebar('attach events','.launch');


        $('section.featured .container').slick({
            dots: false,
            infinite: false,
            speed: 300,
            slidesToShow: 4,
            slidesToScroll: 4,
            responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
              }
            },
            {
              breakpoint: 700,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
          ]
        });

    }
};
