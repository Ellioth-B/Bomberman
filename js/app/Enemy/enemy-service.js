'use strict';

app.service('enemyService', function () {
    var allEnemies = [];

    return {
        //creates the enemy object with position (Top, left)
        newEnemyObject: function (top, left) {
            var enemyObj = {
                    top: top,
                    left: left
                };
            return enemyObj;
        },
        //returns the length of our enemies array
        getLength: function () {
            return allEnemies.length;
        },
        //adds an enemy object to the array
        addEnemy: function (top, left) {
            allEnemies.push(this.newEnemyObject(top, left));
        },
        //checks enemies collission
        checkCollision: function (top, left, remove) {
            if(allEnemies.length != 0){
                for(var i=0; i < allEnemies.length; i++) {            
                    if (allEnemies[i].top == top && allEnemies[i].left == left){
                        if (remove)
                            allEnemies.splice(i,1);
                        return true;                    
                    }
                }
            }
            return false;
        }
    };
});