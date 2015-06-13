angular.module('showcase', ['uiGmapgoogle-maps'])

    .controller('TodoCtrl', function ($scope, $http) {


        $scope.insertTodoItem = function () {

            console.log('Insert Todo Item');

            $http.post('/todo', {todoItem: $scope.todoItem}).
                success(function (data, status, headers, config) {
                    $scope.todoItem = null;
                    $scope.todoItems = data;
                }).
                error(function (data, status, headers, config) {
                    console.log("There was an error saving a todo entry!");
                    console.log(status);
                });
        };


        $http.get('/todo').
            success(function (data, status, headers, config) {
                $scope.todoItems = data;
            }).
            error(function (data, status, headers, config) {
                console.log("There was an error fetching all todo entries!");
                console.log(status);
            });

    })
    .controller('MapCtrl', function ($scope, $http) {
        $scope.map = {center: {latitude: 48.21, longitude: 16.37}, zoom: 8};
        $scope.setPosition = function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            $scope.map = {center: {latitude: lat, longitude: lng}, zoom: 8};
            $scope.$apply();

            $http.get('/weather/' + lat + '/' + lng).
                success(function (data, status, headers, config) {
                    $scope.weather = data;
                    console.log(data);
                }).
                error(function (data, status, headers, config) {
                    console.log("There was an error looking for the current weather!");
                    console.log(status);
                });
        };

        $scope.getLocation = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition($scope.setPosition, $scope.showError);
            }
            else {
                $scope.error = "Geolocation is not supported by this browser.";
            }
        };
        $scope.getLocation();

    });