'use strict';

app.service('bomb', ['bricks', 'boxes', 'fireUp', 'enemy', function(bricks, boxes, fireUp, enemy) {
    var bomb = this,
        bombLimit = 1, //Allowed number of bombs
        bombLength = 1, //Bombs power/length
        currentBombID,
        allBombs = [],
        flames = []; //Array with all flames shown

    //Inserts the bomb in the DOM and starts the countdown to explode
    bomb.insertBomb = function (data) {
        allBombs.push(data);
        bombLimit --; 
    }

    bomb.removeBomb = function (top, left) {
        if(allBombs.length != 0){
            for(var i=0; i < allBombs.length; i++) {            
                var res = allBombs[i].split(",");
                if (res[0] == top && res[1] == left){
                    allBombs.splice(i,1);                   
                }
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

    bomb.flamesAway = function (bombID) {
        flames.splice(bombID,1);
    }

    bomb.addFlames = function (bombID, top, left) {
        flames[bombID].push(top + ',' + left);
    }

    bomb.addNewBombFlames = function (bombID, top, left) { 
        flames[bombID] = [];
        flames[bombID].push(top + ',' + left);
    }

    bomb.getBombID = function () {
        return currentBombID;
    }

    bomb.checkCollision = function (top, left, remove) {
        if(allBombs.length != 0){
            for(var i=0; i < allBombs.length; i++) {            
                var res = allBombs[i].split(",");
                if (res[0] == top && res[1] == left){
                    if (remove){
                        currentBombID = i;
                        allBombs.splice(i,1);
                    }
                    return true;                    
                }
            }
        }
        return false;
    }

    bomb.checkFlamesCollision = function (top, left) {
        if(flames.length != 0){
            for(var i=bombLimit; i > 0; i--) {      
                if(flames[i]){
                    for(var j=0; j < flames[i].length; j++){
                        var res = flames[i][j].split(",");
                        if (res[0] == top && res[1] == left)
                            return true;                        
                    }
                }
            }
        }
        return false;
    }
}]);