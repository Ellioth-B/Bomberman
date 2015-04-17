var app = angular.module('bomberman', []);

app.controller('bombermanController', function($scope){
    // Create a variable to store the transform value
    $scope.bombLimit = 1;
    $scope.bombLength = 1;
});

app.directive('ngKeydown', function($timeout) {
    var applyTransition = function (keyCode) {
            var element = angular.element('.bombermanPj');

            switch (keyCode){
                case 37: //left
                    element.css('left', parseInt(element.css('left')) - 50 + 'px');
                    break;
                case 38: //up
                    element.css('top', parseInt(element.css('top')) - 50 + 'px');
                    break;
                case 39: //right
                    element.css('left', parseInt(element.css('left')) + 50 + 'px');
                    break;
                case 40: //bottom
                    element.css('top', parseInt(element.css('top')) + 50 + 'px');
                    break;
            } 
    };

    //Function to remove the bomb flames from the view
    var flames_away = function (flameNum) {
        $timeout(function() {
            angular.element('.flame_num_'+ flameNum).remove();
        }, 2000); //The flames dissapear after 2 sec
    };

    //Function that controls the explotion of the bomb, removing the bomb and adding flames
    var bomb_explotion = function (scope, elem, bombNum, positionTop, positionLeft) {
        $timeout(function() {
            angular.element('.bomb_num_'+ bombNum).remove();
            elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ positionTop +'px;left:'+ positionLeft +'px;"></div>'));
            for(var i = 1; i <= scope.bombLength; i++){                
                elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ positionTop +'px;left:'+ (positionLeft + 50*i) +'px;"></div>'));
                elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ positionTop +'px;left:'+ (positionLeft - 50*i) +'px;"></div>'));
                elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ (positionTop + 50*i) +'px;left:'+ positionLeft +'px;"></div>'));
                elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ (positionTop - 50*i) +'px;left:'+ positionLeft +'px;"></div>'));
            }
            scope.bombLimit ++;
            flames_away(bombNum);
        }, 3000); //The bomb dissapears after 3 sec
    };

    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            // on the keydown event, check the keycode of the pressed key
            //and apply the needed action
            elem.on('keydown', function(e){                
                if (e.which > 36 && e.which < 41) //37 to 40 are the arrow keys = movement
                    applyTransition(e.which);
                else if(e.which === 32 && scope.bombLimit > 0) { //backspace = plant bomb
                    var bombermanPj = angular.element('.bombermanPj').position();
                    elem.append(angular.element('<div class="image bomb bomb_num_'+ scope.bombLimit +'" style="top:'+ bombermanPj.top +'px;left:'+ bombermanPj.left +'px;"></div>'));
                    bomb_explotion(scope, elem, scope.bombLimit, bombermanPj.top, bombermanPj.left);
                    scope.bombLimit --;                
                }
            });
        }
    };
});