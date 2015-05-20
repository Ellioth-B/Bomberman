'use strict';

app.service('powerUpService', function () {
    var allPowerUp = [];

    //returns type integer value. bomb = 0; fire = 1; heart = 2
    var powerType = function (type) {
        switch(type){
            case "bomb":
                return 0;
            break;
            case "fire":
                return 1;
            break;
            case "heart":
                return 2;
            break;
        }
    }

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
        addPowerUp: function (typeID, top, left) {
            allPowerUp.push(this.newPowerUpObject(powerType(typeID),top,left));
        },
        //returns the length of our powerUp array for the given power
        getLength: function (typeID) {
            var type = powerType(typeID), //returns 0 or 1
                length = 0;
            for(var i=0; i < allPowerUp.length; i++) {            
                if (allPowerUp[i].type === type)
                    length++;
            }  
            return length;
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
        },
        reset: function () {
            allPowerUp = [];
        }
    };
});