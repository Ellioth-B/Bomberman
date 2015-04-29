'use strict';

app.service('boxes', function () {
    var boxes = this,
        allBoxes = [];

    boxes.getAllBoxes = function () {
        return allBoxes;
    }

    boxes.addBox = function (data) {
        allBoxes.push(data);
    }

    boxes.getBox = function (index) {
        return allBoxes[index];
    }

    boxes.checkCollision = function (top, left, remove) {
        if(allBoxes.length != 0){
            for(var i=0; i < allBoxes.length; i++) {            
                var res = allBoxes[i].split(",");
                if (res[0] == top && res[1] == left){
                    if (remove)
                        allBoxes.splice(i,1);
                    return true;
                }                                        
            }
        }
        return false;
    }
});