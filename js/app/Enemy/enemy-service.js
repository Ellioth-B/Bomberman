'use strict';

app.service('enemy', function () {
    var enemy = this,
        allEnemies = [];

    //creates the enemy object with position (Top, left)
    enemy.newEnemyObject = function (top, left) {
        var enemyObj = {
                top: top,
                left: left
            };
        return enemyObj;
    }

    enemy.getLength = function () {
        return allEnemies.length;
    }

    enemy.addEnemy = function (top, left) {
        allEnemies.push(this.newEnemyObject(top, left));
    }

    enemy.checkCollision = function (top, left, remove) {
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
});