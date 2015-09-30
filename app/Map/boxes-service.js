'use strict';

app.service('boxService', function () {
    var allBoxes = [];

    //creates the box object with position (Top, left)
    var newBoxObject = function (top, left) {
        var boxObj = {
                top: top,
                left: left
            };
        return boxObj;
    };

    return {
        //adds a box object to our array
        addBox: function (top, left) {
            allBoxes.push(newBoxObject(top,left));
        },
        //returns the length of our boxes array
        getLength: function () {
            return allBoxes.length;
        },
        //checks boxes collisions, if remove is true the box will be removed (fire went over it)
        checkCollision: function (top, left, remove) {
            if(allBoxes.length !== 0){
                for(var i=0; i < allBoxes.length; i++) {
                    if (allBoxes[i].top == top && allBoxes[i].left == left){
                        if (remove)
                            allBoxes.splice(i,1);
                        return true;
                    }
                }
            }
            return false;
        },
        reset: function () {
            allBoxes = [];
        }
    };
});