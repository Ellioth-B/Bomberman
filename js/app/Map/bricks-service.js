'use strict';

app.service('bricks', function () {
    var bricks = this,
        allBricks = [];

    bricks.getAllBricks = function () {
        return allBricks;
    }

    bricks.addBrick = function (data) {
        allBricks.push(data);
    }

    bricks.getBrick = function (index) {
        return allBricks[index];
    }

    bricks.checkCollision = function (top, left) {
        if(allBricks.length != 0){
            for(var i=0; i < allBricks.length; i++) {            
                var res = allBricks[i].split(",");
                if (res[0] == top && res[1] == left)
                    return true;
            }
            return false;
        }        
    }
});