'use strict';
angular
    .module('app')
    .directive('appsidenav', appSidenav);

function appSidenav() {
    var directive = {
        link: link,
        replace: true,
        restrict: 'E',
        templateUrl: 'components/sidenav/sidenav.html'
    };
    return directive;

    function link(scope, element, attrs) {

        $(".button-collapse").sideNav();
    }

}
