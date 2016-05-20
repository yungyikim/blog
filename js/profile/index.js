$(document).ready(function() {
});


var app = angular.module('myapp', ['ngRoute']);
app.config(function($httpProvider) {
    $httpProvider.defaults.headers.post['X-CSRFToken'] = getCookie('csrftoken');
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

    $http.get(
        '/api/profiles'
    )
    .then(
        function(response) {
            console.log(response);
            if (response) {
                // 마지막 항목을 보여준다.
                var profiles = response.data.results;
                if (response.data.count > 0) {
                    $scope.content = profiles[0].content;
                    $scope.preview_content();
                }
            }
        },
        function(error) {
            console.log(error);
        }
    );

    $scope.preview_content = function() {
        console.log('preview_content()');
        $scope.html = new showdown.Converter().makeHtml($scope.content);
        $scope.renderHtml = function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };
    };

}]);
