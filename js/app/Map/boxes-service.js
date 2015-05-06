'use strict';

app.service('boxes', function () {
    var boxes = this,
        allBoxes = [];

    //creates the box object with position (Top, left)
    boxes.newBoxObject = function (top, left) {
        var boxObj = {
                top: top,
                left: left
            };
        return boxObj;
    }

    boxes.getLength = function () {
        return allBoxes.length;
    }

    boxes.addBox = function (top, left) {
        allBoxes.push(this.newBoxObject(top,left));
    }

    boxes.getBox = function (index) {
        return allBoxes[index];
    }

    boxes.checkCollision = function (top, left, remove) {
        if(allBoxes.length != 0){
            for(var i=0; i < allBoxes.length; i++) {            
                if (allBoxes[i].top == top && allBoxes[i].left == left){
                    if (remove)
                        allBoxes.splice(i,1);
                    return true;
                }                                        
            }
        }
        return false;
    }
});