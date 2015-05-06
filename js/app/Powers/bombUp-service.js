'use strict';

app.service('bombUp', function () {
    var bombUp = this,
        allbombUp = [];

    //creates the bombUp object with position (Top, left)
    bombUp.newBombUpObject = function (top, left) {
        var bombUpObj = {
                top: top,
                left: left
            };
        return bombUpObj;
    }

    bombUp.addBombUp = function (top, left) {
        allbombUp.push(this.newBombUpObject(top, left));
    }

    bombUp.getBombUp = function (index) {
        return allbombUp[index];
    }

    bombUp.checkCollision = function (top, left) {
        if(allbombUp.length != 0){
            for(var i=0; i < allbombUp.length; i++) {            
                if (allbombUp[i].top == top && allbombUp[i].left == left){
                    // removes the bombUp power from fireup array
                    allbombUp.splice(i,1);
                    return true;                    
                }       
            }            
        }    
        return false; 
    }
});