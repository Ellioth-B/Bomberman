'use strict';

app.service('bombUp', function () {
    var bombUp = this,
        allbombUp = [];

    bombUp.getAllBombUp = function () {
        return allbombUp;
    }

    bombUp.addBombUp = function (data) {
        allbombUp.push(data);
    }

    bombUp.getBombUp = function (index) {
        return allbombUp[index];
    }

    bombUp.checkCollision = function (top, left) {
        if(allbombUp.length != 0){
            for(var i=0; i < allbombUp.length; i++) {            
                var res = allbombUp[i].split(",");
                if (res[0] == top && res[1] == left){
                    // removes the bombUp power from fireup array
                    allbombUp.splice(i,1);
                    return true;                    
                }       
            }            
        }    
        return false; 
    }
});