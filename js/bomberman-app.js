'use strict';

var app = angular.module('bomberman', []);

app.controller('bombermanController', function($scope, $window){
    $scope.bombLimit = 1; //Bombs limit
    $scope.bombLength = 1; //Bombos power/length
    $scope.modalShown = false; //Game Over modal dialog control
    $scope.keyActionEnabled = true; //Enabled key actions
    $scope.flames = []; //Array with all flames shown
    $scope.bricks = []; //Array with all the bricks positions (wall, non destructible)
    $scope.boxes = []; //Array with all the boxes positions (destructibles)
    $scope.bomber_top = 50;
    $scope.bomber_left = 50;
    $scope.enemies = [];
    $scope.fireup = [];

    $scope.reloadPage = function() {
       $window.location.reload();
    }

    $scope.endGame = function() {
       $window.location.reload();
    }
});