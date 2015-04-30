'use strict';

app.service('fireUp', function () {
    var fireUp = this,
        allfireUp = [];

    fireUp.getAllFireUp = function () {
        return allfireUp;
    }

    fireUp.addFireUp = function (data) {
        allfireUp.push(data);
    }

    fireUp.getFireUp = function (index) {
        return allfireUp[index];
    }

    fireUp.checkCollision = function (top, left) {
        if(allfireUp.length != 0){
            for(var i=0; i < allfireUp.length; i++) {            
                var res = allfireUp[i].split(",");
                if (res[0] == top && res[1] == left){
                    // removes the fireUp power from fireup array
                    allfireUp.splice(i,1);
                    return true;                    
                }       
            }            
        }    
        return false; 
    }
});