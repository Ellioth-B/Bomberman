'use strict';

app.service('fireUp', function () {
    var fireUp = this,
        allfireUp = [];

    //creates the bombUp object with position (Top, left)
    fireUp.newFireUpObject = function (top, left) {
        var fireUpObj = {
                top: top,
                left: left
            };
        return fireUpObj;
    }

    fireUp.addFireUp = function (top, left) {
        allfireUp.push(this.newFireUpObject(top,left));
    }

    fireUp.getFireUp = function (index) {
        return allfireUp[index];
    }

    fireUp.checkCollision = function (top, left) {
        if(allfireUp.length != 0){
            for(var i=0; i < allfireUp.length; i++) {            
                if (allfireUp[i].top == top && allfireUp[i].left == left){
                    // removes the fireUp power from fireup array
                    allfireUp.splice(i,1);
                    return true;                    
                }       
            }            
        }    
        return false; 
    }
});