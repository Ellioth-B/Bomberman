'use strict';

var app = angular.module('bomberman', []);

app.controller('bombermanController', function($scope, $window){
    $scope.modalShown = false; //Game Over modal dialog control
    $scope.keyActionEnabled = true; //Enabled key actions
    $scope.bomber_top = 50;
    $scope.bomber_left = 50;
    $scope.bomb_action_time = 3000; //3 sec
    $scope.enemy_speed = 1500; //1.5 sec
    $scope.map_type = 1; //determines which map to load
    $scope.map_type_limit = 2; //determines the number of maps available
    $scope.gameOver = false;
    $scope.lives = 3; //number of bomberman lives

    //Restart level won't work locally as per callback IDs
    $scope.restartLevel = function() {
        $window.location.reload();
    }

    $scope.endGame = function() {
       $window.location.reload();
    }

    //goes to next level and resets main values
    $scope.nextLevel = function() {
        $scope.map_type++;
        $scope.lives = 3;
        $scope.bomber_top = 50;
        $scope.bomber_left = 50;
        $scope.bomb_action_time = 3000;
        $scope.enemy_speed += 500; //Increase the enemy speed by 0.5 sec (increase difficulty)
        $scope.modalShown = false;
    }

    //returns an array of lives to use on ng-repeat
    $scope.getLives = function() {
        if($scope.lives > 0)
            return new Array($scope.lives);   
        else
            return false;
    }
});