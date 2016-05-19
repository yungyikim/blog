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

    /*
    for (var i=0; i<categorys.length; i++) {
        categorys[i] = 'Uncategorized';
    }
    */

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

/*
    $http({
        method: 'GET',
        url: host+'/api/categorys'
    })
    .success(function(data, status, headers, config) {
        for (var i=0; i<data.results.length; i++) {
            var category = data.results[i];
            $scope.categorys[category.id] = category.name;
        }
    })
    .error(function(data, status, headers, config) {

    });







    $http({
        method: 'GET',
        url: host+'/api/articles'
    })
    .success(function(data, status, headers, config) {
        $scope.articles = data.results.slice(0);

        for (var i=0; i<$scope.articles.length; i++) {
            var article = $scope.articles[i];
            var category_name = $scope.categorys[article.category];
            if (category_name === undefined) {
                category_name = 'Uncategorized';
            }

            var m = moment(article.created);
            article.category_name = category_name;
            article.created_format = m.format('ll');
            article.meta = 'By ' + article.email + ' / ' + m.format('ll') + ' / ' + category_name;
        }
    })
    .error(function(data, status, headers, config) {
        console.log('error');
        console.log(data);
        console.log(status);
    });
    */


/*
    $scope.articles = [
        {
            id: 99,
            title: '글 제목입니다.',
            //meta: 'By mybjunga@gmail.com / Jul 02, 2016 / 카테고리1',
            email: 'yungyikim@gmail.com',
            created: '2016-04-14T05:32:24.469788Z',
            category: 1,
            content: 'Spsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. officia deserunt mollit anim id est laborum. lorem ipsum dolor sit'
        }
    ];
*/


}]);
