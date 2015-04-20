'use strict';

//Custom directive to compile the calendar table
app.directive('bombermap', function ($compile, $http) {
    function link (scope, element, attrs) {
        $http.jsonp('js/games/map01.json?callback=JSON_CALLBACK')
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
        
        function generateMap (data) {
            if(data.length == 0) {
                alert("Something went wrong: there is no map available."); 
                return "";
            }
            var html = "";

            for(var i=0; i < data.length; i++){
                if(data[i].wall) {
                    html += "<div class='image wall' style='top:"+ (50 * data[i].x) +"px;left:"+ (50 * data[i].y) +"px;'></div>";
                    scope.bricks.push((50 * data[i].x) + "," + (50 * data[i].y));
                }else if(data[i].box) {
                    html += "<div class='image box' style='top:"+ (50 * data[i].x) +"px;left:"+ (50 * data[i].y) +"px;'></div>";                    
                    scope.boxes.push((50 * data[i].x) + "," + (50 * data[i].y));
                }
            }

            return html;
        }
    }

    return {
        link: link
    };
});