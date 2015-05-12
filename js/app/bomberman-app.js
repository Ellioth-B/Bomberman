'use strict';

var app = angular.module('bomberman', []);

app.controller('bombermanController', function($scope, $window){
    $scope.modalShown = false; //Game Over modal dialog control
    $scope.keyActionEnabled = true; //Enabled key actions
    $scope.bomber_top = 50;
    $scope.bomber_left = 50;
    $scope.bomb_action_time = 3000; //3 sec
    $scope.enemy_speed = 1500; //1.5 sec  

    $scope.reloadPage = function() {
       $window.location.reload();
    }

    $scope.endGame = function() {
       $window.location.reload();
    }
});