'use strict';

//Custom directive to compile the calendar table
app.directive('bombermap', ['bricks', 'boxes', 'fireUp', 'enemy', '$compile', '$http', function (bricks, boxes, fireUp, enemy, $compile, $http) {
    function link (scope, element, attrs) {
        $http.jsonp('js/app/Map/games/map01.json?callback=JSON_CALLBACK')
            .success(function (data){
                var linkToDOM = $compile(generateMap(data));
                // Links template and scope
                var table = linkToDOM(scope);
                // Appends compiled template to DOM directive
                element.empty();
                element.append(table);
            })
            .error(function (error) {
                console.log("Request failed", error);
            });
        
        var generateMap = function (data) {
            if(data.length == 0) {
                alert("Something went wrong: there is no map available."); 
                return "";
            }
            var html = "";

            for(var i=0; i < data.length; i++){
                if(data[i].wall) {
                    html += "<div class='image wall' style='top:"+ (50 * data[i].x) +"px;left:"+ (50 * data[i].y) +"px;'></div>";
                    bricks.addBrick((50 * data[i].x) + "," + (50 * data[i].y));
                }else if(data[i].box) {                    
                    html += "<div class='image box' style='top:"+ (50 * data[i].x) +"px;left:"+ (50 * data[i].y) +"px;'></div>";                    
                    boxes.addBox((50 * data[i].x) + "," + (50 * data[i].y));                    
                    if(data[i].fireup){
                        html += "<div class='image fireup' style='top:"+ (50 * data[i].x) +"px;left:"+ (50 * data[i].y) +"px;'></div>";                    
                        fireUp.addFireUp((50 * data[i].x) + "," + (50 * data[i].y));  
                    }
                }else if(data[i].enemy) {
                    html += "<div class='image enemy' style='top:"+ data[i].x +"px;left:"+ data[i].y +"px;'></div>";
                    enemy.addEnemy(data[i].x + "," + data[i].y);
                }
            }

            return html;
        }
    }

    return {
        link: link
    };
}]);