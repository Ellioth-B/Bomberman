'use strict';

app.service('bomb', ['bricks', 'boxes', 'fireUp', 'enemy', function(bricks, boxes, fireUp, enemy) {
    var bomb = this,
        bombLimit = 1, //Allowed number of bombs
        bombLength = 1, //Bombs power/length
        bombID = 0,
        allBombs = []; //Array that will contain the active bombs

    //creates the bomb object with ID, position (Top, left) and flames position
    bomb.newBombObject = function (id, top, left) {
        var bombObj = { 
                bombID: id,
                top: top,
                left: left,
                flames: [{
                    top:top, 
                    left:left
                }]
            };
        return bombObj;
    }

    //creates a new bomb object and inserts it into our bombs array
    bomb.insertBomb = function (top, left) {
        allBombs.push(this.newBombObject(bombID,top,left));
        var currentBombID = bombID;
        bombID++;
        bombLimit --;
        return currentBombID;
    }

    //removes the bomb with ID = bombID from the array
    bomb.removeBomb = function (bombID) {
        if(allBombs.length != 0){
            for(var i=0; i<allBombs.length; i++) {            
                if (allBombs[i].bombID == bombID)
                    allBombs.splice(i,1);
            }
        }
    }

    bomb.getBombLimit = function () {
        return bombLimit;
    }

    bomb.increaseBombLimit = function (){
        bombLimit ++;
    }

    bomb.getBombLength = function () {
        return bombLength;
    }

    bomb.increaseBombLength  = function () {
        bombLength ++;
    }

    //Adds all the bomb flames into the bomb object
    bomb.addFlames = function (bombID, top, left) {
        if(allBombs.length != 0){
            for(var i=0; i<allBombs.length; i++) {  
                if(allBombs[i].bombID == bombID){
                    allBombs[i].flames.push({'top':top, 'left':left});
                }
            }
        }
    }

    //checks bomb collissions and removes it if needed (when other bomb activates it)
    bomb.checkCollision = function (top, left, remove) {
        if(allBombs.length != 0){
            for(var i=0; i < allBombs.length; i++) {  
                if(allBombs[i].top == top && allBombs[i].left == left){
                   // if (remove)
                     //   allBombs.splice(i,1);
                    return true; 
                }
            }
        }
        return false;
    }

    //checks bomb flames collision, returns true if position matches a bomb flame
    bomb.checkFlamesCollision = function (top, left) {
        if(allBombs.length != 0){
            for(var i=0; i<allBombs.length; i++) {  
                for(var j=0; j<allBombs[i].flames.length; j++) {                      
                    if(allBombs[i].flames[j].top == top && allBombs[i].flames[j].left == left)
                        return true;
                }       
            }
        }
        return false;
    }
}]);