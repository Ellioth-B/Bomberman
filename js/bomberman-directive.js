'use strict';

app.directive('ngKeydown', function($timeout) {

    function link (scope, elem, attrs) {
        // on the keydown event, check the keycode of the pressed key and apply the needed action
        elem.on('keydown', function(e){   
            if(!scope.keyActionEnabled){return;} //if key actions are disabled don't do anything
            if (e.which > 36 && e.which < 41) //Arrow keys = movement
                applyTransition(e.which);
            else if (e.which === 32 && scope.bombLimit > 0) //Backspace key = plant bomb
                insertBomb();            
        });

        //Inserts the bomb in the DOM and starts the countdown to explode
        function insertBomb () {
            elem.append(angular.element('<div class="image bomb bomb_num_'+ scope.bombLimit +'" style="top:'+ scope.bomber_top +'px;left:'+ scope.bomber_left +'px;"></div>'));
            bomb_explotion(scope.bombLimit, scope.bomber_top, scope.bomber_left);
            scope.bombLimit --; 
        }

        //Applies Bomberman's movement based on the arrow keys
        function applyTransition (keyCode) {
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
        };

        //Checks the position of Bomberman after each movement and launches game_over if needed
        function check_Bomberman_Death (top, left) {
            //Checking flames collision if some present
            if(scope.flames.length != 0){
                for(var i=scope.bombLimit; i > 0; i--) {      
                    if(scope.flames[i]){
                        for(var j=0; j < scope.flames[i].length; j++){
                            var res = scope.flames[i][j].split(",");
                            if (res[0] == top && res[1] == left){
                                game_over();
                                break;
                            }
                        }
                    }
                }
            }
            //Check if there's any enemy collision
            for(var i=0; i < scope.enemies.length; i++){
                var res = scope.enemies[i].split(",");
                if (res[0] == top && res[1] == left){
                    game_over();
                    break;
                }
            }
        };

        //Checks Bomberman's movement and allows it if not a wall or box
        function Bomberman_move (top, left) {
            //If there's no bricks the map was not load correctly
            if(scope.bricks.length == 0){return;}
            
            winner();//Check if the user wins

            //Check bricks collisions
            for(var i=0; i < scope.bricks.length; i++) {            
                var res = scope.bricks[i].split(",");
                if (res[0] == top && res[1] == left)
                    return false;
            }

            //Check boxes collisions
            if(scope.boxes.length != 0){
                for(var i=0; i < scope.boxes.length; i++) {            
                    var res = scope.boxes[i].split(",");
                    if (res[0] == top && res[1] == left)
                        return false;                    
                }
            }

            //Check fireUp power collision and adds power if so
            if(scope.fireup.length != 0){
                for(var i=0; i < scope.fireup.length; i++) {            
                    var res = scope.fireup[i].split(",");
                    if (res[0] == top && res[1] == left){
                        // removes the fireUp power from fireup array
                        scope.fireup.splice(i,1);
                        scope.bombLength ++;
                        angular.element(".fireup[style='top:"+ top +"px;left:"+ left +"px;']").remove();
                    }       
                }
            }

            //If no collision found then allow bomberman to move
            scope.bomber_top = top;
            scope.bomber_left = left;            
            return true;
        };

        //Checks the fire movement and evaluates wether it can expands or not
        function Fire_Move (flame, bombNum, top, left) {
            //If there's no bricks the map was not load correctly
            if(scope.bricks.length == 0){return;}
            //Check bricks collisions
            for(var i=0; i < scope.bricks.length; i++) {            
                var res = scope.bricks[i].split(",");
                if (res[0] == top && res[1] == left)
                    return false;
            }

            //Check boxes collisions
            if(scope.boxes.length != 0) {
                for(var i=0; i < scope.boxes.length; i++) {            
                    var res = scope.boxes[i].split(",");
                    if (res[0] == top && res[1] == left){
                        //If it is allows to burn it then it will remove the box from the DOM
                        // and put the flame instead
                        if(flame){
                            // removes box from boxes array
                            scope.boxes.splice(i,1);
                            angular.element(".box[style='top:"+ top +"px;left:"+ left +"px;']").remove();
                            elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ top +'px;left:'+ left +'px;"></div>'));
                            scope.flames[bombNum].push(top + ',' + left);
                        }
                        return false;
                    }
                }
            }

            //Check enemies collision, same functionality as with boxes
            if(scope.enemies.length != 0) {
                for(var i=0; i < scope.enemies.length; i++){
                    var res = scope.enemies[i].split(",");
                    if (res[0] == top && res[1] == left){                        
                        if(flame){
                            // removes enemy from enemies array
                            scope.enemies.splice(i,1);
                            angular.element(".enemy[style='top:"+ top +"px;left:"+ left +"px;']").remove();
                            elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ top +'px;left:'+ left +'px;"></div>'));
                            scope.flames[bombNum].push(top + ',' + left);
                        }
                        return false;
                    }
                }
            }

            //Check fireUp power collision
            if(scope.fireup.length != 0){
                for(var i=0; i < scope.fireup.length; i++) {            
                    var res = scope.fireup[i].split(",");
                    if (res[0] == top && res[1] == left){
                        // removes the fireUp power from fireup array
                        scope.fireup.splice(i,1);
                        angular.element(".fireup[style='top:"+ top +"px;left:"+ left +"px;']").remove();
                    }       
                }
            }
            
            //If no collision found and it is allowed to go that side then expand the fire
            if(flame){
                elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ top +'px;left:'+ left +'px;"></div>'));
                scope.flames[bombNum].push(top + ',' + left);
            }            
            return true;
        };

        //BombermanPJ was destroyed and game over options will appear
        function game_over () {
            angular.element('.bombermanPj').addClass('explode');
            scope.keyActionEnabled = false;
            $timeout(function() {
                angular.element('.bombermanPj').css('background', 'none');
                scope.modalShown = !scope.modalShown;            
            }, 3000); //The pj explosion dissapears after 3 sec
        };

        //Check if the map is clean then the game is over and the user wins
        function winner () {
            if(scope.enemies.length == 0 && scope.boxes.length == 0){
                scope.modalShown = !scope.modalShown; 
                angular.element('.ng-modal-dialog-content').css('background', 'url("./css/images/victory.png") no-repeat center center');
            }
        };

        //Function to remove the bomb fire from the view
        function flames_away (bombNum) {
            $timeout(function() {
                angular.element('.flame_num_'+ bombNum).remove();
                // removes the flames from the bomb
                scope.flames.splice(bombNum,1);
            }, 2000); //The flames dissapear after 2 sec
        };

        //Function that controls the explotion of the bomb, removing the bomb and adding flames
        function bomb_explotion (bombNum, positionTop, positionLeft) {
            $timeout(function() {
                //Removes the bomb from the DOM and puts the middle fire instead
                angular.element('.bomb_num_'+ bombNum).remove(); 
                elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ positionTop +'px;left:'+ positionLeft +'px;"></div>'));
                //Array containing the current bomb flames so we can keep control on them
                scope.flames[bombNum] = [];
                scope.flames[bombNum].push(positionTop + ',' + positionLeft);
                var moveRight = true,
                    moveLeft = true,
                    moveBottom = true,
                    moveTop = true;

                //Loop to expand flames depending on bomb power "bombLength"
                for(var i = 1; i <= scope.bombLength; i++){   
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
                scope.bombLimit ++;
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
});