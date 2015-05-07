'use strict';

app.service('brickService', function () {
    var allBricks = [];

    return {
        //creates the brick object with position (Top, left)
        newBrickObject: function (top, left) {
            var brickObj = {
                    top: top,
                    left: left
                };
            return brickObj;
        },
        getLength: function () {
            return allBricks.length;
        },
        addBrick: function (top,left) {
            allBricks.push(this.newBrickObject(top,left));
        },
        checkCollision: function (top, left) {
            if(allBricks.length != 0){
                for(var i=0; i < allBricks.length; i++) {            
                    if (allBricks[i].top == top && allBricks[i].left == left)
                        return true;
                }
                return false;
            }        
        }
    };
});