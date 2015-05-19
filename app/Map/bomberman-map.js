'use strict';

//Custom directive to compile the calendar table
app.directive('bombermap', 
    ['bombService', 'brickService', 'boxService', 'powerUpService', 'enemyService', '$compile', '$http', 
    function (bomb, bricks, boxes, powerUp, enemy, $compile, $http) {

    //resets all the map components to avoid conflicts
    var resetAll = function () {
        enemy.reset();
        bricks.reset();
        boxes.reset();
        powerUp.reset();
        bomb.reset();
    }

    //generates the map given the data from a json object
    var generateMap = function (scope, data) {
        resetAll();
        if(data.length == 0) {
            alert("Something went wrong: there is no map available."); 
            return "";
        }
        var html = "";

        for(var i=0; i < data.length; i++){
            if(data[i].wall) {
                html += "<div class='image wall_{{map_type}}' style='top:"+ (50 * data[i].x) +"px;left:"+ (50 * data[i].y) +"px;'></div>";
                bricks.addBrick((50 * data[i].x), (50 * data[i].y));
            }else if(data[i].box) {                    
                html += "<div class='image box box_{{map_type}}' style='top:"+ (50 * data[i].x) +"px;left:"+ (50 * data[i].y) +"px;'></div>";                    
                boxes.addBox((50 * data[i].x), (50 * data[i].y));                    
                if(data[i].fireup){
                    html += "<div class='image fireup' style='top:"+ (50 * data[i].x) +"px;left:"+ (50 * data[i].y) +"px;'></div>";                    
                    powerUp.addPowerUp('fire', (50 * data[i].x), (50 * data[i].y));  
                }else if(data[i].bombup){
                    html += "<div class='image bombup' style='top:"+ (50 * data[i].x) +"px;left:"+ (50 * data[i].y) +"px;'></div>";                    
                    powerUp.addPowerUp('bomb', (50 * data[i].x), (50 * data[i].y));
                }
            }else if(data[i].enemy) {
                var id = enemy.addEnemy((50*data[i].x), (50*data[i].y));
                scope['enemy_'+id+'_top'] = (50*data[i].x);
                scope['enemy_'+id+'_left'] = (50*data[i].y);
                html += "<div class='image enemy enemy_{{map_type}} enemy_id_"+ id +"' style='top:{{enemy_"+id+"_top}}px;left:{{enemy_"+id+"_left}}px;'></div>";
            }
        }
        return html;
    }

    return {
        link: function (scope, element, attrs) {
            scope.$watch('map_type', function() {
                $http.jsonp('app/Map/games/map0'+ scope.map_type +'.json?callback=JSON_CALLBACK')
                    .success(function (data){                        
                        var linkToDOM = $compile(generateMap(scope, data)); 
                        // Links template and scope
                        var table = linkToDOM(scope);
                        // Appends compiled template to DOM directive
                        element.empty();
                        element.append(table);
                    })
                    .error(function (error) {
                        console.log("Request failed", error);
                    });
            });

            scope.$watch(boxes.getLength, function() {                 
                scope.boxesLeft = boxes.getLength();
            });

            scope.$watch(enemy.getLength, function() {                    
                scope.enemiesLeft = enemy.getLength();
            });            
        }
    };
}]);