
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x] +
            'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());


$(document).ready(function () {



    var $world = $('#world');
    var $viewPort = $('#viewport');
    var $window = $(window);

    var worldXAngle = 0;
    var worldYAngle = 0;
    var distanceFromCamera = 0;


    var numberOfObjects = 56;
    
    var objectLayers = [];
    //**-------------


    function generateWorldObjects() {
        var objects = [];
        

        $world.html('');

        for (var i = 0; i < numberOfObjects; i++) {
            objects.push(createWorldObject());
        }

        $.each(objects, function (index, el) {
            $world.append($(el));
        });

    }


    function randomNumber(min, max) {


        return (Math.random() * (max -min)) + min;
    }

    function createWorldObject() {
        var layers = [];
        
        var cubeSize = randomNumber(5, 45);

        var translate = {
            'transform': 'translateZ(' + randomNumber(-256, 256) + 'px) rotateX(' + randomNumber(-256, 256) + 'deg) rotateY(' + randomNumber(-256, 256) + 'deg)',
            'left': randomNumber(10, 90) - (cubeSize * 0.5) + '%',
            'top': randomNumber(10, 90) - (cubeSize * 0.5) + '%',
            'height': cubeSize + '%',
            'width': cubeSize + '%'
        };
        




        for (var i = 0; i < 3 ; i++) {
            





            var data = {
                x: randomNumber(10, 90),
                y: randomNumber(10, 90),
                z: randomNumber(10, 90),
                rotZ: randomNumber(10, 90),
                s: randomNumber(0.3, 3),
                speed: .1 * Math.random()
            };
            
            var translate2 = {
                'transform':
                    'translateX(' + data.x + 'px) ' +
                    'translateY(' + data.y + 'px) ' +
                    'translateZ(' + data.z + 'px) ' +
                    'rotateZ(' + data.rotZ + 'deg)' +
                    'scale(' + data.s + ')'
            };


            var $layerObj = $('<div class="world-object-layer"></div>').css(translate2).data(data);
            objectLayers.push($layerObj);
            layers.push($layerObj);
        }

        var $obj = $('<div class="world-object"></div>').css(translate);

        $.each(layers, function (index, ele) {
            $obj.append($(ele));

        });

        
        return $obj;
    }


    //**--------------
    
    var updateView = function () {
        $world.css({
            'transform': 'translateZ(' + distanceFromCamera + 'px) rotateX(' + worldXAngle + 'deg) rotateY(' + worldYAngle + 'deg)'
        });

       
    };

    function update() {
        


        $.each(objectLayers, function(index, element) {
            var $thisLayer = $(element);
            var sp = $thisLayer.data('speed');
            var rotZ = $thisLayer.data('rotZ');

            $thisLayer.data('rotZ', rotZ + sp);

            var newTranslation = {
                'transform':
                    'translateX( ' + $thisLayer.data('x') + 'px )' +
                    'translateY( ' + $thisLayer.data('y') + 'px ) ' +
                    'translateZ( ' + $thisLayer.data('z') + 'px ) ' +
                    'rotateY( ' + (-1 * worldYAngle) + 'deg) ' +
                    'rotateX( ' + (-1 * worldXAngle) + 'deg) ' +
                    'rotateZ(' + $thisLayer.data('rotZ') + 'deg)' +    
                    'scale( ' + $thisLayer.data('s') + ')'
            };

            $thisLayer.css(newTranslation);
        });



        requestAnimationFrame(update);
    }


    var handleMousemove = function (e) {
        worldXAngle = -(0.5 - (e.clientX / $window.width())) * 180;
        worldYAngle = (0.5 - (e.clientY / $window.height())) * 180;
        updateView();
    };


    generateWorldObjects();
    update();
    $window.on('mousemove', handleMousemove);


    

});






