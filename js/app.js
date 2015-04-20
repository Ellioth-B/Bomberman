var app = angular.module('bomberman', []);

app.controller('bombermanController', function($scope, $window){
    $scope.bombLimit = 1; //Bombs limit
    $scope.bombLength = 1; //Bombos power/length
    $scope.modalShown = false; //Game Over modal dialog control
    $scope.keyActionEnabled = true; //Enabled key actions
    $scope.flames = []; //Array with all flames shown

    $scope.reloadPage = function() {
       $window.location.reload();
    }

    $scope.endGame = function() {
       $window.location.reload();
    }
});

app.directive('modalDialog', function() {
    return {
        restrict: 'E',
        scope: {
            show: '='
        },
        replace: true, //Replace with the template below
        transclude: true, //Insert custom content inside the directive
        link: function(scope, element, attrs) {
            scope.dialogStyle = {};
            if (attrs.width)
                scope.dialogStyle.width = attrs.width;
            if (attrs.height)
                scope.dialogStyle.height = attrs.height;
            scope.hideModal = function() {
                scope.show = false;
            };
        },
            template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
    };
});

app.directive('ngKeydown', function($timeout) {

    function link (scope, elem, attrs) {
        var bombermanPj = angular.element('.bombermanPj'); //DOM elemnt representing Bomberman

        // on the keydown event, check the keycode of the pressed key and apply the needed action
        elem.on('keydown', function(e){   
            if(!scope.keyActionEnabled){return;} //if key actions are disabled don't do anything
            if (e.which > 36 && e.which < 41) //Arrow keys = movement
                applyTransition(e.which);
            else if (e.which === 32 && scope.bombLimit > 0) { //Backspace key = plant bomb
                var bomberman = bombermanPj.position();
                elem.append(angular.element('<div class="image bomb bomb_num_'+ scope.bombLimit +'" style="top:'+ bomberman.top +'px;left:'+ bomberman.left +'px;"></div>'));
                bomb_explotion(scope.bombLimit, bomberman.top, bomberman.left);
                scope.bombLimit --;                
            }
        });

        //Applies Bomberman's movement based on the arrow keys
        function applyTransition (keyCode) {
            switch (keyCode){
                case 37: //left
                    bombermanPj.css('left', parseInt(bombermanPj.css('left')) - 50 + 'px');
                    break;
                case 38: //up
                    bombermanPj.css('top', parseInt(bombermanPj.css('top')) - 50 + 'px');
                    break;
                case 39: //right
                    bombermanPj.css('left', parseInt(bombermanPj.css('left')) + 50 + 'px');
                    break;
                case 40: //bottom
                    bombermanPj.css('top', parseInt(bombermanPj.css('top')) + 50 + 'px');
                    break;
            }
            checkMove(parseInt(bombermanPj.css('top')), parseInt(bombermanPj.css('left'))); 
        };

        //Checks the position of Bomberman after each movement and launches game_over if needed
        function checkMove (top, left) {
            if(scope.flames.length == 0){return;}
            for(var i=1; i < scope.flames.length; i++) {            
                for(var j=0; j < scope.flames[i].length; j++){
                    var res = scope.flames[i][j].split(",");
                    if (res[0] == top && res[1] == left){
                        game_over();
                        break;
                    }
                }
            }
        };

        //BombermanPJ was destroyed and game over options will appear
        function game_over () {
            bombermanPj.addClass('explode');
            scope.keyActionEnabled = false;
            $timeout(function() {
                bombermanPj.css('background', 'none');
                scope.modalShown = !scope.modalShown;            
            }, 3000); //The pj explosion dissapears after 3 sec
        };

        //Function to remove the bomb flames from the view
        function flames_away (bombNum) {
            $timeout(function() {
                angular.element('.flame_num_'+ bombNum).remove();
                scope.flames[bombNum] = [];
            }, 2000); //The flames dissapear after 2 sec
        };

        //Function that controls the explotion of the bomb, removing the bomb and adding flames
        function bomb_explotion (bombNum, positionTop, positionLeft) {
            $timeout(function() {
                angular.element('.bomb_num_'+ bombNum).remove();
                elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ positionTop +'px;left:'+ positionLeft +'px;"></div>'));
                //Array containing the current bomb flames so we can keep control on them
                scope.flames[bombNum] = [];
                scope.flames[bombNum].push(positionTop + ',' + positionLeft);

                //Loop to expand flames depending on bomb power "bombLength"
                for(var i = 1; i <= scope.bombLength; i++){                
                    elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ positionTop +'px;left:'+ (positionLeft + 50*i) +'px;"></div>'));
                    scope.flames[bombNum].push(positionTop + ',' + (positionLeft + 50*i));
                    elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ positionTop +'px;left:'+ (positionLeft - 50*i) +'px;"></div>'));
                    scope.flames[bombNum].push(positionTop + ',' + (positionLeft - 50*i));
                    elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ (positionTop + 50*i) +'px;left:'+ positionLeft +'px;"></div>'));
                    scope.flames[bombNum].push((positionTop + 50*i) + ',' + positionLeft);
                    elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ (positionTop - 50*i) +'px;left:'+ positionLeft +'px;"></div>'));
                    scope.flames[bombNum].push((positionTop - 50*i) + ',' + positionLeft);
                }

                scope.bombLimit ++;
                checkMove(parseInt(bombermanPj.css('top')), parseInt(bombermanPj.css('left')));
                flames_away(bombNum);
            }, 3000); //The bomb dissapears after 3 sec
        };
    }

    return {
        restrict: 'A',
        link: link
    };
});