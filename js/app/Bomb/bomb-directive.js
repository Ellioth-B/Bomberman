'use strict';

app.service('bomb', ['bricks', 'boxes', 'fireUp', 'enemy', function(bricks, boxes, fireUp, enemy, $timeout, $rootScope) {
    var bomb = this,
        bombLimit = 1, //Allowed number of bombs
        bombLength = 1, //Bombs power/length
        flames = [], //Array with all flames shown
        scope = $rootScope;

    //Inserts the bomb in the DOM and starts the countdown to explode
    bomb.insertBomb = function () {
        console.log("SET BOMB!");
        /*elem.append(angular.element('<div class="image bomb bomb_num_'+ scope.bombLimit +'" style="top:'+ scope.bomber_top +'px;left:'+ scope.bomber_left +'px;"></div>'));
        bomb_explotion(scope.bombLimit, scope.bomber_top, scope.bomber_left);*/
        bombLimit --; 
        console.log(bombLimit);
    }

    bomb.getBombLimit = function () {
        return bombLimit;
    }

    bomb.getBombLength = function () {
        return BombLength;
    }

    bomb.increaseBombLength  = function () {
        bombLength ++;
    }

    //Checks the fire movement and evaluates wether it can expands or not
    var Fire_Move = function (flame, bombNum, top, left) {
        //If there's no bricks the map was not load correctly
        if(bricks.getAllBricks().length == 0){return;}

        //Check bricks collisions
        if(bricks.checkCollision(top,left))
            return false;

        //Check boxes collisions
        if(boxes.checkCollision(top,left)){
            //If it is allows to burn it then it will remove the box from the DOM
            // and put the flame instead
            if(flame){
                // removes box from boxes array
                angular.element(".box[style='top:"+ top +"px;left:"+ left +"px;']").remove();
                elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ top +'px;left:'+ left +'px;"></div>'));
                flames[bombNum].push(top + ',' + left);
            }
            return false;
        }

        //Check enemies collision, same functionality as with boxes
        if (enemy.checkCollision(top,left)){                        
            if(flame){
                // removes enemy from enemies array
                angular.element(".enemy[style='top:"+ top +"px;left:"+ left +"px;']").remove();
                elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ top +'px;left:'+ left +'px;"></div>'));
                flames[bombNum].push(top + ',' + left);
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
            flames[bombNum].push(top + ',' + left);
        }            
        return true;
    };

    //Function to remove the bomb fire from the view
    var flames_away = function (bombNum) {
        $timeout(function() {
            angular.element('.flame_num_'+ bombNum).remove();
            // removes the flames from the bomb
            flames.splice(bombNum,1);
        }, 2000); //The flames dissapear after 2 sec
    };

    //Function that controls the explotion of the bomb, removing the bomb and adding flames
    var bomb_explotion = function (bombNum, positionTop, positionLeft) {
        $timeout(function() {
            //Removes the bomb from the DOM and puts the middle fire instead
            angular.element('.bomb_num_'+ bombNum).remove(); 
            elem.append(angular.element('<div class="image flame flame_num_'+ bombNum +'" style="top:'+ positionTop +'px;left:'+ positionLeft +'px;"></div>'));
            //Array containing the current bomb flames so we can keep control on them
            flames[bombNum] = [];
            flames[bombNum].push(positionTop + ',' + positionLeft);
            var moveRight = true,
                moveLeft = true,
                moveBottom = true,
                moveTop = true;

            //Loop to expand flames depending on bomb power "bombLength"
            for(var i = 1; i <= bombLength; i++){   
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
            bombLimit ++;
            check_Bomberman_Death(scope.bomber_top, scope.bomber_left);
            //Call this functio to start the countdown for the fire to go away
            flames_away(bombNum);
        }, 3000); //The bomb dissapears after 3 sec
    };
}]);