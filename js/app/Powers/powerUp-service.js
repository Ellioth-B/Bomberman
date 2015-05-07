'use strict';

app.service('powerUpService', function () {
    var allPowerUp = [];

    return {
        //creates the power object with position (Top, left)
        //Type will be the type of power: 0 = bomb+; 1 = fire+
        newPowerUpObject: function (type, top, left) {
            var powerUpObj = {
                    type: type,
                    top: top,
                    left: left
                };
            return powerUpObj;
        },
        //adds a power object to our array
        addPowerUp: function (type, top, left) {
            allPowerUp.push(this.newPowerUpObject(type,top,left));
        },
        //checks collissions with the power icon and removes it from the view is true
        // which means the pj or fire went over it
        checkCollision: function (top, left) {
            if(allPowerUp.length != 0){
                for(var i=0; i < allPowerUp.length; i++) {            
                    if (allPowerUp[i].top == top && allPowerUp[i].left == left){
                        var powerType = allPowerUp[i].type;
                        allPowerUp.splice(i,1);
                        return powerType;                    
                    }       
                }            
            }    
            return false; 
        }
    };
});