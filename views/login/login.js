'use strict';
angular
    .module('app')
    .controller('LoginController', LoginController);


function LoginController($scope,$location,$http) {

   if(localStorage.getItem('user') != null){
       $location.path("/");
    }

    $scope.form = {
        email: "",
        password: ""
    }

    $scope.user = {
        name: "",
        email: "",
        password: ""
    }

    $scope.login = function () {
        if($scope.form.email === $scope.user.email && $scope.form.password === $scope.user.password){
            localStorage.setItem('user', JSON.stringify($scope.user));
            $location.path("/");
        }else{
            Materialize.toast("Usuario y/o contraseña incorrectos",3000);
        }
    }
}

LoginController.$inject = ['$scope','$location','$http', '$window'];