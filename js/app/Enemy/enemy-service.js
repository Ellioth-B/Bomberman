'use strict';

app.service('enemy', function () {
    var enemy = this,
        allEnemies = [];

    enemy.getAllEnemies = function () {
        return allEnemies;
    }

    enemy.addEnemy = function (data) {
        allEnemies.push(data);
    }

    enemy.getEnemy = function (index) {
        return allEnemies[index];
    }

    enemy.checkCollision = function (top, left, remove) {
        if(allEnemies.length != 0){
            for(var i=0; i < allEnemies.length; i++) {            
                var res = allEnemies[i].split(",");
                if (res[0] == top && res[1] == left){
                    if (remove)
                        allEnemies.splice(i,1);
                    return true;                    
                }
            }
        }
        return false;
    }
});