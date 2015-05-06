'use strict';

app.service('bricks', function () {
    var bricks = this,
        allBricks = [];

    //creates the brick object with position (Top, left)
    bricks.newBrickObject = function (top, left) {
        var brickObj = {
                top: top,
                left: left
            };
        return brickObj;
    }

    bricks.getLength = function () {
        return allBricks.length;
    }

    bricks.addBrick = function (top,left) {
        allBricks.push(this.newBrickObject(top,left));
    }

    bricks.getBrick = function (index) {
        return allBricks[index];
    }

    bricks.checkCollision = function (top, left) {
        if(allBricks.length != 0){
            for(var i=0; i < allBricks.length; i++) {            
                if (allBricks[i].top == top && allBricks[i].left == left)
                    return true;
            }
            return false;
        }        
    }
});