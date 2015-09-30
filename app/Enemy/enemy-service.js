'use strict';

app.service('enemyService',
    ['bombService', 'brickService', 'boxService', function (bomb, bricks, boxes) {
    var allEnemies = [],
        enemyID = 0;

    //Constructor: creates the enemy object with position (Top, left)
    var newEnemyObject = function (id, top, left) {
        var enemyObj = {
                enemyID: id,
                top: top,
                left: left,
                latestDecision: ''
            };
        return enemyObj;
    };

    //returns the new top and left values for the desired direction
    var decisionTopLeft = function (decision, top, left) {
        switch (decision){
            case 'right':
                left = left + 50;
            break;
            case 'left':
                left = left - 50;
            break;
            case 'top':
                top = top - 50;
            break;
            case 'bottom':
                top = top + 50;
            break;
        }
        return {'top': top, 'left': left};
    };

    //check if the enemy can move and there's no unwanted collisions
    var checkMove = function (top, left) {
        //Checks bricks collisions
        if(bricks.checkCollision(top,left))
            return false;

        //Checks boxes collisions
        if(boxes.checkCollision(top,left,false))
            return false;

        //Checks bombs collisions
        if(bomb.checkCollision(top,left,true))
            return false;

        //Checking flames collision
        if(bomb.checkFlamesCollision(top,left))
            return false;

        return true;
    };

    //returns the latest successful direction taken for the required enemy
    var getLatestDecision = function (enemyID) {
        for(var i=0; i<allEnemies.length;i++){
            if(allEnemies[i].enemyID === enemyID)
                return allEnemies[i].latestDecision;
        }
    };

    return {
        //adds an enemy object to the array
        addEnemy: function (top, left) {
            allEnemies.push(newEnemyObject(enemyID, top, left));
            var currentEnemyID = enemyID;
            enemyID++;
            return currentEnemyID;
        },
        //returns the length of our enemies array
        getLength: function () {
            return allEnemies.length;
        },
        //returns the enemy ID
        getID: function (index) {
            return allEnemies[index].enemyID;
        },
        //returns the top value of the desired enemy
        getTopVal: function (enemyID) {
            for(var i=0; i<allEnemies.length;i++){
                if(allEnemies[i].enemyID === enemyID)
                    return allEnemies[i].top;
            }
        },
        //returns the left value of the desired enemy
        getLeftVal: function (enemyID) {
            for(var i=0; i<allEnemies.length;i++){
                if(allEnemies[i].enemyID === enemyID)
                    return allEnemies[i].left;
            }
        },
        //updates the position of the passed enemy index (enemyID)
        //and sets the latest successful direction taken
        update: function (enemyID, decision, top, left) {
            var finalDecision = decisionTopLeft(decision, top, left);

            for(var i=0; i<allEnemies.length;i++){
                if(allEnemies[i].enemyID === enemyID){
                    allEnemies[i].top = finalDecision.top;
                    allEnemies[i].left = finalDecision.left;
                    allEnemies[i].latestDecision = decision;
                }
            }
            return finalDecision;
        },
        //checks enemies collission
        checkCollision: function (top, left, remove) {
            if(allEnemies.length !== 0){
                for(var i=0; i < allEnemies.length; i++) {
                    if (allEnemies[i].top == top && allEnemies[i].left == left){
                        if (remove)
                            allEnemies.splice(i,1);
                        return true;
                    }
                }
            }
            return false;
        },
        //Returns an array with all the possible directions the enemy can take
        checkPossibilities: function (enemyID, top, left) {
            var directionArray = [
                    'right',
                    'left',
                    'top',
                    'bottom'
                ],
                possibleMoves = [],
                latestDecision = getLatestDecision(enemyID);

            //If the enemy went to one direction, we try to keep going that way
            if(latestDecision !== ''){
                var decision = decisionTopLeft(latestDecision, top, left);
                if(checkMove(decision.top, decision.left))
                    possibleMoves.push(latestDecision);
                else {
                    var index = directionArray.indexOf(latestDecision);
                    directionArray.splice(index,1);
                }
            }

            //If it is not possible to continue to the latest direction then evaluate other possibilities
            if(possibleMoves.length === 0){
                angular.forEach(directionArray, function(value) {
                    var decision = decisionTopLeft(value, top, left);
                    if(checkMove(decision.top, decision.left))
                        possibleMoves.push(value);
                });
            }

            return possibleMoves;
        },
        reset: function () {
            allEnemies = [];
            enemyID = 0;
        }
    };
}]);