'use strict';
angular
    .module('app')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/',{
                templateUrl: 'views/dashboard/dashboard.html',
                controller: 'DashboardController',
                resolve:{
                    "check":function($location){   
                        if(localStorage.getItem('user') === null){
                            $location.path("/login");
                         }
                    }
                }
            })
            .when('/login',{
                templateUrl: 'views/login/login.html',
                controller: 'LoginController'
            });
    }]);