
var app = angular.module('myapp', ['ngRoute']);
app.config(function($httpProvider, $interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
});
app.controller('MainCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    $scope.content = '';
    $scope.profile = {};

    var start = moment('2007-12-01');
    var now = moment();

    console.log(start);
    console.log(now);

    var diff = now - start;
    var duration = moment.duration({milliseconds : diff});

    $scope.profile.years = duration.years();
    $scope.profile.months = duration.months();

    $(".ui.sidebar")
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('attach events','.launch');

    $('.following.bar').addClass('light');
    $('.following.bar .menu.inverted').removeClass('inverted');

    $scope.preview_content = function() {
        console.log('preview_content()');
        $scope.html = new showdown.Converter().makeHtml($scope.content);
        $scope.renderHtml = function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };
    };

    $scope.content = $('#source')[0].outerText;
    console.log($scope.content);
    $scope.preview_content();
}]);
