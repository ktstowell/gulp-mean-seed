'use strict';

/***********************************************************************************************************************************************
 * APP_NAME MAIN CLI CONTROLLER
 ***********************************************************************************************************************************************
 * @description
 */
angular.module('APP_NAME.Modules.Main')
  .controller('APP_NAME.Modules.Main.Install.Controller', function($scope) {
    $scope.tab = 'philosophy';
    $scope.tabs = ['philosophy', 'API'];
  });