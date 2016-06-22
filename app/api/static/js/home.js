

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
}]);

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
