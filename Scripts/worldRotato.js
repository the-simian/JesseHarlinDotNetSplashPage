
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
    var distanceFromCamera = 10;


    var numberOfObjects = 15;

    var numberOfSublayers = 5;

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


        var wAndH = randomNumber(50, 200);
        var subtractor = randomNumber(1, 10) * numberOfSublayers;

        for (var i = 0; i < numberOfSublayers ; i++) {


            wAndH = wAndH - subtractor;



            var data = {
                x: randomNumber(-10, 10),
                y: randomNumber(-10, 10),
                z: randomNumber(-10, 10),
                rotZ: randomNumber(-90, 90),
                scale: randomNumber(0.1, 4),
                speed: .1 * Math.random()
            };
            
            var translate2 = {
                
                'width': wAndH,
                'height' : wAndH,

                'transform':
                    'translateX(' + data.x + ' px) ' +
                    'translateY(' + data.y + ' px) ' +
                    'translateZ(' + data.z + ' px) ' +
                    'rotateZ(' + data.rotZ + ' deg)' +
                    'scale(' + data.s + ')'
            };


            var $layerObj = $('<div class="world-object-layer"></div>').css(translate2).data('transform',data);

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
    var counter = 0;
    var $objectLayers;

    function update() {

        $objectLayers = $objectLayers || $('.world-object-layer');

        $.each($objectLayers, function (index, element) {
            var $thisLayer = $(element);

            var oldData = $thisLayer.data('transform');

            var newData = {
                x: oldData.x,
                y: oldData.y,
                z: oldData.z,
                rotY: -worldYAngle,
                rotX: -worldXAngle,
                
                rotZ: oldData.rotZ,
                scale: oldData.scale
            };

            $thisLayer.css({
                'transform': 'rotateX( ' + newData.rotX + 'deg) rotateY( ' + newData.rotY + 'deg) '
            }).data('transform', newData);
            
            counter++;
        });

        

        requestAnimationFrame(update);
    }


    var handleMousemove = function (e) {
        worldYAngle = Math.floor(-(0.5 - (e.clientX / window.innerWidth)) * 180);
        worldXAngle = Math.floor((0.5 - (e.clientY / window.innerHeight)) * 180);
        updateView();
    };


    generateWorldObjects();

    $objectLayers = $('.world-object-layer');

    update();
    $window.on('mousemove', handleMousemove);


    

});






