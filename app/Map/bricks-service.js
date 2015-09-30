'use strict';

app.service('brickService', function () {
    var allBricks = [];

    //creates the brick object with position (Top, left)
    var newBrickObject = function (top, left) {
        var brickObj = {
                top: top,
                left: left
            };
        return brickObj;
    };

    return {
        addBrick: function (top,left) {
            allBricks.push(newBrickObject(top,left));
        },
        getLength: function () {
            return allBricks.length;
        },
        checkCollision: function (top, left) {
            if(allBricks.length !== 0){
                for(var i=0; i < allBricks.length; i++) {
                    if (allBricks[i].top == top && allBricks[i].left == left)
                        return true;
                }
                return false;
            }
        },
        reset: function () {
            allBricks = [];
        }
    };
});