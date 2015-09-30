'use strict';

app.service('bombService', function ($timeout) {
    var bombLimit = 1, //Allowed number of bombs
        bombRange = 1, //Bombs power/length
        bombID = 0,
        allBombs = []; //Array that will contain the active bombs

        //creates the bomb object with ID, position (Top, left) and flames position
    var newBombObject = function (id, top, left) {
        var bombObj = {
                bombID: id,
                top: top,
                left: left,
                active: false,
                flames: [{
                    top: null,
                    left: null
                }]
            };
        return bombObj;
    };

    //removes the bomb with ID = bombID from the array
    var removeBomb = function (bombID) {
        if(allBombs.length !== 0){
            for(var i=0; i<allBombs.length; i++) {
                if (allBombs[i].bombID == bombID)
                    allBombs.splice(i,1);
            }
        }
    };

    return {
        //creates a new bomb object and inserts it into our bombs array
        insert: function (top, left) {
            allBombs.push(newBombObject(bombID,top,left));
            var currentBombID = bombID;
            bombID++;
            bombLimit --;
            return currentBombID;
        },
        getLimit: function () {
            return bombLimit;
        },
        increaseLimit: function (){
            bombLimit ++;
        },
        getRange: function () {
            return bombRange;
        },
        increaseRange: function () {
            bombRange ++;
        },
        //Adds all the bomb flames into the bomb object
        addFlames: function (bombID, top, left) {
            if(allBombs.length !== 0){
                for(var i=0; i<allBombs.length; i++) {
                    if(allBombs[i].bombID == bombID){
                        allBombs[i].active = true;
                        allBombs[i].flames.push({'top':top, 'left':left});
                        return angular.element('<div class="image flame flame_num_'+ bombID +'" style="top:'+ top +'px;left:'+ left +'px;"></div>');
                    }
                }
            }
        },
        //checks bomb collissions and removes it if needed (when other bomb activates it)
        checkCollision: function (top, left, goOver) {
            if(allBombs.length !== 0){
                for(var i=0; i < allBombs.length; i++) {
                    if(allBombs[i].top == top && allBombs[i].left == left){
                        //Don't allow to go over the bomb if it is not active
                        if(goOver && !allBombs[i].active)
                            return true;
                    }
                }
            }
            return false;
        },
        //checks bomb flames collision, returns true if position matches a bomb flame
        checkFlamesCollision: function (top, left) {
            if(allBombs.length !== 0){
                for(var i=0; i<allBombs.length; i++) {
                    for(var j=0; j<allBombs[i].flames.length; j++) {
                        if(allBombs[i].flames[j].top == top && allBombs[i].flames[j].left == left)
                            return true;
                    }
                }
            }
            return false;
        },
        reset: function () {
            bombLimit = 1;
            bombRange = 1;
            bombID = 0;
            allBombs = [];
        },
        //Function to remove the bomb and flames
        flamesAway: function (bombID) {
            $timeout(function() {
                //removes the bomb flames from the view
                angular.element('.flame_num_'+ bombID).remove();
                //removes the bomb object
                removeBomb(bombID);
            }, 2000); //flames dissapear after 2 sec
        }
    };
});