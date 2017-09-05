'use strict';
angular
    .module('app')
    .directive('appnavbar', appNavbar);

function appNavbar($location, $window) {
    var directive = {
        replace: true,
        link: link,
        restrict: 'E',
        templateUrl: 'components/navbar/navbar.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.user = JSON.parse(localStorage.getItem('user'));

        scope.logout = function(){
            $window.localStorage.clear();
            $location.path('/login');
        }

        $('.dropdown-button').dropdown({
            constrainWidth: true,
            hover: false,
            belowOrigin: true,
            alignment: 'left',
          }
        );
    }
}

appNavbar.$inject = ['$location','$window'];
