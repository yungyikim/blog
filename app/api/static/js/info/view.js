
var app = angular.module('myapp', ['ngRoute', 'ngCookies']);
app.config(function($httpProvider, $interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');

    var $cookies;
    angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
        $cookies = _$cookies_;
    }]);
    $httpProvider.defaults.headers.post['X-CSRFToken'] = $cookies.get('csrftoken');
});
app.controller('MainCtrl', ['$scope', '$http', '$sce', '$cookies', function($scope, $http, $sce, $cookies) {
    $scope.user = {
        id: $('#user-info').attr('data-id')
    };
    $scope.article = {
        title: '',
        content: ''
    };

    $(".ui.sidebar")
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('attach events','.launch');

    $('.following.bar').addClass('light');
    $('.following.bar .menu.inverted').removeClass('inverted');
    $('.menu .item').tab();

    $scope.article.content = $('#source')[0].outerText;
    $scope.article.html = new showdown.Converter().makeHtml($scope.article.content);
    console.log($scope.article.html);

    $scope.renderHtml = function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
}]);
