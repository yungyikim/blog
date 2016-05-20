$(document).ready(function() {
});

var app = angular.module('myapp', ['ngRoute']);
app.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
    var uri = URI(document.location);
    $scope.board_name = uri.segment()[0];
    $scope.boards = [];
    $scope.categorys = new Array(20);
    $scope.articles = [];

    console.log(uri);
    console.log($scope.board_name);

    $http.get('/api/boards')
        .then(
            function(response) {
                console.log(response);
                $scope.boards = response.data.results.slice(0);

                for (var i=0; i<$scope.boards.length; i++) {
                    if ($scope.board_name === $scope.boards[i].name) {
                        $scope.board_id = $scope.boards[i].id;
                    }
                }

                return $http.get('/api/categorys?board_id='+$scope.board_id);
            },
            function(error) {
                console.log(error);
            }
        )
        .then(
            function(response) {
                console.log(response);
                if (response) {
                    for (var i=0; i<response.data.results.length; i++) {
                        var category = response.data.results[i];
                        $scope.categorys[category.id] = category.name;
                    }
                    return $http.get('/api/articles?board_id='+$scope.board_id);
                }
            },
            function(error) {
                console.log(error);
            }
        )
        .then(
            function(response) {
                console.log(response);
                if (response) {
                    $scope.articles = response.data.results.slice(0);

                    for (var i=0; i<$scope.articles.length; i++) {
                        var article = $scope.articles[i];
                        var category_name = $scope.categorys[article.category];
                        if (category_name === undefined) {
                            category_name = 'Uncategorized';
                        }

                        if (article.image_url === '') {
                            article.image_url = 'http://demo.shapedtheme.com/kotha/wp-content/uploads/2015/07/photo-1429041966141-44d228a42775-1140x600.jpeg';
                        }

                        var m = moment(article.created);
                        article.category_name = category_name;
                        article.created_format = m.format('ll');
                        article.meta = 'By ' + article.email + ' / ' + m.format('ll') + ' / ' + category_name;
                    }
                }
            },
            function(error) {
                console.log(error);
            }
        );

}]);
