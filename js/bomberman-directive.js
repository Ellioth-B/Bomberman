'use strict';

app.directive('ngKeydown', ['bomb', 'bricks', 'boxes', 'fireUp', 'enemy', '$timeout', function(bomb, bricks, boxes, fireUp, enemy, $timeout) {

    function link (scope, elem, attrs) {
        // on the keydown event, check the keycode of the pressed key and apply the needed action
        elem.on('keydown', function(e){   
            if(!scope.keyActionEnabled){return;} //if key actions are disabled don't do anything
            if (e.which > 36 && e.which < 41) //Arrow keys = movement
                applyTransition(e.which);
            else if (e.which === 32 && bomb.getBombLimit() > 0){ //Backspace key = plant bomb
                elem.append(angular.element('<div class="image bomb bomb_num_'+ bomb.getBombLimit() +'" style="top:'+ scope.bomber_top +'px;left:'+ scope.bomber_left +'px;"></div>'));
                bomb_explotion(bomb.getBombLimit(), scope.bomber_top, scope.bomber_left);
                bomb.insertBomb();            
            }
        });

        //------------------------------------------------------------------------------------
        //                  Bomberman Actions - DOM manipulation
        //------------------------------------------------------------------------------------

        //Applies Bomberman's movement based on the arrow keys
        var applyTransition = function (keyCode) {
            switch (keyCode){
                case 37: //left
                    Bomberman_move(scope.bomber_top, scope.bomber_left - 50);
                    break;
                case 38: //up
                    Bomberman_move(scope.bomber_top - 50, scope.bomber_left);
                    break;
                case 39: //right
                    Bomberman_move(scope.bomber_top, scope.bomber_left + 50);
                    break;
                case 40: //bottom
                    Bomberman_move(scope.bomber_top + 50, scope.bomber_left);
                    break;
            }
            check_Bomberman_Death(scope.bomber_top, scope.bomber_left); 
        }

        //Checks the position of Bomberman after each movement and launches game_over if needed
        var check_Bomberman_Death = function (top, left) {
            //Checking flames collision if some present
            if(bomb.checkFlamesCollision(top,left))
                game_over();
            
            //Check if there's any enemy collision
            if(enemy.checkCollision(top,left,false))
                game_over();
        }

        //Checks Bomberman's movement and allows it if not a wall or box
        var Bomberman_move = function (top, left) {
            //If there's no bricks the map was not load correctly
            if(bricks.getAllBricks().length == 0){return;}
            
            //Check if the user wins
            winner();

            //Check bricks collisions
            if(bricks.checkCollision(top,left))
                return false;

            //Check boxes collisions
            if(boxes.checkCollision(top,left,false))
                return false;

            //Check fireUp power collision and adds power if so
            if(fireUp.checkCollision(top,left)){
                // removes the fireUp power from the DOM
                bomb.increaseBombLength();
                angular.element(".fireup[style='top:"+ top +"px;left:"+ left +"px;']").remove();
            }

            //If no collision found then allow bomberman to move
            scope.bomber_top = top;
            scope.bomber_left = left;            
            return true;
        }

        //BombermanPJ was destroyed and game over options will appear
        var game_over = function () {
            angular.element('.bombermanPj').addClass('explode');
            scope.keyActionEnabled = false;
            $timeout(function() {
                angular.element('.bombermanPj').css('background', 'none');
                scope.modalShown = !scope.modalShown;            
            }, 3000); //The pj explosion dissapears after 3 sec
        }

        //Check if the map is clean then the game is over and the user wins
        var winner = function () {
            if(enemy.getAllEnemies().length == 0 && boxes.getAllBoxes().length == 0){
                scope.modalShown = !scope.modalShown; 
                angular.element('.ng-modal-dialog-content').css('background', 'url("./css/images/victory.png") no-repeat center center');
            }
        }

        //------------------------------------------------------------------------------------
        //                  Bomb Actions - DOM manipulation
        //------------------------------------------------------------------------------------

        //Checks the fire movement and evaluates wether it can expands or not
        var Fire_Move = function (flame, bombNum, top, left) {
            //If there's no bricks the map was not load correctly
            if(bricks.getAllBricks().length == 0){return;}

            //Check bricks collisions
            if(bricks.checkCollision(top,left))
                return false;

            //Check boxes collisions
            if(boxes.checkCollision(top,left,flame)){
                //If it is allows to burn it then it will remove the box from the DOM
                // and put the flame instead
                if(flame){
                    // removes box from boxes array
                    angular.element(".box[style='top:"+ top +"px;left:"+ left +"px;']").remove();
                    elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ top +'px;left:'+ left +'px;"></div>'));
                    bomb.addFlames(bombNum, top, left);                    
                }
                return false;
            }

            //Check enemies collision, same functionality as with boxes
            if (enemy.checkCollision(top,left,flame)){                        
                if(flame){
                    // removes enemy from enemies array
                    angular.element(".enemy[style='top:"+ top +"px;left:"+ left +"px;']").remove();
                    elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ top +'px;left:'+ left +'px;"></div>'));
                    bomb.addFlames(bombNum, top, left); 
                }
                return false;
            }

            //Check fireUp power collision
            if (fireUp.checkCollision(top,left)){
                // removes the fireUp power from fireup array
                angular.element(".fireup[style='top:"+ top +"px;left:"+ left +"px;']").remove();
            }
            
            //If no collision found and it is allowed to go that side then expand the fire
            if(flame){
                elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ top +'px;left:'+ left +'px;"></div>'));
                bomb.addFlames(bombNum, top, left); 
            }            
            return true;
        };

        //Function to remove the bomb fire from the view
        var flames_away = function (bombNum) {
            $timeout(function() {
                angular.element('.flame_num_'+ bombNum).remove();
                // removes the flames from the bomb
                bomb.flamesAway(bombNum);
            }, 2000); //The flames dissapear after 2 sec
        };

        //Function that controls the explotion of the bomb, removing the bomb and adding flames
        var bomb_explotion = function (bombNum, positionTop, positionLeft) {
            $timeout(function() {
                //Removes the bomb from the DOM and puts the middle fire instead
                angular.element('.bomb_num_'+ bombNum).remove(); 
                elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ positionTop +'px;left:'+ positionLeft +'px;"></div>'));
                //Array containing the current bomb flames so we can keep control on them
                bomb.addNewBombFlames(bombNum, positionTop, positionLeft); 
                var moveRight = true,
                    moveLeft = true,
                    moveBottom = true,
                    moveTop = true;

                //Loop to expand flames depending on bomb power "bombLength"
                for(var i = 1; i <= bomb.getBombLength(); i++){   
                    if(!Fire_Move(moveRight, bombNum, positionTop, (positionLeft + 50*i)))
                        moveRight = false;
                    if(!Fire_Move(moveLeft, bombNum, positionTop, (positionLeft - 50*i)))
                        moveLeft = false;
                    if(!Fire_Move(moveBottom, bombNum, (positionTop + 50*i), positionLeft))
                        moveBottom = false;
                    if(!Fire_Move(moveTop, bombNum, (positionTop - 50*i), positionLeft))
                        moveTop = false;
                }

                //Once finished the bombLimit is reseted as before and checks if bomberman
                // was in the middle of the fire the moment it was activated
                bomb.increaseBombLimit();
                check_Bomberman_Death(scope.bomber_top, scope.bomber_left);
                //Call this functio to start the countdown for the fire to go away
                flames_away(bombNum);
            }, 3000); //The bomb dissapears after 3 sec
        };
    }

    return {
        restrict: 'A',
        link: link
    };
}]);