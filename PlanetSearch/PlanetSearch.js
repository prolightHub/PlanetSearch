var canvas = document.getElementById("canvas");
    var processing = new Processing(canvas, function(processing) {
        processing.size(400, 400);
        processing.background(0xFFF);

        var mouseIsPressed = false;
        processing.mousePressed = function () { mouseIsPressed = true; };
        processing.mouseReleased = function () { mouseIsPressed = false; };

        var keyIsPressed = false;
        processing.keyPressed = function () { keyIsPressed = true; };
        processing.keyReleased = function () { keyIsPressed = false; };

        function getImage(s) {
            var url = "https://www.kasandbox.org/programming-images/" + s + ".png";
            processing.externals.sketch.imageCache.add(url);
            return processing.loadImage(url);
        }

        // use degrees rather than radians in rotate function
        var rotateFn = processing.rotate;
        processing.rotate = function (angle) {
            rotateFn(processing.radians(angle));
        };
  
  function getSound(s)
  {
     //var url = "https://www.kasandbox.org/programming-images/" + s + ".png";
            //processing.externals.sketch.imageCache.add(url);
            return {};
  };

        with (processing) {
/**
 * ▓▀▀▀  ▐    ▐    ▓▀   ▓  │▀▀▀▀  ▀■■■■■▀         
 * ▓  ▐  ▐   ▐ ▐   ▓ ▀  ▓  │         ▓  
 * ▓▬▬   ▐  ▐■■■▐  ▓  ▀ ▓  │▀▀       ▓
 * ▓     ▐  ▐   ▐  ▓   ▀▓  │         ▓                   
 * ▓     ▐  ▐   ▐  ▓    ▓  │▀▀▀▀     ▓  
 *   ■▀▀   ▐▬▬▬▬▬▬     ▐    |▀■            ▓   ▓  
 *  ▀■■■   ▐          ▐ ▐   |  ▀■    ■▀▀   ▓   ▓          
 *   ■■■▀  ▐▬▬▬▬     ▐■■■▐  |■■■■   ▀      ▓▀▀▀▓
 *         ▐         ▐   ▐  |  \    ▀      ▓   ▓
 *         ▐▬▬▬▬▬▬▬  ▐   ▐  |   \    ▀▀▀   ▓   ▓
 *
 * //Made By Prolight, this game is the original and is my BEST game so far! This is my first game with advanced collision math implemented. I still haven't thought of a storyline yet, and it needs more levels. Hope you enjoy!
 * //Debugged 1/27/2018
 * //Note : I used to be nitrobyte
 * 
 * More levels coming soon!
 * 
**/

var game = {
    gameState : "menu",
    sound : "off",
    debugMode : false, // Turning this on would be cheating!
    fps : 45,
}; 
var fader = {
    amt : 0,
    vel : 0,
    Vel : 1,
    max : 25,
};
var infoBar = {
    coins : 0,
    score : 0,
    hp : 25,
    maxHp : 25,
};
var levelInfo = {
    level : "Intro", 
    door  : 'a',
    unitWidth : 40,
    unitHeight : 40,
    width : width,
    height : height,
};
levelInfo.firstLevel = levelInfo.level;
levelInfo.firstDoor = levelInfo.door;
var loader = {};

var keys = [];
keyPressed = function()
{
    keys[keyCode] = true;
};
keyReleased = function()
{
    keys[keyCode] = false;
};

var controls = {
    restartLevel : function()
    {
        return keys[82];  
    },
    nextLevel : function()
    {
        return keys[78];
    },
    pause : function()
    {
        return keys[80];  
    },
};

var Camera = function(xPos, yPos, Width, Height)
{
    this.xPos = xPos;
    this.yPos = yPos;
    this.viewXPos = this.xPos;
    this.viewYPos = this.yPos;
    this.width = Width;
    this.height = Height;
    this.halfWidth = this.width/2;
    this.halfHeight = this.height/2;
    
    this.view = function(obj)
    {
        this.viewXPos = obj.xPos + obj.width/2;
        this.viewYPos = obj.yPos + obj.height/2;
        
        this.viewXPos = constrain(this.viewXPos, 
        this.halfWidth, levelInfo.width - this.halfWidth);
        this.viewYPos = constrain(this.viewYPos, 
        this.halfHeight, levelInfo.height - this.halfHeight);
        
        translate(this.xPos, this.yPos);
        if(levelInfo.width >= this.width)
        {
            translate(this.halfWidth - this.viewXPos, 0);
        }
        if(levelInfo.height >= this.height)
        {
            translate(0, this.halfHeight - this.viewYPos);
        }
    };
    
    this.inView = function(boundingBox)
    {
        if(boundingBox !== undefined)
        {
            var xPos = this.viewXPos - this.halfWidth;
            var yPos = this.viewYPos - this.halfHeight;
            return (boundingBox.xPos + boundingBox.width > xPos &&
                    boundingBox.xPos < xPos + this.width) &&
                    (boundingBox.yPos + boundingBox.height > yPos &&
                    boundingBox.yPos < yPos + this.height);
        }else{
            return true;
        }
    };
};
var cam = new Camera(0, 0, width, height);

var physics = {
    formulas : {
        crossProduct : function(point1, point2, point3)
        {
            return  (point1.xPos - point3.xPos) * 
                    (point2.yPos - point3.yPos) - 
                    (point2.xPos - point3.xPos) * 
                    (point1.yPos - point3.yPos);
        },
        calcTriArea : function(tri)
        {
            return (tri.width * tri.height)/2; 
        },
        calcVel : function(lastXPos, lastYPos, xPos, yPos)
        {
            var xPosDelta = (xPos - lastXPos);
            var yPosDelta = (yPos - lastYPos);
            var xPosDelta = (xPosDelta === 0) ? 0 : xPosDelta;
            var yPosDelta = (yPosDelta === 0) ? 0 : yPosDelta;
            return {
                xVel : floor(xPosDelta),   
                yVel : floor(yPosDelta),
            };
        },
    },
};
var observer = {
    collisionTypes : {
        "blank" : {
            colliding : function() 
            { 
                return {
                    colliding : false,   
                };
            },
            applyCollision : function() {},
        },
        "rectpoint" : {
            colliding : function(rect1, point1)
            {
                return {
                    colliding : (point1.xPos > rect1.xPos && 
                    point1.xPos < rect1.xPos + rect1.width) &&
                   (point1.yPos > rect1.yPos && 
                    point1.yPos < rect1.yPos + rect1.height),   
                };
            },
            applyCollision : function() {},
        },
        "rectslope" : {
            colliding : function(rect1, slope1) 
            { 
                var colliding = false;
                
                var rect1Point = {
                    xPos : 0,
                    yPos : 0,
                };
                
                var v1 = {
                    xPos : 0,
                    yPos : 0,
                };
                var v2 = {
                    xPos : 0,
                    yPos : 0,
                };
                var v3 = {
                    xPos : 0,
                    yPos : 0,
                };
                
                var binding = 1;
                
                switch(slope1.direction)
                {
                    case "leftup" : 
                            rect1Point.xPos = rect1.xPos;
                            rect1Point.yPos = rect1.yPos + rect1.height;
                            v1.xPos = slope1.xPos;
                            v1.yPos = slope1.yPos;
                            v2.xPos = slope1.xPos;
                            v2.yPos = slope1.yPos + slope1.height;
                            v3.xPos = slope1.xPos + slope1.width;
                            v3.yPos = slope1.yPos + slope1.height;
                        break;
                    
                    case "rightup" : 
                            rect1Point.xPos = rect1.xPos + rect1.width;
                            rect1Point.yPos = rect1.yPos + rect1.height; 
                            v1.xPos = slope1.xPos + slope1.width;
                            v1.yPos = slope1.yPos;
                            v2.xPos = slope1.xPos;
                            v2.yPos = slope1.yPos + slope1.height;
                            v3.xPos = slope1.xPos + slope1.width;
                            v3.yPos = slope1.yPos + slope1.height;
                        break;
                          
                    case "leftdown" : 
                            rect1Point.xPos = rect1.xPos;
                            rect1Point.yPos = rect1.yPos;
                            v1.xPos = slope1.xPos;
                            v1.yPos = slope1.yPos;
                            v2.xPos = slope1.xPos;
                            v2.yPos = slope1.yPos + slope1.height;
                            v3.xPos = slope1.xPos + slope1.width;
                            v3.yPos = slope1.yPos;
                        break;
                         
                    case "rightdown" : 
                            rect1Point.xPos = rect1.xPos + rect1.width;
                            rect1Point.yPos = rect1.yPos;  
                            v1.xPos = slope1.xPos;
                            v1.yPos = slope1.yPos;
                            v2.xPos = slope1.xPos + slope1.width;
                            v2.yPos = slope1.yPos;
                            v3.xPos = slope1.xPos + slope1.width;
                            v3.yPos = slope1.yPos + slope1.height;
                            binding = 0;
                        break;
                }
                
                var b1, b2, b3;
                
                b1 = (physics.formulas.crossProduct(rect1Point, v1, v2) < binding);
                b2 = (physics.formulas.crossProduct(rect1Point, v2, v3) < binding);
                b3 = (physics.formulas.crossProduct(rect1Point, v3, v1) < binding);
                
                colliding = ((b1 === b2) && (b2 === b3));
                
                return {
                    colliding : colliding,   
                };
            },
            applyCollision : function(rect1, slope1, physicsInfo, collisionInfo) 
            {
                var process = false;
                if(rect1.physics.movement === "mobile" &&
                slope1.physics.movement === "fixed")
                {
                    process = true;
                }
                if(process)
                {
                    switch(slope1.direction)
                    {
                        case "leftup" :
                        {
                            var r1 = {
                                width : rect1.xPos - slope1.xPos,
                                height : (slope1.yPos + slope1.height) - 
                                (rect1.yPos + rect1.height),
                            };
                            if(r1.width > r1.height)
                            {
                                var delta = r1.width - r1.height;
                                r1.width -= delta;
                                r1.height += delta;
                            }
                            else if(r1.height > r1.width)
                            {
                                var delta = r1.height - r1.width;
                                r1.width += delta;
                                r1.height -= delta;
                            }
                            var velBinding = 1;
                            rect1.inAir = false;
                            rect1.yVel = min(-rect1.xVel, velBinding);
                            rect1.xPos = (slope1.xPos + rect1.width) - r1.width;
                            rect1.yPos = (slope1.yPos + r1.height) - rect1.height;
                            if(rect1.xVel < 0 && rect1.xPos <= (
                            slope1.xPos) + abs(rect1.xVel))
                            {
                                rect1.xPos = slope1.xPos;
                                rect1.yPos = slope1.yPos - rect1.height;
                                rect1.xVel = -velBinding;
                            }
                        }
                        break;
                        
                        case "rightup" :
                        {
                            var r1 = {
                                width : (slope1.xPos + slope1.width) - 
                                (rect1.xPos + rect1.width),
                                height : (slope1.yPos + slope1.height) - 
                                (rect1.yPos + rect1.height),
                            };
                            if(r1.width > r1.height)
                            {
                                var delta = r1.width - r1.height;
                                r1.width -= delta;
                                r1.height += delta;
                            }
                            else if(r1.height > r1.width)
                            {
                                var delta = r1.height - r1.width;
                                r1.width += delta;
                                r1.height -= delta;
                            }
                            var velBinding = 1;
                            rect1.inAir = false;
                            rect1.yVel = min(rect1.xVel, velBinding);
                            rect1.xPos = (slope1.xPos + r1.width) - rect1.width;
                            rect1.yPos = (slope1.yPos + r1.height) - rect1.height;
                            if(rect1.xVel > 0 && rect1.xPos + rect1.width >= (
                            slope1.xPos + slope1.width) - abs(rect1.xVel))
                            {
                                rect1.xPos = (slope1.xPos + slope1.width) - 
                                rect1.width;
                                rect1.yPos = slope1.yPos - rect1.height;
                                rect1.xVel = velBinding;
                            }
                        }
                        break;
                        
                        case "leftdown" :
                        {
                            var r1 = {
                                width : rect1.xPos - slope1.xPos,
                                height : rect1.yPos - slope1.yPos,
                            };
                            if(r1.width > r1.height)
                            {
                                var delta = r1.width - r1.height;
                                r1.height += delta;
                            }
                            else if(r1.height > r1.width)
                            {
                                var delta = r1.height - r1.width;
                                r1.height -= delta;
                            }
                            rect1.yVel = 0;
                            rect1.inAir = true;
                            rect1.yPos = (slope1.yPos + rect1.height) - r1.height;
                        }
                        break;
                        
                        case "rightdown" :
                        {
                            var r1 = {
                                width : (slope1.xPos + slope1.width) - 
                                (rect1.xPos + rect1.width),
                                height : rect1.yPos - slope1.yPos,
                            };
                            if(r1.width > r1.height)
                            {
                                var delta = r1.width - r1.height;
                                r1.height += delta;
                            }
                            else if(r1.height > r1.width)
                            {
                                var delta = r1.height - r1.width;
                                r1.height -= delta;
                            }
                            rect1.inAir = true;
                            rect1.yPos = (slope1.yPos + rect1.height) - r1.height;
                            if(rect1.yVel < 0 && rect1.yPos <= slope1.yPos + 
                            abs(rect1.yVel))
                            {
                                rect1.yVel = 2;
                                rect1.yPos = slope1.yPos - rect1.height;
                                rect1.yPos = (slope1.yPos + slope1.height) - 
                                rect1.height;
                            }else{
                                rect1.yVel = 0;
                            }
                        }
                        break;
                    }
                }
            },
        },
        "rectcircle" : {
            colliding : function(rect1, circle1) 
            {
                var colliding = false;
                var onSides = false;
                var quadrant = "none"; 
                var rect1Sides = {
                    left : rect1.xPos,
                    right : rect1.xPos + rect1.width,
                    top : rect1.yPos,
                    bottom : rect1.yPos + rect1.height,
                };
                
                //Find Where our rectangle lies
                if(rect1Sides.right < circle1.xPos)
                {
                    if(rect1Sides.bottom < circle1.yPos)
                    {
                        quadrant = "lefttop";
                    }
                    else if(rect1Sides.top > circle1.yPos)
                    {
                        quadrant = "leftbottom"; 
                    }else{
                        quadrant = "left"; 
                    }
                } 
                else if(rect1Sides.left > circle1.xPos)
                {
                    if(rect1Sides.bottom  < circle1.yPos)
                    {
                        quadrant = "righttop";
                    }
                    else if(rect1Sides.top > circle1.yPos)
                    {
                        quadrant = "rightbottom"; 
                    }else{
                        quadrant = "right"; 
                    }
                }else{
                    if(rect1Sides.bottom < circle1.yPos)
                    {
                        quadrant = "top";
                    }
                    else if(rect1Sides.top > circle1.yPos)
                    {
                        quadrant = "bottom"; 
                    }
                }
                
                //Get the distance between the nearest point to the 
                //center on the rectangle to the center of the circle.
                var distance = 0;
                switch(quadrant)
                {
                    case "lefttop" : 
                            distance = dist(rect1Sides.right, rect1Sides.bottom, 
                            circle1.xPos, circle1.yPos);
                        break;
                        
                    case "leftbottom" : 
                            distance = dist(rect1Sides.right, rect1Sides.top, 
                            circle1.xPos, circle1.yPos);
                        break;
                        
                    case "righttop" : 
                            distance = dist(rect1Sides.left, rect1Sides.bottom, 
                            circle1.xPos, circle1.yPos);
                        break;
                        
                    case "rightbottom" : 
                            distance = dist(rect1Sides.left, rect1Sides.top, 
                            circle1.xPos, circle1.yPos);
                        break;
                        
                    default :
                            distance = 0;
                            onSides = true;
                        break;
                }
                
                if(!onSides)
                {
                    colliding = (distance < circle1.radius);
                }else{
                    colliding = true;
                }
                
                return {
                    colliding : colliding,
                    onSides : onSides,
                    quadrant : quadrant,
                    distance : distance,
                };
            },
            applyCollision : function(rect1, circle1, physicsInfo, collisionInfo) 
            {
                var process = false;
                if(rect1.physics.movement === "mobile" &&
                circle1.physics.movement === "fixed")
                {
                    process = true;
                }
                if(process)
                {
                    var tri1 = {
                        width : 0,
                        height : 0,
                        hyp : collisionInfo.distance,
                    };
                    
                    if(circle1.xPos > rect1.xPos)
                    {
                        tri1.width = circle1.xPos - rect1.xPos;
                    }
                    else if(rect1.xPos > circle1.xPos)
                    {
                        tri1.width = rect1.xPos - circle1.xPos;
                    }
                    if(circle1.yPos > rect1.yPos)
                    {
                        tri1.height = circle1.yPos - rect1.yPos;
                    }
                    else if(rect1.yPos > circle1.yPos)
                    {
                        tri1.height = rect1.yPos - circle1.yPos;
                    }
                    
                    var tri2 = {
                        width : 0,
                        height : 0,
                        hyp : circle1.radius - tri1.hyp,
                    };
                    tri2.width = (tri1.width * tri2.hyp) / tri1.hyp;
                    tri2.height = (tri1.height * tri2.hyp) / tri1.hyp;
                    
                    var lastRect1Pos = {
                        xPos : rect1.xPos,
                        yPos : rect1.yPos,
                    };
                    
                    if(!collisionInfo.onSides)
                    {
                        switch(collisionInfo.quadrant)
                        {
                            case "lefttop" :
                                rect1.yVel = 0;
                                rect1.inAir = false;
                                rect1.xPos -= tri2.width;
                                rect1.yPos -= tri2.height;
                            break;
                            
                            case "leftbottom" :
                                rect1.xVel = 0;
                                rect1.inAir = true;
                                rect1.xPos -= tri2.width;
                                rect1.yPos += tri2.height;
                            break;
                            
                            case "righttop" :
                                rect1.yVel = 0;
                                rect1.inAir = false;
                                rect1.xPos += tri2.width;
                                rect1.yPos -= tri2.height;
                            break;
                            
                            case "rightbottom" :
                                rect1.xVel = 0;
                                rect1.inAir = true;
                                rect1.xPos += tri2.width;
                                rect1.yPos += tri2.height;
                            break; 
                        }
                    }else{
                        switch(collisionInfo.quadrant)
                        {
                            case "left" : 
                                    rect1.xVel = 0;
                                    rect1.outerXVel = -1;
                                    rect1.xPos = (circle1.xPos - 
                                    (circle1.radius + rect1.width));
                                break;
                                
                            case "right" :
                                    rect1.xVel = 0;
                                    rect1.outerXVel = 1;
                                    rect1.xPos = circle1.xPos + circle1.radius;
                                break;
                                
                            case "top" :
                                    rect1.inAir = false;
                                    rect1.yVel = 0;
                                    rect1.yPos = circle1.yPos - 
                                    (circle1.radius + rect1.height);
                                break;
                                
                            case "bottom" :
                                    rect1.inAir = true;
                                    rect1.yVel = 0;
                                    rect1.yPos = circle1.yPos + circle1.radius;
                                break;
                        }
                    }
                }
            },
        },
        "rectrect" : {
            colliding : function(rect1, rect2)
            {
                return  { 
                    colliding : 
                        (rect1.xPos + rect1.width  > rect2.xPos &&
                         rect1.xPos                < rect2.xPos + rect2.width) &&
                        (rect1.yPos + rect1.height > rect2.yPos &&
                         rect1.yPos                < rect2.yPos + rect2.height),
                };
            },
            touching : function(rect1, rect2)
            {
                return  { 
                    touching : 
                        (rect1.xPos + rect1.width  >= rect2.xPos &&
                         rect1.xPos                <= rect2.xPos + rect2.width) &&
                        (rect1.yPos + rect1.height >= rect2.yPos &&
                         rect1.yPos                <= rect2.yPos + rect2.height),
                };
            },
            applyCollision : function(obj1, obj2, physicsInfo, collisionInfo)
            {
                var mobileObj;
                var fixedObj;
                var process = false;
                
                if(obj1.physics.movement === "mobile" &&
                  (obj2.physics.movement === "fixed" || obj2.physics.usesCollision))
                {
                    mobileObj = obj1;
                    fixedObj = obj2;
                    process = true;
                }else
                if(obj2.physics.movement === "mobile" &&
                  (obj1.physics.movement === "fixed" || obj1.physics.usesCollision))
                {
                    mobileObj = obj2;
                    fixedObj = obj1;
                    process = true;
                }
                if(process)
                {
                    var sidesBool = {
                        top : true, 
                        bottom : true,
                        left : true,
                        right : true,
                    };
                    var sidesOfFixedObjBool = sidesBool;
                    var sideBoundariesBool = sidesBool;
                    
                    if(fixedObj.physics.sides !== undefined)
                    {
                        sidesOfFixedObjBool = fixedObj.physics.sides; 
                        if(!sidesOfFixedObjBool.left)
                        {
                            sideBoundariesBool.right = (
                            fixedObj.xPos + mobileObj.width <= mobileObj.xPos + 
                            abs(mobileObj.xVel));
                        }
                        if(!sidesOfFixedObjBool.right)
                        {
                            sideBoundariesBool.left = (
                            mobileObj.xPos + mobileObj.width <= fixedObj.xPos + 
                            abs(mobileObj.xVel));
                        }
                        if(!sidesOfFixedObjBool.bottom)
                        {
                            sideBoundariesBool.top = (
                            mobileObj.yPos + mobileObj.height <= fixedObj.yPos + 
                            abs(mobileObj.yVel));
                        }
                        if(!sidesOfFixedObjBool.top)
                        {
                            sideBoundariesBool.bottom = (
                            fixedObj.yPos - abs(mobileObj.yVel) <= mobileObj.yPos - mobileObj.height);
                        }
                    }
                    
                    // LEFT
                    if(sidesOfFixedObjBool.right && sideBoundariesBool.right && 
                    (physicsInfo.xVel < 0 || physicsInfo.direction === "left")) 
                    {
                        mobileObj.xVel = 0;
                        mobileObj.xPos = fixedObj.xPos + fixedObj.width;
                    }
                    // RIGHT
                    if(sidesOfFixedObjBool.left && sideBoundariesBool.left && 
                    (physicsInfo.xVel > 0 || physicsInfo.direction === "right")) 
                    {
                        mobileObj.xVel = 0;
                        mobileObj.xPos = fixedObj.xPos - mobileObj.width;
                    }
                    // TOP
                    if(sidesOfFixedObjBool.bottom && sideBoundariesBool.bottom && 
                    (physicsInfo.yVel < 0 || physicsInfo.direction === "up")) 
                    {
                        mobileObj.yVel = 0;
                        mobileObj.inAir = true;
                        mobileObj.yPos = fixedObj.yPos + fixedObj.height;
                    }
                    // BOTTOM
                    if(sidesOfFixedObjBool.top && sideBoundariesBool.top &&
                    (physicsInfo.yVel > 0 || physicsInfo.direction === "down")) 
                    {
                        mobileObj.yVel = 0;
                        mobileObj.inAir = false;
                        mobileObj.yPos = fixedObj.yPos - mobileObj.height;
                    }
                }
            },
        },
    },
    colliding : function(obj1, obj2)
    {
        var info = observer.getType(
            obj1.physics.shape, 
            obj2.physics.shape,
            observer.collisionTypes
        );
        var collided = false;
 
        if(!info.flipped)
        {
            collided = observer.collisionTypes[info.type].colliding(obj1, obj2);
        }else{
            collided = observer.collisionTypes[info.type].colliding(obj2, obj1);
        }
        return collided;
    },
    touching : function(obj1, obj2)
    {
        var info = observer.getType(
            obj1.physics.shape, 
            obj2.physics.shape,
            observer.collisionTypes
        );
        var touched = false;
        
        if(observer.collisionTypes[info.type].touching !== undefined)
        {
            if(!info.flipped)
            {
                touched = observer.collisionTypes[info.type].touching(obj1, obj2);
            }else{
                touched = observer.collisionTypes[info.type].touching(obj2, obj1);
            }
        }
        return touched;
    },
    boundingBoxesColliding : function(box1, box2)
    {
        return observer.collisionTypes.rectrect.colliding(box1, box2);
    },
    boundingBoxesTouching : function(box1, box2)
    {
        return observer.collisionTypes.rectrect.touching(box1, box2);
    },
    applyCollision : function(obj1, obj2, physicsInfo, collisionInfo)
    {
        var info = observer.getType(
            obj1.physics.shape, 
            obj2.physics.shape,
            observer.collisionTypes
        );
        if(!info.flipped)
        {
            observer.collisionTypes[info.type].applyCollision(
            obj1, obj2, physicsInfo, collisionInfo);
        }else{
            observer.collisionTypes[info.type].applyCollision(
            obj2, obj1, physicsInfo, collisionInfo);
        }
    },
    getType : function(name1, name2, delegate)
    {
        var typeToReturn = "blank";
        var flipped = false;
        var type = name1 + name2;
        if(typeof delegate[type] !== "undefined")
        {
            typeToReturn = type;
        }else{
            //Flip shapes
            flipped = true;
            type = name2 + name1;
            if(typeof delegate[type] !== "undefined")
            {
                typeToReturn = type;
            }
        }
        return {
            type : typeToReturn,
            flipped : flipped,
        };
    },
};

var GameObject = function(config)
{
    this.xPos = config.xPos;
    this.yPos = config.yPos;
    this.width = config.width;
    this.height = config.height;
    this.color = config.color;
    this.type = "block";
    this.name = config.name;
    this.index = config.index;
    this.delete = false;
    this.usingOnSave = false;
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height);
    };
    
    this.update = function() {};
    this.onCollide = function(obj) {};
    this.updateVel = function() {};
    this.updateLife = function() {};
    this.onSave = function() {};
    this.save = function()
    {
        if(this.usingOnSave)
        {
            this.onSave();   
        }
    };
    this.remove = function()
    {
        this.save();
        this.delete = true;   
    };
};
var createArray = function(Obj)
{
    var array = [];
    array.Obj = Obj;
    array.add = function(config)
    {
        this.push(new this.Obj(config));
    };
    array.draw = function() 
    {
        for(var i = 0; i < this.length; i++)
        {
            this[i].draw();   
        }
    };
    array.update = function() 
    {
        for(var i = 0; i < this.length; i++)
        {
            this[i].update();  
            if(this[i].delete !== undefined && this[i].delete)
            {
                this.splice(i, 1);
            }
        }
    };
    array.clear = function()
    {
        this.splice(0, this.length);  
        this.refs = {};
    };
    return array;
};

var Button = function(config)
{
    this.xPos = config.xPos;
    this.yPos = config.yPos;
    this.width = config.width;
    this.height = config.height;
    this.color = config.color || color(10, 10, 10, 50);
    
    this.message = config.message || "";
    this.textSize = config.textSize || 12.5;
    this.textColor = config.textColor || 0;
    
    this.name = config.name;
    
    this.draw = function() 
    {
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height);
        fill(0, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(this.textSize);
        fill(this.textColor);
        text(this.message, this.xPos + this.width/2, this.yPos + this.height/2);
    };
    
    this.IsMouseInside = function()
    {
        return observer.collisionTypes.rectpoint.colliding(this, {
            xPos : mouseX,
            yPos : mouseY,
        }).colliding;  
    };
};
var buttons = createArray(Button);
buttons.refs = {};
buttons.add = function(config)
{
    this.push(new Button(config)); 
    this.refs[config.name] = this.length - 1;
};
buttons.getButton = function(name)
{
    if(this.refs[name] !== undefined &&
    this[this.refs[name]] !== undefined)
    {
        return this[this.refs[name]];
    }else{
        println("Error referencing button '" + name + "'.");
        return new Button({});    
    }  
};

var Bar = function(x, y, w, h, c)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    
    this.draw = function(amt, max) 
    {
        fill(this.c);
        rect(this.x, this.y, (this.w * amt) / max, this.h);
        noFill();
        if(!this.noStroke) 
        { 
            strokeWeight(1);
            stroke(0, 0, 0, 50); 
        }
        rect(this.x, this.y, this.w, this.h);
        noStroke();
    };
    
};

var soundUser = {
    lastPlayedSound : "",
};
soundUser.onPlaySound = function(place, sound, doNotPlayLastSound)
{
    if(!(doNotPlayLastSound && this.lastPlayedSound === sound))
    {
        if(game.sound === "on")
        {
            if(sound !== undefined)
            {
                playSound(place[sound]);
            }
        }
        this.lastPlayedSound = sound;
    }
};

var screenUtils = {
    timer : 0,
    stopped : false,
}; 
screenUtils.levelProgressBar = new Bar(0, 395, width, 5, color(0, 0, 0, 50));//color(32, 104, 168, 100));
screenUtils.levelProgressBar.noStroke = true;
screenUtils.bossBar = new Bar(0, 20, width, 5, color(0, 0, 0, 100));
screenUtils.bossBar.noStroke = true;
screenUtils.shakeScreen = function(intensity, time)
{
    this.stopped = false;
    if(this.timer < time && !this.stopped)
    {
        this.lastXPos = random(-intensity, intensity);
        this.lastYPos = random(-intensity, intensity);
        translate(this.lastXPos, this.lastYPos);
        this.timer++;
    }else{
        this.timer = 0;   
        this.stopped = true;
        translate(0, 0);
        resetMatrix();
    }
};
screenUtils.drawToImage = function(obj)
{
    obj.imageIndex = obj.imageIndex || 0;
    obj.images = obj.images || [];
    stroke(0, 0, 0);
    fill(0, 0, 0);
    rect(0, 0, obj.width, obj.height); 
    noStroke();
    var lastXPos = obj.xPos; 
    var lastYPos = obj.yPos;
    obj.xPos = 0;
    obj.yPos = 0;
    obj.draw();
    obj.xPos = lastXPos;
    obj.yPos = lastYPos;
    obj.images.push(get(0, 0, obj.width, obj.height));
    obj.draw = function()
    {  
        image(this.images[obj.imageIndex], this.xPos, this.yPos, this.width, this.height);
    };
};

var Particle = function(x, y, d, c)
{
    this.position = new PVector(x, y);
    this.acceleration = new PVector(0, 0.2);
    this.velocity = new PVector(random(-2, 2), random(-3, 3));
    
    this.color = c;
    this.diameter = d;
    
    this.lifeTime = 50;
    this.life = 0;
    
    this.kill = false;
    
    this.draw = function() 
    {   
        noStroke();
        fill(this.color);
        ellipse(this.position.x, this.position.y, 
        this.diameter * random(0.5, 1.5), 
        this.diameter * random(0.5, 1.5));
    };
    
    this.update = function()
    {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity); 
        this.life += 1;
        
        if(this.life >= this.lifeTime)
        {
            this.kill = true;   
        }
    };
};

var particles = [];
particles.maxLength = 300;
particles.create = function(x, y, amt, radius, color, velocityPV, lifeTime)
{
    for(var i = 0; i < amt; i++)
    {
        var particle = new Particle(x + random(-radius, radius), y + random(-radius, radius), 5, color);
        particle.lifeTime = i; 
        if(velocityPV !== undefined)
        {
            particles.velocity = velocityPV;
        }
        if(lifeTime !== undefined)
        {
            particles.lifeTime = lifeTime;
        }
        this.push(particle);
    }
};
particles.draw = function()
{
    for(var i = 0; i < this.length; i++)
    {
        this[i].draw();
    }
};
particles.update = function()
{
    for(var i = 0; i < this.length; i++)
    {
        this[i].update();
        if(this[i].kill)
        {
            this.splice(i, 1);   
        }
    }
    if(this.length > this.maxLength)
    {
        this.length = this.maxLength;
    }
};

var lavaParticles = [];
lavaParticles.timer = 0;
lavaParticles.time = 75;
lavaParticles.maxLength = 50;
lavaParticles.create = particles.create;
lavaParticles.update = particles.update;
lavaParticles.draw = particles.draw;

var Cloud = function(config)
{
    this.xPos = config.xPos;
    this.yPos = config.yPos;
    this.width = config.width;
    this.height = config.height;
    this.color = config.color;
    
    this.xSpeed = config.xSpeed || 0;
    this.xVel = this.xSpeed;
    this.maxXVel = config.maxXVel || 5;
    
    this.ySpeed = config.ySpeed || 0;
    this.yVel = this.ySpeed;
    this.maxYVel = config.maxYVel || 5;
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        ellipse(this.xPos, this.yPos, this.width, this.height);
    };
    
    this.update = function()
    {
        if(this.xPos < -(this.width / 2))
        {
            this.xPos = width + this.width / 2;    
        }
        if(this.xPos > width + this.width / 2)
        {
            this.xPos = -(this.width / 2);    
        }
        this.xVel = constrain(this.xVel, -this.maxXVel, this.maxXVel);
        this.xPos += this.xVel;
        
        if(this.yPos < -(this.height / 2))
        {
            this.yPos = height + this.height / 2;    
        }
        if(this.yPos > height + this.height / 2)
        {
            this.yPos = -(this.height / 2);    
        }
        this.yVel = constrain(this.yVel, -this.maxYVel, this.maxYVel);
        this.yPos += this.yVel;
    };
};
var clouds = createArray(Cloud);
clouds.generate = function(amt)
{
    for(var i = 0; i < amt; i++)
    {
        this.add({
            xPos : random(0, width),
            yPos : random(height / 10, height / 2.5),
            height : random(15, 35),
            width : random(50, 150),
            color : color(255, 255, 255, random(100, 200)),
            xSpeed : random(-4, 4) / 8,
        });
    }
};
var sun = function(xPos, yPos, diameter)
{
    noStroke();
    fill(207, 207, 76, 200);
    ellipse(xPos, yPos, diameter, diameter);
};
var planet = function(x, y, d)
{
    noStroke();
    pushMatrix();
        translate(-230, -335);
        translate(x, y);
        scale(0.87);
        rotate(10);
        fill(25, 149, 207, 150);
        ellipse(330, 338, d || 200, d || 200);
        pushMatrix();
            translate(267, 275);
            rotate(48);
            fill(255, 255, 255, 30);
            ellipse(0, 0, 21, 89);
        popMatrix();
        
        strokeWeight(10);
        stroke(25, 59, 196, 100);
        line(220, 425, 437, 234);
        
        strokeWeight(5);
        stroke(97, 157, 176, 50);
        line(210, 419, 456, 202);
        line(230, 430, 475, 220);
    popMatrix();
};
var iceTower = function(x, y)
{
    pushMatrix();
        translate(-30, -200);
        translate(x, y);
        fill(95, 192, 227, 150);
        triangle(103, 194, 129, 233, 47, 380);
        triangle(54, 233, 105, 230, 31, 399);
        triangle(19, 243, 68, 225, 22, 405);
    popMatrix();
};
var hill = function(x, y, sc, l)
{
    pushMatrix();
        translate(180, 95);
        scale(sc);
        translate(x, y);
        rotate(145);
        fill(83, 194, 214, 200);
        for(var i = 0; i < 4; i++)
        {
            rect(i * 29, 0, 30, l || 100, 12);
        }
    popMatrix();
};

var backgrounds = {
    background : "ice",
    backgrounds : {
        "ice" : {
            load : function()
            {
                background(147, 221, 250);
                planet(342, 319, 220);
                
                noStroke();
                iceTower(22, 188);
                iceTower(142, 272);
                
                hill(-38, 243, 1.2, 125);
                hill(24, 256, 1.2, 125);
                
                //ground
                fill(41, 131, 143);
                ellipse(69, 409, 155, 75);
                ellipse(243, 409, 268, 67);
                
                fill(38, 157, 173);
                ellipse(166, 409, 126, 75);
                
                //ice spikes
                fill(95, 192, 227, 150);
                triangle(0, 329, 0, 400, 222, 296);
                triangle(0, 380, 0, 400, 280, 302);
                
                fill(30, 93, 201, 200);
                triangle(36, 364, 13, 339, 209, 300);
                triangle(36, 379, 13, 391, 269, 304);
                
                fill(95, 192, 227, 150);
                triangle(400, 400, 339, 400, 185, 275);
                triangle(357, 400, 291, 400, 159, 313);
                
                fill(30, 93, 201, 200);
                triangle(358, 406, 196, 282, 335, 369);
                triangle(338, 400, 313, 399, 159, 313);
                
                //shanding
                fill(112, 64, 31, 20);
                rect(0, 387, 400, 14, 100);
                fill(0, 0, 0, 4);
                ellipse(200, 360, 400, 100);
                
                backgrounds.backgrounds.ice.img = get(0, 150, width, height - 150);
                clouds.generate(5, 15);
            },
            draw : function()
            {
                image(backgrounds.backgrounds.ice.img, 0, 150, width, height - 150);
                sun(100, 80, 50);
                clouds.draw();
                clouds.update();
            },
        },
        "lava" : {
            load : function()
            {
                background(147, 221, 250);
                noStroke();
                fill(207, 83, 45, 230);
                
                beginShape();
                vertex(1, 376);
                vertex(135, 214);
                vertex(155, 214);
                vertex(220, 380);
                endShape(CLOSE);
                
                beginShape();
                vertex(148, 376);
                vertex(259, 214);
                vertex(277, 214);
                vertex(304, 380);
                endShape(CLOSE);
                
                fill(207, 83, 45);
                quad(-13, 400, 153, 400, 123, 261, 45, 284);
                
                beginShape();
                vertex(245, 349);
                vertex(405, 400);
                vertex(382, 227);
                vertex(309, 243);
                endShape(CLOSE);
                
                beginShape();
                vertex(120, 374);
                vertex(351, 383);
                vertex(264, 317);
                vertex(233, 267);
                endShape(CLOSE);
                
                triangle(119, 377, 221, 464, 264, 237);
                
                fill(230, 95, 46);
                triangle(120, 374, 233, 267, 253, 299);
                triangle(132, 304, 123, 262, 45, 285);
                triangle(381, 227, 286, 283, 310, 243);
                
                fill(200, 100, 54);
                ellipse(200, 390, 500, 40);
                
                backgrounds.backgrounds.lava.img = get(0, 150, width, height - 150);
            },
            draw : function()
            {
                image(backgrounds.backgrounds.lava.img, 0, 150, width, height - 150);
                lavaParticles.timer++;
                if(lavaParticles.timer > lavaParticles.time)
                {
                    lavaParticles.timer = 0;
                    lavaParticles.create(147, 214, random(15, 20), 3, 
                    color(240, 100, 50),20);
                    lavaParticles.create(271, 220, random(15, 20), 5, color(240, 
                    random(80, 100), 51));
                }
                lavaParticles.draw();
                lavaParticles.update();
                sun(100, 80, 50);
                clouds.draw();
                clouds.update();
            },
        },
        "underground" : {
            load : function()
            {
                background(57, 66, 77);
                var scaling = 18;
                var colorScaling = -20;
                noStroke();
                for(var i = 0; i < 5; i++)
                {
                    var c = i * colorScaling; 
                    fill(61 + c, 80 + c, 102 + c);
                    var j = i * scaling;
                    rect(j, j, width - j * 2,  height - j * 2);
                }
                
                backgrounds.backgrounds.underground.img = get(0, 0, width, height);
            },
            draw : function()
            {
                image(backgrounds.backgrounds.underground.img, 0, 0, width, height);
            },
        },
    },
    load : function()
    {
        for(var i in backgrounds.backgrounds)
        {
            backgrounds.backgrounds[i].load();
        }
    },
    draw : function() 
    {
        var place = backgrounds.backgrounds[backgrounds.background];
        place.draw();
    },
};

var gameObjects = createArray([]);
gameObjects.refs = {};
gameObjects.inventory = {};
gameObjects.addArray = function(name, array)
{
    gameObjects.refs[name] = this.length;
    array.name = name;
    this.push(array);  
};
gameObjects.getArray = function(name)
{
    if(this.refs[name] !== undefined &&
    this[this.refs[name]] !== undefined)
    {
        return this[this.refs[name]];
    }else{
        println("Error referencing gameObject array '" + name + "'.");
        return createArray(GameObject);    
    }
};
gameObjects.addObject = function(name, config)
{
    var array = this.getArray(name);
    config.name = name;
    config.index = array.length;
    if(this.inventory[name + array.length] === undefined)
    {
        this.inventory[name + array.length] = {};  
    }
    array.add(config);
};
gameObjects.getInventory = function(name, index)
{
    return(this.inventory[name + index] !== undefined) ? 
    this.inventory[name + index] : {};
};
gameObjects.putInventoryIntoObject = function(obj)
{
    var inventory = this.getInventory(obj.name, obj.index);
    for(var i in inventory)
    {
        obj[i] = inventory[i];
    }
};
gameObjects.putInventoryIntoObjects = function()
{
    for(var i = 0; i < this.length; i++)
    {
        for(var j = 0; j < this[i].length; j++)
        {
            if(this[i][j].usingOnSave)
            {
                this.putInventoryIntoObject(this[i][j]);
            }
        }
    }
};
gameObjects.removeObjects = function()
{
    for(var i = 0; i < this.length; i++)
    {
        for(var j = 0; j < this[i].length; j++)
        {
            this[i][j].save();
        }
    }
    for(var i = 0; i < this.length; i++)
    {
        this[i].length = 0;
    }
};
gameObjects.applyCollision = function(objA, physicsInfo)
{
    var collided = false;
    var touched = false;
    var collisionInfo = {};
    var touchInfo = {};
    var objs = [];
    var updateCollide = function(objA, objB)
    {
        collisionInfo = observer.colliding(objA, objB);
        collided = collisionInfo.colliding;
    };
    var updateTouch = function(objA, objB)
    {
        touchInfo = observer.touching(objA, objB);
        touched = touchInfo.touching;
    };
    
    I : for(var i = 0; i < this.length; i++)
    {
        for(var j = 0; j < min(this[i].length, 650); j++)
        {
            var objB = this[i][j];
            
            if(objA.name === objB.name && objA.id === objB.id)
            {
                continue;
            }
            
            var calculated = false;
            var touchCalculated = false;
            var boundingBoxesCollided = true;
            if(objA.physics.shape !== "rect" || objB.physics.shape !== "rect")
            {
                boundingBoxesCollided = observer.boundingBoxesColliding(objA.physics.boundingBox, objB.physics.boundingBox).colliding;
            }
            if(boundingBoxesCollided)
            {
                if(physicsInfo.scoping !== undefined && 
                physicsInfo.scoping)
                {
                    if(physicsInfo.rules !== undefined)
                    {
                        if(!physicsInfo.rules(objB))
                        {
                            continue;    
                        }
                    }
                    if(objs.length > physicsInfo.limit)
                    {
                        break I;  
                    }
                    updateCollide(objA, objB, calculated);
                    if(collided)
                    {
                        objs.push(this[i][j]);
                    }
                }else{
                    if(objA.physics.usesOnCollide)
                    {
                        if(!calculated)
                        {
                            updateCollide(objA, objB);
                            calculated = true;
                        }
                        if(collided)
                        {
                            if(objA.onCollide(objB))
                            {
                                continue;   
                            }
                        }
                    }
                    if(objB.physics.usesOnCollide)
                    {
                        if(!calculated)
                        {
                            updateCollide(objA, objB);
                            calculated = true;
                        }
                        if(collided)
                        {
                            if(objB.onCollide(objA))
                            {
                                continue;   
                            }
                        }
                    }
                    if(objA.physics.usesOnTouch)
                    {
                        if(!touchCalculated)
                        {
                            updateTouch(objA, objB);
                            touchCalculated = true;
                        }
                        if(touched)
                        {
                            if(objA.onTouch(objB))
                            {
                                continue;   
                            }
                        }
                    }
                    if(objB.physics.usesOnTouch)
                    {
                        if(!touchCalculated)
                        {
                            updateTouch(objB, objA);
                            touchCalculated = true;
                        }
                        if(touched)
                        {
                            if(objB.onTouch(objA))
                            {
                                continue;   
                            }
                        }
                    }
                    if(objB.physics.solidObject)
                    {
                        if(!calculated)
                        {
                            updateCollide(objA, objB, calculated);
                            calculated = true;
                        }
                        if(collided)
                        {
                            observer.applyCollision(objA, objB, physicsInfo, collisionInfo);
                        }
                    }
                }
            }
        }
    }
    return objs;
};
gameObjects.drawBoundingBoxes = function()
{
    noFill();
    stroke(0, 0, 0);
    strokeWeight(1);
    for(var i = 0; i < this.length; i++)
    {
        for(var j = 0; j < this[i].length; j++)
        {
            var boundingBox = this[i][j].physics.boundingBox;
            rect(boundingBox.xPos, boundingBox.yPos, 
            boundingBox.width, boundingBox.height);
        }
    }
};
gameObjects.apply = function()
{
    for(var i = 0; i < this.length; i++)
    {
        for(var j = 0; j < this[i].length; j++)
        {
            if(cam.inView(this[i][j].physics.boundingBox))
            {
                this[i][j].draw();
                this[i][j].update();
                this[i][j].updateVel();
                this[i][j].updateLife();
                if(this[i][j].delete)
                {
                    this[i].splice(j, 1);
                }
            }
        }
    }
};

var MovingObject = function(config)
{
    GameObject.call(this, config);
    
    this.type = "mover";
    
    this.xVel = 0;
    this.outerXVel = 0;
    this.maxXVel = 0;
    
    this.yVel = 0;
    this.inAir = true;
    this.inLiquid = false;
    this.outerYVel = 0;
    this.gravity = 0;
    this.maxYVel = 0;
    
    this.physics = {
        shape : "rect",
        movement : "mobile",
        solidObject : true,
        boundingBox : this,
    };
    
    this.updateVel = function()
    {
        this.xVel = constrain(this.xVel, -this.maxXVel, this.maxXVel);
        this.outerXVel = constrain(this.outerXVel, -this.maxXVel, this.maxXVel);
        
        this.xPos += this.xVel;
        this.xPos += this.outerXVel;
        
        gameObjects.applyCollision(this, {
            xVel : this.xVel + this.outerXVel, 
        });
        this.outerXVel = 0;
        
        if(!this.onLadder)
        {
            this.yVel += this.gravity;
        }
        
        this.inAir = true;
        this.inLiquid = false;
        this.onLadder = false;
        this.friction = 0;
        
        this.yVel = constrain(this.yVel, -this.maxYVel, this.maxYVel);
        this.outerYVel = constrain(this.outerYVel, -this.maxYVel, this.maxYVel);
        
        this.yPos += this.yVel;
        this.yPos += this.outerYVel;
        
        gameObjects.applyCollision(this, {
            yVel : this.yVel + this.outerYVel, 
        });
        this.outerYVel = 0;
        
        this.xPos = constrain(this.xPos, 0, levelInfo.width - this.width);
        this.yPos = max(this.yPos, 0);
        
        if(this.yPos <= 0)
        {
            this.inAir = true; 
            this.yVel = 0;
        }
    };
};
var Lifeform = function(config)
{
    MovingObject.call(this, config);
    
    this.type = "lifeform";
    
    this.maxHp = 100;
    this.hp = this.maxHp;
    this.damage = 1;
    
    this.gravity = 0.4;
    this.lastGravity = this.gravity;
    
    this.hitWall = function(obj)
    {
        var next = false;
        if(this.yPos + this.height > obj.yPos + this.yVel)
        {
            if(this.xPos > obj.xPos + obj.width/2)
            {
                this.xVel = this.xSpeed;
                this.xPos += this.xVel;
                next = true;
            }
            else if(this.xPos + this.width < obj.xPos + obj.width/2)
            {
                this.xVel = -this.xSpeed;
                this.xPos += this.xVel;
                next = true;
            }
        }
        return next;
    };
    
    this.ontop = function(obj)
    {
        return (obj.yPos + obj.height < this.yPos + abs(obj.yVel)) && 
        (obj.xPos + obj.width  > this.xPos + abs(obj.xVel + this.xVel)) && 
        (obj.xPos + abs(obj.xVel + this.xVel) < this.xPos + this.width);
    };
    
    this.handleEdges = function(amt, rule)
    {
        var probeWidth = constrain(abs(this.xVel), 0, this.width / 2);
        var probe = {
            physics : this.physics,
            xPos : (this.xPos + this.width / 2) - probeWidth / 2,
            yPos : this.yPos + this.height,
            width : probeWidth,
            height : 2,
        };
        
        //fill(0, 0, 0, 100);
        //rect(probe.xPos, probe.yPos, probe.width, probe.height);
        var blocksBelow = gameObjects.applyCollision(probe, {
            scoping : true,
            limit : amt || 1,
            rules : function(obj)
            {
                return (obj.physics.shape === "rect" && 
                obj.name !== this.name && 
                obj.type !== "lifeform");
            },
        });
        
        var rule1 = function() 
        {
            return (rule === undefined) ? false : rule(blocksBelow);
        };
        
        if(rule1(blocksBelow) || blocksBelow.length === 0)
        {
            this.xVel = -this.xVel;    
        }
    };
    
    this.updateLife = function()
    {
        if(this.yPos > levelInfo.height - abs(this.yVel))
        {
            this.dead = true;
        }   
        
        if(this.hp <= 0)
        {
            this.dead = true;    
        }
    
        if(this.hp > this.maxHp)
        {
            this.hp = this.maxHp;
        }
        
        if(this.dead)
        {
            this.remove();   
        }
    };
};
    
var BackBlock = function(config)
{
    GameObject.call(this, config);
    this.color = config.color || color(74, 60, 74);
    this.type = "block";
    this.blendsIn = true;
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : false,
        boundingBox : this,
    };
};  
gameObjects.addArray("backBlock", createArray(BackBlock));

var Block = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || (backgrounds.background === "underground" ) ? 
    color(28, 49, 117) : color(120, 120, 120);

    this.type = "block";
    
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : true,
        boundingBox : this,
    };
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height);
        fill(this.color, this.color, this.color, 30);
        triangle(this.xPos, this.yPos + this.height, this.xPos + this.width, this.yPos, this.xPos, this.yPos);
    };
};
gameObjects.addArray("block", createArray(Block));

var Tread = function(config)
{
    Block.call(this, config); 
    this.color = config.color || color(40, 20, 125, 200);
    this.physics.usesOnTouch = true;
    
    this.onVel = config.onVel || 0.2;
    this.dir = config.dir || 1;
    this.onVel = this.dir * abs(this.onVel);
    
    this.drawTri = function(xPos, yPos)
    {
        var comXPos = this.xPos + xPos;
        var comYPos = this.yPos + yPos;
        var leftXPos = comXPos + this.width / 3;
        var middleYPos = comYPos + this.height / 6;
        var downYPos = comYPos + this.height / 3;
        if(this.dir > 0)
        {
            triangle(comXPos, comYPos, comXPos, downYPos, leftXPos, middleYPos);
        }
        else if(this.dir < 0)
        {
            
            triangle(leftXPos, comYPos, leftXPos, downYPos, comXPos, middleYPos);
        }
    };
    
    this.draw = function()
    {
        noStroke();
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height);
        fill(this.color, this.color, this.color, 30);
        triangle(this.xPos, this.yPos + this.height, this.xPos + this.width, this.yPos, this.xPos, this.yPos);
        
        fill(0, 120, 20);
        for(var i = 0; i < 3; i++)
        {
            this.drawTri(this.width / 3 * i, this.height / 3);
        }
    };
    
    this.onTouch = function(object)
    {
        if(object.type === "lifeform")
        {
             object.xVel += object.maxXVel * this.onVel; 
        }
    };
};
gameObjects.addArray("tread", createArray(Tread));

var VoidSupport = function(config)
{
    Block.call(this, config);
    this.color = config.color || color(0, 0, 180, 200);
    
    this.physics.boundingBox = {
        xPos : this.xPos,
        yPos : 0,
        width : this.width,
        height : levelInfo.height,
    };
    
    this.draw = function()
    {
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height);
        fill(10, 150, 0, 200);
        ellipse(this.xPos + this.width / 2, this.yPos + this.height / 2, this.height * 0.7, this.width * 0.7);
        fill(0, 0, 200, 55);
        rect(this.xPos + this.width * 0.25, 0, this.width / 2, levelInfo.height + height);
    };
};
gameObjects.addArray("voidSupport", createArray(VoidSupport));

var InvisibleBlock = function(config)
{
    Block.call(this, config);
    this.draw = function() {};
};
gameObjects.addArray("invisibleBlock", createArray(InvisibleBlock));

var Ice = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(33, 198, 207);//color(0, 115, 255);
    
    this.type = "block";
    
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : true,
        boundingBox : this,
        usesOnTouch : true,
    };
    
    this.slipFactor = config.slipFactor || 0.10;
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height);
        fill(this.color, this.color, this.color, 30);
        triangle(this.xPos, this.yPos + this.height, this.xPos + this.width, this.yPos, this.xPos, this.yPos);
    };
    
    this.update = function()
    {
        if(this.height <= 1)
        {
            gameObjects.addObject("water", {
                xPos : this.xPos,
                yPos : this.yPos - config.height,
                width : config.width,
                height : config.height,
            });
            this.remove();   
        }  
    };
    
    this.onTouch = function(obj)
    {
        if(obj.type === "lifeform")
        {
            obj.friction = obj.friction - this.slipFactor;
        }
    };
};
gameObjects.addArray("ice", createArray(Ice));

var Brick = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(120, 120, 120);//color(0, 115, 255);
    
    this.type = "block";
    
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : true,
        boundingBox : this,
        usesOnTouch : true, 
    };
    
    this.maxHeight = this.height;
    
    this.smashAmt = config.smashAmt || 1;
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height);
        fill(this.color, this.color, this.color, 30);
        triangle(this.xPos, this.yPos + this.height,
        this.xPos + this.width, this.yPos, 
        this.xPos, this.yPos);
        triangle(this.xPos, this.yPos, 
        this.xPos, this.yPos + this.height, 
        this.xPos + this.width, this.yPos + this.height);
    };
    
    this.break = function()
    {
        this.height -= this.maxHeight / this.smashAmt;
        if(this.height <= 0)
        {
            this.remove();  
        }
    };
    
    this.onTouch = function(obj)
    {
        if(obj.physics.movement !== "fixed" && 
        obj.yPos > this.yPos + this.height * 0.95)
        {
            this.break();
        }
    };
};
gameObjects.addArray("brick", createArray(Brick));

var BlankBlock = function(config)
{
    Block.call(this, config);
    this.type = "block";
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : false,
        boundingBox : this, 
    };
};
gameObjects.addArray("blankBlock", createArray(BlankBlock));

var Ground = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || (backgrounds.background === "lava") ? 
    color(219, 89, 37) : color(120, 96, 81);
    
    this.grassColor = (backgrounds.background === "lava") ? 
    color(28, 165, 30, 75) : color(28, 156, 30);
    
    this.type = "block";
    
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : true,
        boundingBox : this,
    };
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height);
        
        fill(this.grassColor);
        rect(this.xPos, this.yPos, this.width, this.height * 0.2);
        
        fill(this.color, this.color, this.color, 30);
        triangle(this.xPos, this.yPos + this.height, this.xPos + this.width, this.yPos, this.xPos, this.yPos);
    };
};
gameObjects.addArray("ground", createArray(Ground));

var Dirt = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || (backgrounds.background === "lava") ? 
    color(219, 89, 37) : color(120, 96, 81);
    
    this.type = "block";
    
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : true,
        boundingBox : this,
    };
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height);
        
        fill(this.color, this.color, this.color, 30);
        triangle(this.xPos, this.yPos + this.height, this.xPos + this.width, this.yPos, this.xPos, this.yPos);
    };
};
gameObjects.addArray("dirt", createArray(Dirt));

var Ladder = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(120, 120, 120);//color(0, 115, 255);
    
    this.type = "other";
    
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : false,
        boundingBox : this,
        usesOnCollide : true,
    };
    
    this.draw = function() 
    {
        var lines = 4;
        stroke(0, 0, 0);
        strokeWeight(1);
        var spacing = this.height/lines;
        for(var i = 0; i < lines; i++)
        {
           line(this.xPos, this.yPos + i * spacing, 
           this.xPos + this.width, this.yPos + i * spacing);
        }
        var spacing2 = spacing * 2;
        for(var i = 0; i < lines/2; i++)
        {
            line(this.xPos, this.yPos + i * 2 * spacing, 
                 this.xPos, this.yPos + (i * 2 + 1) * spacing);
                 
            line(this.xPos + this.width, this.yPos + (i * 2 - 1) * spacing + spacing*2, 
                 this.xPos + this.width, this.yPos + (i * 2) * spacing + spacing*2);
        }
    };
    
    this.onCollide = function(obj)
    {
        if(obj.physics.movement === "mobile")
        {
            obj.inAir = false;
            obj.onLadder = true;
        }
    };
};
gameObjects.addArray("ladder", createArray(Ladder));

var Slope = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(120, 120, 120);
    this.direction = config.direction || "rightup";
    
    this.type = "collision";
    
    this.hyp = dist(this.xPos, this.yPos, 
    this.xPos + this.width, 
    this.yPos + this.height);
    
    var thicknessX = 0.05;
    var bindingX = 3;
    var thicknessY = 0.05;
    var bindingY = 3;
    this.setup = function()
    {
        switch(this.direction)
        {
            case "leftup" : 
                    gameObjects.addObject("block", {
                        xPos : this.xPos,
                        yPos : this.yPos + this.height * thicknessX * bindingX,
                        width : this.width * thicknessX,
                        height : this.height - this.height * thicknessX * bindingX,
                    });
                    gameObjects.addObject("block", {
                        xPos : this.xPos,
                        yPos : this.yPos + this.height - this.height * thicknessY,
                        width : this.width - this.width * thicknessY * bindingY,
                        height : this.height * thicknessY,
                    });
                break;
            
            case "rightup" : 
                    gameObjects.addObject("block", {
                        xPos : this.xPos + this.width - this.width * thicknessX,
                        yPos : this.yPos + this.height * thicknessX * bindingX,
                        width : this.width * thicknessX,
                        height : this.height - this.height * thicknessX * bindingX,
                    });
                    gameObjects.addObject("block", {
                        xPos : this.xPos + this.width * thicknessY * bindingY,
                        yPos : this.yPos + this.height - this.height * thicknessY,
                        width : this.width - this.width * thicknessY * bindingY,
                        height : this.height * thicknessY,
                    });
                break;
                      
            case "leftdown" : 
                    gameObjects.addObject("block", {
                        xPos : this.xPos,
                        yPos : this.yPos,
                        width : this.width * thicknessX,
                        height : this.height - this.height * thicknessX * bindingX,
                    });
                    gameObjects.addObject("block", {
                        xPos : this.xPos,
                        yPos : this.yPos,
                        width : this.width - this.width * thicknessY * bindingY,
                        height : this.height * thicknessY,
                    });
                break;
            
            case "rightdown" : 
                    gameObjects.addObject("block", {
                        xPos : this.xPos + this.width - this.width * thicknessX,
                        yPos : this.yPos,
                        width : this.width * thicknessX,
                        height : this.height - this.height * thicknessX * bindingX,
                    });
                    gameObjects.addObject("block", {
                        xPos : this.xPos + this.width * thicknessY * bindingY,
                        yPos : this.yPos,
                        width : this.width - this.width * thicknessY * bindingY,
                        height : this.height * thicknessY,
                    });
                break;
        }
    };
    this.setup();
    
    this.physics = {
        shape : "slope",
        movement : "fixed",
        solidObject : true,
        boundingBox : this,
    };
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        switch(this.direction)
        {
            case "leftup" : 
                    triangle(this.xPos, this.yPos + this.height, 
                    this.xPos, this.yPos, 
                    this.xPos + this.width, this.yPos + this.height);
                break;
            
            case "rightup" : 
                    triangle(this.xPos, this.yPos + this.height, 
                    this.xPos + this.width, this.yPos, 
                    this.xPos + this.width, this.yPos + this.height);
                break;
                      
            case "leftdown" : 
                    triangle(this.xPos, this.yPos + this.height, 
                    this.xPos, this.yPos, 
                    this.xPos + this.width, this.yPos);
                break;
                     
            case "rightdown" : 
                    triangle(this.xPos, this.yPos, 
                    this.xPos + this.width, this.yPos, 
                    this.xPos + this.width, this.yPos + this.height);
                break;
        }
    };
    
};
gameObjects.addArray("slope", createArray(Slope));

var Circle = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(120, 120, 120);//color(0, 115, 255);
    this.diameter = config.diameter || 10;
    this.radius = this.diameter/2;
    
    /*Important Note : 
        Do not use these near blocks. (Fixed in new Game Engine) 
    */
    
    this.type = "collision";
    
    this.physics = {
        shape : "circle",
        movement : "fixed",
        solidObject : true,
        boundingBox : {
            xPos : this.xPos - this.radius,
            yPos : this.yPos - this.radius,
            width : this.diameter,
            height : this.diameter,
        },
    };
    
    this.draw = function() 
    {
        fill(this.color);
        ellipse(this.xPos, this.yPos, this.diameter, this.diameter);
    };
    
    this.onCollide = function(obj)
    {
        if(obj.name === "player")
        {
            this.color = color(7, 67, 171);
        }else{
            this.color = color(120, 120, 120);
        }
    };
};
gameObjects.addArray("circle", createArray(Circle));

var Spring = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(71, 138, 37);
    
    var adjustY = levelInfo.unitHeight / 40;
    
    this.jumpAmt = config.jumpAmt || 15 * adjustY;
    
    this.type = "other";
    
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : false,
        usesOnCollide : true,
        boundingBox : this,
    };
    
    var amt = this.height / 2;
    var vel = 1.5;
    
    this.onCollide = function(obj)
    {
        if(obj.physics.movement === "mobile" && amt < this.height * 0.10)
        {
            obj.yVel -= this.jumpAmt;
        }
    };
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height);
        
        fill(0, 0, 0, 50);
        triangle(this.xPos, this.yPos + this.height, this.xPos + this.width / 2, this.yPos, this.xPos + this.width, this.yPos + this.height);
        
        strokeWeight(this.height / 10);
        stroke(0, 0, 0, 100);
        for(var i = this.height / (abs(amt) + 1 * 10); i > 0; i--)
        {
            line(this.xPos + (this.width / 2 - i * (amt / 2)),
            amt + this.yPos + (i * 8), 
            this.xPos + (this.width / 2 + i * (amt / 2)), 
            amt + this.yPos +  (i * 8)); 
        }
        if(amt < 0 || amt > this.height - this.height / 5)
        {
            vel = -vel;    
        }
        amt += vel;
    };
};
gameObjects.addArray("spring", createArray(Spring));

var Oneway = function(config)
{
    GameObject.call(this, config);
    this.color = config.color || color(92, 92, 92);
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : true,
        usesOnCollide : true,
        sides : config.sides || {
            left : true,
        },
        boundingBox : this,
    };
    
    this.type = "block";
    
    this.drawDir = function()
    {
        var symbol = "<";
        var textXPos = this.width * 0.2;
        
        pushMatrix();
        translate(this.xPos, this.yPos);
        switch(true)
        {
            case this.physics.sides.left : 
                break;
                
            case this.physics.sides.right : 
                    translate(this.width, this.height);
                    rotate(180);
                break;
                
            case this.physics.sides.top : 
                    translate(this.width, 0);
                    rotate(90);
                break;
                
            case this.physics.sides.bottom :
                    translate(0, this.height);
                    rotate(270);
                break;
        }
        fill(0, 0, 0, 100);
        textAlign(CENTER, CENTER);
        textSize(20 * this.width / 40);
        fill(0, 0, 0, 100);
        rect(this.width * 0.0, 0, this.width * 0.1, this.height);
        rect(this.width * 0.3, 0, this.width * 0.1, this.height);
        for(var i = 0; i < floor(this.height / 10); i++)
        {
            text(symbol, 0 + textXPos, 
            0 + this.height * 0.10 + 10 * i);
        }
        textAlign(NORMAL, NORMAL);
        popMatrix();
    };
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height);
        this.drawDir();
    };
};
gameObjects.addArray("oneway", createArray(Oneway));

var Platform = function(config)
{
    Oneway.call(this, config);
    Block.call(this, config);
    this.color = color(14, 14, 150);
    this.physics.sides = config.sides || {
        top : true, 
    };
    this.type = "block";
};
gameObjects.addArray("platform", createArray(Platform));

var FallBlock = function(config)
{
    Block.call(this, config); 
    MovingObject.call(this, config);
    this.color = config.color || color(128, 128, 128, 100);
    
    this.type = "mover";
    
    this.yVel = 0;
    this.fallSpeed = 2;
    this.initYPos = this.yPos;
    this.activated = false;
    this.time = config.time || 25;
    this.timer = this.time;
    
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : true,
        usesOnCollide : true,
        sides : {
            top : true,  
        },
        boundingBox : {
            xPos : this.xPos,
            yPos : 0,
            width : this.width,
            height : levelInfo.height,
        },
    };
    
    this.update = function()
    {
        this.yPos += this.yVel;
        if(this.yPos + this.height / 2 >= (levelInfo.height || height))
        {
            this.yPos = this.initYPos;
            this.timer = this.time;
            this.activated = false;
        }
        if(this.timer <= 0)
        {
            this.activated = true;  
        }
        if(this.activated)
        {
            this.yPos += this.fallSpeed;    
        }
    };
    
    this.onCollide = function(obj)
    {
        if(obj.physics.movement === "mobile")
        {
            this.timer--;
        }
    };
};
gameObjects.addArray("fallBlock", createArray(FallBlock));

var MovingPlatform = function(config)
{
    Block.call(this, config);
    this.color = config.color || color(153, 143, 32);
    
    this.physics = {
        shape : "rect",
        movement : "mobile",
        solidObject : true,
        usesOnCollide : true,
        usesCollision : true,
        sides : {
            top : true,
        },
        boundingBox : {
            xPos : this.xPos,
            yPos : this.yPos,
            width : this.width,
            height : this.height,
        },
    };
    
    this.type = "mover";
    
    this.xSpeed = config.xSpeed || 0;
    this.xVel = this.xSpeed;
    this.nextXVel = this.xSpeed;
    
    this.ySpeed = config.ySpeed || 0;
    this.yVel = this.ySpeed;
    this.nextYVel = this.ySpeed;
    
    if(this.xPos === 0)
    {
        this.xPos = null;
    }
    if(this.yPos === 0)
    {
        this.xPos = null;
    }
    
    this.setup = function()
    {
        if(this.xSpeed !== 0)
        {
            this.physics.boundingBox.xPos = 0;
            this.physics.boundingBox.width = levelInfo.width;
        }
        if(this.ySpeed !== 0)
        {
            this.physics.boundingBox.yPos = 0;
            this.physics.boundingBox.height = levelInfo.height;
        }
    };
    
    this.setup();
    
    this.onCollide = function(obj)
    {
        if(obj.type === "block")
        {
            this.nextXVel = -this.xVel;
            this.nextYVel = -this.yVel;
            if(obj.physics.movement === "mobile")
            {
                obj.outerXVel = -this.xVel;
                obj.outerYVel = -this.yVel;
            }
        }
        else if(obj.physics.movement === "mobile")
        {
            obj.outerXVel = this.xVel;
            if(this.yVel < 0)
            {
                obj.yVel = -abs(this.yVel * 1.5);
            }
            obj.inAir = false;
        }
    };
    
    this.update = function()
    {
        if(this.xPos !== null)
        {
            this.xPos += this.xVel;
            if(this.xPos < 0 || this.xPos + this.width >= levelInfo.width)
            {
                this.nextXVel = -this.xVel;
            }
            gameObjects.applyCollision(this, {
                xVel : this.xVel, 
            });
            this.xVel = this.nextXVel;
        }
        if(this.yPos !== null)
        {
            this.yPos += this.yVel;
            if(this.yPos + this.height >= levelInfo.height)
            {
                this.nextYVel = -abs(this.yVel);
            }
            if(this.yPos <= abs(this.yVel))
            {
                this.nextYVel = abs(this.yVel);
            }
            gameObjects.applyCollision(this, {
                yVel : this.yVel, 
            });
            this.yVel = this.nextYVel;
        }
    };
};
gameObjects.addArray("movingPlatform", createArray(MovingPlatform));

var lavaImages = [];
var Lava = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(120, 20, 30);
    
    this.type = "other";
    this.damage = 1;
    
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : false,  
        usesOnCollide : true,
        boundingBox : this,
    };
    
    this.imageIndex = 0;
    this.imagesAmount = config.imagesAmount || 1;
    this.images = [];
    this.time = 50;
    this.timer = 0;
    this.useStoredImages = config.useStoredImages;

    this.loadDetail = function(cols, rows, width, height, unitWidth, unitHeight)
    {
        this.grids = [];
        this.cols = cols || floor(width / unitWidth);
        this.rows = rows || floor(height / unitHeight);
        this.grids.unitWidth = unitWidth || floor(width / this.cols);
        this.grids.unitHeight = unitHeight || floor(height / this.rows);
        for(var i = 0; i < this.imagesAmount; i++)
        {
             var grid = [];
             grid.unitWidth = unitWidth || floor(width / this.cols);
             grid.unitHeight = unitHeight || floor(height / this.rows);
             for(var col = 0; col < this.cols; col++)
             {
                 var arr = [];
                 for(var row = 0; row < this.rows; row++)
                 {
                     arr.push(color(255 - random(-15, 100) * 3, random(0, 50), random(0, 50), random(75, 125)));
                 }
                 grid.push(arr);
            }
            this.grids.push(grid);
        }
    };
    this.loadDetail(config.cols || 3, config.rows || 3, this.width, this.height);
    this.loadDraw = function()
    {
  this.images = [];
    for(var i = 0; i < this.grids.length; i++)
  {
      var getWidth = this.grids[i].unitWidth * this.grids[i].length;
      var getHeight = this.grids[i].unitHeight * this.grids[i][0].length;
      stroke(this.color);
            fill(this.color);
      rect(0, 0, getWidth, getHeight);
      noStroke();
      for(var col = 0; col < this.grids[i].length; col++)
            {
              for(var row = 0; row < this.grids[i][col].length; row++)
                {
                    fill(this.grids[i][col][row]);
                    rect(col * this.grids[i].unitWidth, row * this.grids[i].unitHeight, this.grids[i].unitWidth, this.grids[i].unitHeight);
                }
            }
      var lavaImage = get(0, 0, getWidth, getHeight);
      this.images.push(lavaImage);
  }
  
    };
   
    this.loadDraw();
   
    this.draw = function() 
    {
        image((this.useStoredImages) ? lavaImages[this.imageIndex] : this.images[this.imageIndex], this.xPos, this.yPos, this.width, this.height);
    };
    
    if(!this.useStoredImages) 
    {
        lavaImages.push(this.images[this.imageIndex]);
    }

    this.update = function()
    {
  this.timer++;
        if(this.timer >= this.time)
        {
            this.timer = 0;
            this.imageIndex++;
        }
        if(this.imageIndex >= this.images.length)
        {
            this.imageIndex = 0;   
        }
    };

    this.onCollide = function(obj)
    {
        if(obj.type === "lifeform")
        {
            if(!obj.lavaImmune || obj.inLiquid)
            {
                obj.hp -= this.damage;
            } 
        }
    };
};
gameObjects.addArray("lava", createArray(Lava));

var SpikeBlock = function(config)
{
    GameObject.call(this, config);
    
    this.color = config.color || color(80, 80, 80);
    
    this.type = "block";
    
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : true,
        boundingBox : this,
        usesOnCollide : true,
        usesOnTouch : true,
    };
    
    this.drawBrick = new Brick(this).draw;
    
    this.draw = function() 
    {
        this.drawBrick();  
        
        strokeWeight(1);
        stroke(0, 0, 0);
        var lines = 10;
        for(var i = 0; i < this.width; i += 4)
        {
            line(this.xPos + i, this.yPos - this.height * 0.1, this.xPos + i, this.yPos);
        }
        for(var i = 0; i < this.width; i += 4)
        {
            line(this.xPos + i, this.yPos + this.height, 
            this.xPos + i, this.yPos + this.height * 1.1);
        }
        
        for(var i = 0; i < this.height; i += 4)
        {
            line(this.xPos, this.yPos + i, this.xPos - this.width * 0.1, this.yPos + i);
        }
        
        for(var i = 0; i < this.height; i += 4)
        {
            line(this.xPos + this.width, this.yPos + i, 
            this.xPos + this.width * 1.1, this.yPos + i);
        }
        
        stroke(0, 0, 0);
        line(this.xPos, this.yPos, this.xPos + this.width, this.yPos + this.height);
        line(this.xPos + this.width, this.yPos, this.xPos, this.yPos + this.height);
    };
    
    this.onCollide = function(obj)
    {
        if(obj.name === "player")
        {
            obj.hp -= 2;   
        }
    };
    this.onTouch = function(obj)
    {
        if(obj.name === "player")
        {
            obj.hp -= 0.25;   
        }
    };
};
gameObjects.addArray("spikeBlock", createArray(SpikeBlock));

var MovingLava = function(config)
{
    Lava.call(this, config);
    
    this.damage = 1;
    
    this.physics = {
        shape : "rect",
        movement : "mobile",
        solidObject : false,  
        usesOnCollide : true,
        boundingBox : this,
    };
    
    MovingPlatform.call(this, config);
    this.color = config.color || color(102, 25, 6);
    
    this.type = "mover";
    
    this.setup();
    
    this.imagesAmount = 1;
    
    this.draw = new Lava(this).draw;
    
    this.lastOnCollide = new MovingPlatform(this).onCollide;
    
    this.onCollide = function(obj)
    { 
        if(obj.name === "beaker")
        {
            if(this.inLiquid)
            {
                return;
            }else{
                obj.hp -= this.damage;
            }
        }

        this.lastOnCollide(obj);
        if(obj.type === "lifeform")
        {
            if(obj.name !== "beaker2" && obj.name !== "beaker")
            {
                if(this.inLiquid)
                {
                    obj.hp -= this.damage * 0.25;  
                }else{
                    obj.hp -= this.damage;
                }
            } 
        }
        
        if(obj.name === this.name && obj.name !== "water")
        {
            if(this.xSpeed !== 0)
            {
                this.xVel = -this.xVel;
            }
            if(this.ySpeed !== 0)
            {
                this.yVel = -this.yVel;
            }
        }
    };
};
gameObjects.addArray("movingLava", createArray(MovingLava));

var Water = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(40, 103, 181, 150);
    
    this.type = "liquid";
    
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : false,
        usesOnCollide : true,
        boundingBox : this,
    };
    
    this.thickness = 1.075;
    
    this.onCollide = function(obj)
    {
        if(obj.physics.movement === "mobile")
        {
            obj.inAir = false;
            obj.inLiquid = true;
            obj.yVel = obj.yVel / this.thickness;
            obj.xVel = obj.xVel / this.thickness;
        }
    };
};
gameObjects.addArray("water", createArray(Water));

var QuickSand = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(215, 125, 50);
    
    this.type = "liquid";
    
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : false,
        usesOnCollide : true,
        boundingBox : this,
    };
    
    this.thickness = 2.075;
    
    this.onCollide = function(obj)
    {
        if(obj.physics.movement === "mobile")
        {
            obj.inAir = false;
            obj.inLiquid = true;
            obj.yVel = obj.yVel / this.thickness;
            obj.xVel = obj.xVel / this.thickness;
        }
    };
};
gameObjects.addArray("quickSand", createArray(QuickSand));

var Door = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(76, 130, 76);
    
    this.locked = config.locked;
    
    this.type = "other";
    
    this.level = config.level;
    this.door = config.door;
    this.symbol = config.symbol;
    
    this.targetDoor = config.targetDoor;

    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : false,  
        usesOnCollide : true,
        boundingBox : this,
    };
    
    this.onCollide = function(obj)
    {
        if(obj.name === "player" && !this.locked && obj.controls.openDoor())
        {
            infoBar.coins += obj.coins;
            infoBar.score += obj.score;
            loader.startLevelLoading({
                level : this.level, 
                door : this.door
            });
        }
    };
    
    this.draw = function() 
    {
        noStroke();
        fill((!this.locked) ? this.color : color(0, 0, 0, 100));
        rect(this.xPos, this.yPos, this.width, this.height);
        
        fill(this.color, this.color, this.color, 20);
        rect(this.xPos, this.yPos + this.height/2, this.width, this.height/2);
        
        fill(this.color, this.color, this.color, 40);
        var knobRaduis = this.width * 0.30;
        ellipse(this.xPos + this.width * 0.8, this.yPos + this.height * 0.5, knobRaduis, knobRaduis);
        
        fill(0, 0, 0, 50);
        textAlign(CENTER, CENTER);
        textSize(11);
        text(this.level, this.xPos + this.width/2, this.yPos + this.height/5);

    };
    //screenUtils.drawToImage(this);
};
gameObjects.addArray("door", createArray(Door));
gameObjects.getArray("door").targetDoor = {};
gameObjects.getArray("door").setTargetDoor = function()
{
    this.targetDoor = {
  level : levelInfo.level,
  door : levelInfo.door,
    };
    for(var i = 0; i < this.length; i++)
    {
  if(this[i].targetDoor && !this[i].locked)
  {
      this.targetDoor = {
    level : this[i].level,
    door : this[i].door
      };
      break;
  }
    }
};

var Sign = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(51, 72, 156);//color(0, 115, 255);
    
    this.type = "block";
    
    this.message = config.message || "sign";
    
    this.textColor = config.textColor || color(0, 0, 0);
    
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : false,
        boundingBox : this,
        usesOnCollide : true,
    };
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        rect(this.xPos + this.width * 0.3, this.yPos, this.width * 0.4, this.height);
        fill(0, 0, 0, 100);
        rect(this.xPos, this.yPos, this.width, this.height * 0.5);
    };
    
    this.onCollide = function(obj)
    {
        if(obj.name === "player")
        {
            textAlign(CENTER, CENTER);
            textSize(12);
            fill(this.textColor);
            text(this.message, this.xPos + this.width/2, this.yPos - this.height/2);
        }
    };
};
gameObjects.addArray("sign", createArray(Sign));

var QuestionMarkBlock = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(149, 153, 32);//color(120, 120, 120);//color(0, 115, 255);
    
    this.type = "block";
    
    this.contains = config.contains || [["coin", function(obj)
    {
        var diameter = obj.height/2;
        var config1 = {
            diameter : diameter,
            xPos : obj.xPos + diameter/2,
            yPos : (obj.yPos - obj.height) + diameter/2,
        };
        return config1;
    }]];
    
    this.physics = {
        shape : "rect",
        movement : "fixed",
        solidObject : true,
        boundingBox : this,
        usesOnTouch : true, 
    };
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height);
        fill(this.color, this.color, this.color, 30);
        triangle(this.xPos, this.yPos + this.height, this.xPos + this.width, this.yPos, this.xPos, this.yPos);
        
        if(this.contains.length > 0)
        {
            textFont(createFont("subway-ticker"));
            textAlign(CENTER, CENTER);
            textSize(this.width * this.height / 50);
            fill(0, 0, 0);
            text("?", this.xPos + this.width/2, this.yPos + this.height/2);
        }
    };
    this.createConfig = function()
    {
        if(this.contains[0].length >= 2 &&
        typeof this.contains[0][1] === "function")
        {
            return this.contains[0][1](this);
        }else{
            return {
                xPos : this.xPos,
                yPos : this.yPos - this.height,
                width : this.width,
                height : this.height,
            };
        }
    };
    
    this.dispense = function()
    {
        if(this.contains.length > 0)
        {
            try{
                var inConfig = this.createConfig();
    inConfig.outOfQuestionMarkBlock = true;
                gameObjects.addObject(this.contains[0][0], inConfig);
                if(this.contains[0].length >= 3)
                {
                    this.contains[0][2]--;
                }
                if(this.contains[0].length <= 2 || 
                (this.contains[0].length >= 3 &&
                this.contains[0][2] <= 0))
                {
                    this.contains.shift();
                }
            }
            catch(e)
            {
                println(e);
            }
        }
    };
    
    this.onTouch = function(obj)
    {
        if(obj.physics.movement !== "fixed" && 
        obj.yPos > this.yPos + this.height * 0.95)
        {
            this.dispense();
        }
    };
};
gameObjects.addArray("questionMarkBlock", createArray(QuestionMarkBlock));

var LavaPillar = function(config)
{
    Lava.call(this, config);
    this.color = config.color || color(140, 30, 40);
    this.normalHeight = this.height;
    this.normalYPos = this.yPos;
    this.minYPos = this.yPos - this.height * 1;
   
    this.speed = random(0.5, 0.1);
    this.vel = this.speed;
    this.dir = 1;
    this.maxVel = 3;

    this.loadDetail(undefined, undefined, this.width, this.height * 3, this.width / 2, this.height / 2);
    this.loadDraw();

    this.update = function()
    {
        if(this.yPos < this.minYPos)
        {
            this.dir = 1;
        }
        if(this.yPos > this.normalYPos)
        {
            this.dir = -1;
            this.speed = random(0.5, 0.1);
        }
        if(this.dir === 1)
        {
            this.vel += this.speed;
        }
        if(this.dir === -1)
        {
            this.vel -= this.speed;
        }
        this.vel = constrain(this.vel, -this.maxVel, this.maxVel);
        this.yPos += this.vel;
        this.YPos = constrain(this.yPos, this.normalYPos, this.minYPos);
        this.height = this.normalYPos - this.yPos + this.normalHeight;
    };
};
gameObjects.addArray("lavaPillar", createArray(LavaPillar));

var Coin = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(184, 194, 75, 150);
    
    this.amt = config.amt || 1;
    this.diameter = config.diameter || 40; 
    this.radius = this.diameter/2; 
    this.xPos += this.radius;
    this.yPos += this.radius;
   
    this.type = "item";
    
    this.physics = {
        shape : "circle",
        movement : "fixed",
        solidObject : false,
        usesOnCollide : true,
        boundingBox : {
            xPos : this.xPos - this.radius,
            yPos : this.yPos - this.radius,
            width : this.diameter,
            height : this.diameter,
        },
    };
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        ellipse(this.xPos, this.yPos, this.diameter, this.diameter);
        noFill();
    };
    
    this.update = function()
    {
        if(config.outOfQuestionMarkBlock)
        {
            this.onCollide(gameObjects.getArray("player")[0]);
        } 
    };

    this.onCollide = function(obj)
    {
        if((obj.type === "lifeform") || obj.name === "beaker")
        {
            obj.coins += this.amt;
            obj.score += this.amt * 100;
            this.remove();
        }
    };
};
gameObjects.addArray("coin", createArray(Coin));

var Hp = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(75, 194, 164, 200);
    
    this.amt = config.amt || round(random(5, 10));
    this.diameter = config.diameter || 40; 
    this.radius = this.diameter/2; 
    this.xPos += this.radius;
    this.yPos += this.radius;
   
    this.type = "item";
    
    this.physics = {
        shape : "circle",
        movement : "fixed",
        solidObject : false,
        usesOnCollide : true,
        boundingBox : {
            xPos : this.xPos - this.radius,
            yPos : this.yPos - this.radius,
            width : this.diameter,
            height : this.diameter,
        },
    };
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        ellipse(this.xPos, this.yPos, this.diameter, this.diameter);
        noFill();
    };
    
    this.onCollide = function(obj)
    {
        if(obj.name === "player")
        {
            obj.hp += this.amt;
            obj.score += this.amt * 50;
            this.remove();
        }
    };
};
gameObjects.addArray("hp", createArray(Hp));

var Power = function(config)
{
    GameObject.call(this, config); 
    this.color = config.color || color(204, 232, 21, 100);
    
    this.amt = config.amt;
    this.diameter = config.diameter || 80; 
    this.radius = this.diameter/2; 
    this.xPos += this.radius;
    this.yPos += this.radius;
   
    this.type = "item";
    
    this.physics = {
        shape : "circle",
        movement : "fixed",
        solidObject : false,
        usesOnCollide : true,
        boundingBox : {
            xPos : this.xPos - this.radius,
            yPos : this.yPos - this.radius,
            width : this.diameter,
            height : this.diameter,
        },
    };
    
    this.maxDiameter = this.diameter;
    this.minDiameter = -this.diameter;
    this.diameterVel = 1;
    
    this.c = this.color;
    
    this.draw = function() 
    {
        noStroke();
        this.color = (this.diameter > 0) ? this.c : color(30, 30, 150, 100);
        fill(this.color);
        ellipse(this.xPos, this.yPos, abs(this.diameter), abs(this.diameter));
        noFill();
        stroke(0, 0, 0);
        strokeWeight(2);
        ellipse(this.xPos, this.yPos, 
        this.maxDiameter - this.diameter * random(0.2, 0.3), 
        this.maxDiameter - this.diameter * random(0.2, 0.3));
    };
    
    this.update = function()
    {
        if(this.diameter < this.minDiameter || 
        this.diameter > this.maxDiameter)
        {
            this.diameterVel = -this.diameterVel;
        }
        this.diameter += this.diameterVel;
    };
    
    this.onCollide = function(obj)
    {
        if(obj.name === "player")
        {
            obj.maxHp += this.amt; 
            obj.hp = obj.maxHp;
            obj.score += this.amt * 50;
            this.remove();
            config.collect();
            obj.collectedItems[this.name] = {
                collected : true,
                info : "Increases health",
            };
        }
    };
};
gameObjects.addArray("power", createArray(Power));

var IceBreaker = function(config)
{
    GameObject.call(this, config);
    
    this.type = "item";
    
    this.diameter = config.diameter;
    this.radius = this.diameter/2;
    this.amt = config.amt || 20;
    
    this.physics = {
        shape : "circle",
        movement : "fixed",
        solidObject : false,
        usesOnCollide : true,
        boundingBox : {
            xPos : this.xPos - this.radius,
            yPos : this.yPos - this.radius,
            width : this.diameter,
            height : this.diameter,
        },  
    };
    
    this.rectAngle = 0;
    this.vel = 3;
    this.draw = function() 
    {
        this.rectAngle += this.vel;
        this.size = this.radius * 1.1 * (this.rectAngle * 0.05) * 0.1;
        fill(191, 15, 15);
        ellipse(this.xPos, this.yPos, (this.size/2) * 2.3, (this.size/2) * 2.3);
        pushMatrix();
        translate(this.xPos, this.yPos);
        rotate(this.rectAngle);
        rect(-this.size/2, -this.size/2, this.size, this.size);
        popMatrix();
        fill(221, 45, 45);
        ellipse(this.xPos, this.yPos, (this.size/2) * 1.6, (this.size/2) * 1.6);
        if(this.rectAngle > 360 || this.rectAngle < 0)
        {
            this.vel = -this.vel;  
        }
    };
    
    this.onCollide = function(obj)
    {
        if(obj.name === "player")
        {
            obj.hp += this.amt;
            obj.score += this.amt * 50;
            obj.currentAbility = this.name;
            var name = this.name;
            obj.onCollides.ice = {
                onCollide : function(player, obj)
                {
                    //println( player.controls.useAbility());
                    if(player.currentAbility === name && player.controls.useAbility())
                    {
                        var breakSpeed = player.breakSpeed || 5;
                        obj.yPos += breakSpeed;
                        obj.height -= breakSpeed;
                        obj.height = max(0, obj.height);
                        if(obj.height === 0)
                        {
                            obj.physics.solidObject = false;   
                        } 
                    }
                },
            };
            obj.collectedItems[this.name] = {
                collected : true,
                info : "Breaks ice",
            };
            config.collect();
            this.remove();
        }
    };
};
gameObjects.addArray("iceBreaker", createArray(IceBreaker));

var Beaker = function(config)
{
    Lifeform.call(this, config);
    this.color = config.color || color(56, 137, 161);
    
    this.xVel = 0;
    this.yVel = 0;
    
    this.outerXVel = 0;
    this.outerYVel = 0;
    
    this.inAir = true;
    
    var adjustX = levelInfo.unitWidth / 40;
    var adjustY = levelInfo.unitHeight / 40;
    
    this.maxXVel = 5 * adjustX;
    this.xSpeed = (config.xSpeed || 1) * adjustX;
    
    this.ySpeed = (config.ySpeed || 0) * adjustY;
    this.gravity = 0.4 * adjustY;
    this.maxYVel = 12 * adjustY;
    this.dead = false;
    
    this.swimSpeed = 2 * adjustX;

    this.type = "lifeform";
    
    this.maxHeight = this.height;
    this.maxHp = config.maxHp || 10;
    this.hp = this.maxHp;
    
    this.damage = config.damage || 0.25;
    
    this.physics = {
        shape : "rect",
        movement : "mobile",
        solidObject : true,
        usesOnCollide : true,
        boundingBox : this,
    };

    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height, 10);
        
        fill(this.color, this.color, this.color, 30);
        
        rect(this.xPos, this.yPos,  this.width, this.height / 4, 10);
        rect(this.xPos, this.yPos + this.height - this.height / 4, this.width, 
        this.height / 4, 10);
        rect(this.xPos, this.yPos, this.width / 4, this.height, 10);
        rect(this.xPos + this.width - this.width / 4, this.yPos, this.width / 4, 
        this.height, 10);
        
        fill(0, 0, 0, 50);
        ellipse(this.xPos + this.width * 0.5, this.yPos + this.height * 0.5,
        this.width * 0.4, this.height * 0.4);
    };
    
    this.xVel = this.xSpeed;
    
    this.upPush = 7 * adjustY;
    
    this.maxHeight = this.height;
    this.lastGravity = this.gravity;
    
    this.timer = 0;

    this.update = function()
    {
        if(this.xPos <= 0 || this.xPos + this.width >= levelInfo.width)
        {
            this.xVel = -this.xVel;
        }
        
        if(this.inLiquid)
        {
            if(this.xVel > 0)
            {
                this.xVel = this.swimSpeed;
            }
            if(this.xVel < 0)
            {
                this.xVel = -this.swimSpeed;
            }
        }
        
        this.gravity = this.lastGravity;
        this.height = 15 + (this.maxHeight - 15) * this.hp / this.maxHp;
    };
    
    this.onCollide = function(obj)
    {
        var next = false;
        if(this.inLiquid && (obj.name === "movingLava" || obj.name === "lava"))
        {
            return this.hitWall(obj);
        }
        this.inLiquid = false;
        if(obj.type === "item")
        {
           return false;
        }
        if(obj.blendsIn || obj.beakerImmune)
        {
            return false;   
        }
        switch(obj.type)
        {
            case "lifeform" :
                if(obj.physics.shape === "rect" && this.ontop(obj))
                {
                    this.hp -= obj.damage;   
                    obj.yPos = this.yPos - obj.height;
                    obj.yVel = -this.upPush;
                }else{
                    obj.hp -= this.damage;    
                }
                break;
                
            case "block" : 
                next = this.hitWall(obj);
                break;
                
            case "collision" : 
                this.hitWall(obj.physics.boundingBox);   
                break;
        }
        if(obj.blendsIn || obj.beakerImmune || obj.name === this.name || 
        obj.name === "beaker2")
        {
            next = false;   
        }
        if(obj.name === "water")
        {
            this.inLiquid = true;
            this.gravity = 0.0;
            next = false;
        }
        return next;
    };
};
gameObjects.addArray("beaker", createArray(Beaker));

var Beaker2 = function(config)
{
    Beaker.call(this, config);  
    this.color = config.color || color(166, 110, 49);
    this.lastOnCollide = this.onCollide;
    
    this.name = "beaker2";
    
    this.damage = config.damage || 0.25;
    
    this.maxHeight = this.height;
    this.maxHp = config.maxHp || 20;
    this.maxXVel = 5;
    this.hp = this.maxHp;
    this.lavaImmune = true;
    this.beaker2Immune = true;
    
    this.myHandleEdges = function(blocksBelow)
    {
        var ret = false;
        for(var i = 0; i < blocksBelow.length; i++)
        {
            if (blocksBelow[i].name === "quickSand" || 
                blocksBelow[i].name === "water")
            {
                ret = true;
                break;
            }
        }
        return ret;
    };
    
    this.onCollide = function(obj)
    {
        var ret = false;
        if(obj.blendsIn || obj.beaker2Immune)
        {
            return false;   
        }
        if(obj.type === "block" || obj.name === this.name)
        {
            this.handleEdges(2, this.myHandleEdges);
            ret = this.hitWall(obj);
        }else{
            ret = this.lastOnCollide(obj);
        }
        if(obj.name === "coin")
        {
            ret = false;
        }
        if(obj.name === "water")
        {
            this.hp -= this.maxHp/3;
            ret = false;
        }
        return ret;
    };
};
gameObjects.addArray("beaker2", createArray(Beaker2));

var RedBeakerBoss = function(config)
{
    Beaker2.call(this, config);
    this.color = config.color || color(200, 40, 40);
    
    this.damage = config.damage || 0.5;
    
    this.xVel = 0;
    this.yVel = 0;
    
    this.outerXVel = 0;
    this.outerYVel = 0;
    
    this.inAir = true;
    
    var adjustX = levelInfo.unitWidth / 40;
    var adjustY = levelInfo.unitHeight / 40;
    
    this.maxXVel = 5 * adjustX;
    this.xSpeed = (config.xSpeed || 1) * adjustX;
    
    this.ySpeed = (config.ySpeed || 0) * adjustY;
    this.gravity = 0.4 * adjustY;
    this.maxYVel = 12 * adjustY;
    this.dead = false;
    
    this.swimSpeed = 2 * adjustX;

    this.type = "lifeform";
    
    this.maxHeight = this.height;
    this.maxHp = config.maxHp || 200;
    this.hp = this.maxHp;
    
    this.sounds = {
        rocket : getSound("retro/rumble"),  
    };
    
    this.physics = {
        shape : "rect",
        movement : "mobile",
        solidObject : true,
        usesOnCollide : true,
        boundingBox : this,
    };
    
    this.lavaImmune = true;
    this.beaker2Immune = true;
    this.rocketTimer = 0;

    this.xVel = this.xSpeed;
    
    this.upPush = 7 * adjustY;
    
    this.maxHeight = this.height;
    this.lastGravity = this.gravity;
    this.goingToRocket = false;
    
    this.rocket = function()
    {
        this.inAir = true;
        if(this.rocketTimer > 10)
        {
            this.yVel -= this.upPush;
        }
        particles.create(this.xPos + this.width/2, this.yPos + this.height, 5, 10,
        color(200, 20, 20));
    };
    
    this.canSpawnBeaker2s = true;
    
    this.rocketRecharge = 250;
    this.rocketRechargeTimer = 0;
    
    this.spawnBeaker2s = function(amt)
    {
        for(var i = 0; i < amt; i++)
        {
            var sizeMult = random(0.6, 0.85);
            var xDir = random(-1, 1);
            gameObjects.addObject("beaker2", {
                xPos : this.xPos + xDir * this.width,
                yPos : this.yPos + this.height + abs(this.yVel), 
                width : this.width * sizeMult,
                height : this.height * sizeMult,
                maxHp : 5,
                damage : 0.25,
            }); 
            var beaker2s = gameObjects.getArray("beaker2");
            var beaker2 = beaker2s[beaker2s.length - 1];
            beaker2.xVel = xDir * 5;
        }
    };
    
    this.color1 = this.color;
    this.color2 = color(0, 0, 0);
    
    this.update = function()
    {
        if(this.xPos <= 0 || this.xPos + this.width >= levelInfo.width)
        {
            this.xVel = -this.xVel;
        }
        
        if(this.inLiquid)
        {
            if(this.xVel > 0)
            {
                this.xVel = this.swimSpeed;
            }
            if(this.xVel < 0)
            {
                this.xVel = -this.swimSpeed;
            }
        }
        
        if(this.goingToRocket && this.rocketTimer <= 0 && 
        this.rocketRechargeTimer >= this.rocketRecharge)
        {
            this.rocketTimer = 20;
            this.color = this.color2;
            this.rocketRechargeTimer = 0;
            this.canSpawnBeaker2s = true;
        }
        else if(!this.inAir && random(0, 100) > 98)
        {
            this.yVel -= this.upPush;
        }
        if(this.rocketTimer > 0 && this.yPos >= 0 && this.yVel < 0)
        {
            this.rocket();
            this.rocketTimer -= 2;
            if(this.canSpawnBeaker2s && this.rocketTimer < 5)
            {
                this.spawnBeaker2s(round(random(2, 4)));  
                this.canSpawnBeaker2s = false;
                soundUser.onPlaySound(this.sounds, "rocket", true);
            }
        }else{
            this.rocketRechargeTimer++;
        }
        
        this.goingToRocket = true;
        
        if(this.goingToRocket && this.rocketRechargeTimer > 
        this.rocketRecharge - this.rocketRecharge * 0.10)
        {
            if(this.color === this.color1)
            {
                this.color = this.color2;
            }
            else if(this.color === this.color2)
            {
                this.color = this.color1;
            }
        }else{
            this.color = (this.rocketTimer > 0) ? this.color2 : this.color1;
        }
        
        this.gravity = this.lastGravity;
        this.height = 15 + (this.maxHeight - 15) * this.hp / this.maxHp;
    };
    
    this.remove = config.remove;
    
    this.myHandleEdges = Beaker2.prototype.myHandleEdges;

    this.onCollide = function(obj)
    {
        var next = false;
        if(obj.name === "beaker" || obj.name === "beaker2" || 
        obj.name === "lava")
        {
            return false;   
        }
        if(obj.name === "water")
        {
            this.inLiquid = true;
            this.hp -= 0.1;
            this.gravity = 0;
            next = false;
        }else{
            this.inLiquid = false;
            switch(obj.name)
            {
                case "ground" : 
                        gameObjects.addObject("dirt", obj);
                        obj.remove();
                    break;
                    
                case "block":
                  obj.useStoredImages = true;
                        gameObjects.addObject("lava", obj);
                        obj.remove();
                    break;
                    
                case "dirt" : 
                        this.handleEdges(2, this.myHandleEdges);
                    break;
            }
           
            switch(obj.type)
            {
                case "lifeform" :
                    if(obj.physics.shape === "rect" && this.ontop(obj) && 
                    this.rocketTimer <= 0)
                    {
                        this.hp -= obj.damage;   
                        obj.yPos = this.yPos - obj.height;
                        obj.yVel = -this.upPush;
                    }else{
                        obj.hp -= this.damage;    
                    }
                    break;
                    
                case "block" : 
                    next = this.hitWall(obj);
                    break;
                    
                case "collision" : 
                    this.hitWall(obj.physics.boundingBox);    
                    break;
            }
        }
        return next;
    };
};
gameObjects.addArray("redBeakerBoss", createArray(RedBeakerBoss));

var Player = function(config)
{
    GameObject.call(this, config);
    MovingObject.call(this, config);
    
    this.color = config.color || color(47, 99, 189);
    
    this.xVel = 0;
    this.yVel = 0;
    
    this.outerXVel = 0;
    this.outerYVel = 0;
    
    this.inAir = true;
    
    var adjustX = levelInfo.unitWidth / 40;
    var adjustY = levelInfo.unitHeight / 40;
    
    this.moveSpeed = 0.5 * adjustX;
    this.xDcl = this.moveSpeed * 0.5;
    this.maxXVel = 5 * adjustX;
    
    this.gravity = 0.4 * adjustY;
    this.jumpHeight = 12 * adjustY;
    this.maxYVel = 13 * adjustY;
    
    this.scene = "normal";
    
    this.dead = false;
    
    this.swimSpeed = 2 * adjustX;
    this.climbSpeed = 2.5 * adjustX;
    
    this.type = "lifeform";
    
    this.maxHp = infoBar.maxHp;
    this.hp = this.maxHp;
    this.damage = 10;
    
    this.friction = 0;
    
    this.coins = 0;
    this.score = 0;
    
    this.collectedItems = {};
    this.onCollides = {};
    this.currentAbility = "";
    this.usingOnSave = true;
    
    this.normalHeight = this.height;
    this.crouchHeight = this.height / 2;
    this.crouching = false;
    this.sounds = {
        jumpSound : getSound("retro/jump2"),
        coinCollectedSound : getSound("retro/coin"),
        hitLava : getSound("retro/hit2"),
        waterSplash : getSound("rpg/water-slosh"),
    };
    
    this.physics = {
        shape : "rect",
        movement : "mobile",
        solidObject : true,
        boundingBox : this,
        usesOnCollide : true,
    };

    this.controls = config.controls || {
        openDoor : function()
        {
            return keys[DOWN] || keys[83] || keys[32];
        }, 
        jump : function()
        {
            return keys[UP] || keys[87];    
        },
        down : function()
        {
            return keys[DOWN] || keys[83];    
        },
        left : function()
        {
            return keys[LEFT] || keys[65];    
        },
        right : function()
        {
            return keys[RIGHT] || keys[68];    
        },
        useAbility : function()
        {
            return keys[88] || keys[75];
        },
    };

    this.update = function()
    {
        if(this.yPos >= levelInfo.height - (abs(this.yVel) + 1))
        {
            this.dead = true;
        }
        
        if(this.hp <= 0)
        {
            this.dead = true; 
        }
        
        if(this.hp > this.maxHp)
        {
            this.hp = this.maxHp;
        }
        
        if(this.dead)
        {
            loader.startLevelLoading(levelInfo);    
        }

        if(this.controls.left()) 
        { 
            this.xVel -= this.moveSpeed; 
        }
        if(this.controls.right())
        { 
            this.xVel += this.moveSpeed; 
        }
        
        if(!this.controls.left() && !this.controls.right()) 
        {
            var xDcl = ((!this.inAir) ? this.xDcl + this.friction :
            (this.xDcl + this.friction) * 0.6);
            if(this.inAir)
            {
                if(this.xVel > 0.0) 
                {
                    this.xVel += this.moveSpeed * 0.075;
                }
                if(this.xVel < 0.0) 
                {
                    this.xVel -= this.moveSpeed * 0.075;
                }   
            }
            if(this.xVel > 0.0) 
            {
                this.xVel -= xDcl;
            }
            if(this.xVel < 0.0) 
            {
                this.xVel += xDcl;
            }
            if(this.xVel < xDcl && this.xVel > 0.0) 
            {
                this.xVel = 0;
            }
            if(this.xVel > -xDcl && this.xVel < 0.0) 
            {
                this.xVel = 0;
            }
        }
        
        // Checks if we're able to jump
        if(this.controls.jump())
        {
            if(!this.inAir)
            {
                this.yVel = -this.jumpHeight;
                if(!this.inLiquid)
                {
                    soundUser.onPlaySound(this.sounds, "jumpSound", true);
                }
            }
            if(this.inLiquid)
            {
                this.yVel = -this.swimSpeed;
            }
            else if(this.onLadder)
            {
                this.yVel = -this.climbSpeed;
            }
        }
        if(this.controls.down())
        {
            if(this.inLiquid) 
            {
                this.yVel = this.swimSpeed;
            }
            else if(this.onLadder)
            {
                this.yVel = this.climbSpeed;
            }
        }

        if(!this.controls.jump() && !this.controls.down())
        {
            if(this.onLadder)
            {
                this.yVel = 0;
            }
        }

        //Disabled crouch effect causes extreme amount of physics glitches
        /*if(this.controls.down())
        {
            if(this.height !== this.crouchHeight)
            {
          this.yPos += this.crouchHeight;
                this.height = this.crouchHeight;
            }
            this.crouching = true;
        }else{
            this.height = this.normalHeight;  
            if(this.crouching)
            {
          if(!this.inAir)
          {
              this.xVel = 0;
          }
          this.crouching = false;
            }
        }*/
    };
    
    this.draw = function() 
    {
        noStroke();
        fill(this.color);
        rect(this.xPos, this.yPos, this.width, this.height, 5);
        fill(0, 0, 0, 100);
        ellipse(this.xPos + this.width * 0.33, 
        this.yPos + this.height * 0.30, 
        this.width * 0.15, this.height * 0.13);
        ellipse(this.xPos + this.width * 0.68, 
        this.yPos + this.height * 0.30, 
        this.width * 0.15, this.height * 0.13);
    };
    
    this.onCollide = function(obj)
    {
        var item = this.onCollides[obj.name];
        if(item !== undefined && item.onCollide !== undefined)
        {
            item.onCollide(this, obj);
        }
        
        //our sounds
        switch(obj.name)
        {
            case "coin" : case "hp" :
                    soundUser.onPlaySound(this.sounds, "coinCollectedSound");
                break;
                
            case "lava" : case "movingLava" :
                    soundUser.onPlaySound(this.sounds, "hitLava", true);
                break;
                
            case "water" :
                    soundUser.onPlaySound(this.sounds, "waterSplash", true);
                break;
        }
        
        this.lastCollidedName = obj.name;
    };
    
    this.onSave = function()
    {
        var inventory = gameObjects.getInventory(this.name, this.index);
        inventory.maxHp = this.maxHp;
        inventory.hp = constrain(this.hp, 0, this.maxHp) || this.maxHp; 
        inventory.collectedItem  = this.collectedItems;
        inventory.onCollides     = this.onCollides;
        inventory.currentAbility = this.currentAbility;
    };
};
gameObjects.addArray("player", createArray(Player));

var levels = {
    "Test" : {
        background : "underground",
        doors : {
            'a' : {
                level : "Test",
                door : 'a',
            },
        },
        plan : [ 
            "                   ",
            "                   ",
            "                   ",
            "                   ",
            "                   ",
            "                   ",
            "                   ",
            "  a                ",
            "  D |||///         ",
            "ggggggggggggggggggg",
        ],
    },
    "Intro" : {
        background : "ice",
        doors : {
            'a' : {
                level : "Intro",
                door : 'a',
            },
            'd' : {
                targetDoor : true,
                level : "Cave",
                door : 'a',
            },
            'b' : {
                level : "Intro",
                door : 'c'
            },
            'c' : {
                level : "Intro",
                door : 'b'
            },
        },
        signs : {
            'a' : {
                message : "Welcome to level1",   
            },
            'b' : {
                message : "Use the spacebar or the \n down key to open a door!",   
            },
            'c' : {
                message : "run!",   
            },
            'd' : {
                message : "Low on hp? Take these.",   
            },
            'e' : {
                message : "You finished level1!",   
            },
        },
        plan : [
            "                                                            ",
            "                                                            ",
            "                ccc                                         ",
            "       c                                                    ",
            "      c                                                     ",
            "cc                                                          ", 
            "DS         f f      f f f                                   ", 
            "f f f                                                       ", 
            "                            c             K                 ", 
            "                                        K                   ",
            "                                      K                     ",
            "                              c                             ",
            "                      c                                     ", 
            "             E                                              ", 
            "           PPP      c   c                                   ",  
            "a   a                          b  b             d        e d", 
            "D   S  e           r     l     S  D             Se  hhh  S D",
            "gggggggggggggggggggg#####ggggggggggggggggggggggggggggggggggg",
        ],
    },
    "Cave" : {
        background : "ice",
        doors : {
            'a' : {
                level : "Intro",
                door : 'd'
            },
            'b' : {
                targetDoor : true,
                level : "Circlade_Parkour",
                door : 'b'
            },
        },
        plan : [
           "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
           "b%3#3%   %  #b                   b                      ",
           "b#           b    hh   c         bb                     ",
           "b#    rO#l   b                   bD                     ",
           "b    rb  bl  bPPPb  ff   ff bbbMMbbbbbbb                ",
           "b% O %   %O  %   b          b         bb                ",
           "b                b          b         bb                ",
           "ba      EE       b          bwwwwwwwwwbggggggggg        ",
           "bD  b   EE    bssb          bwwWewwWwwwwWwwWwwwwwwwggggg",
           "bbbbbbbbbbbbbbbbbb          bwwwwwwwewwwccwwwwwwwwwb    ",
           "bbbbbbbbbbbbbbbbbb          bbbwwbbbwwwwwwwwwwwwwwwb    ",
        ],
    },
    "Circlade_Parkour" : {
        background : "ice",
        doors : {
            'a' : {
                targetDoor : true,
                level : "Dogde_Tower",
                door : 'a',
            },
            'b' : {
                level : "Cave",
                door : 'd'
            },
        },
        plan : [
            "bbbbbbbbbbbbbbbbbbbbb",
            "bbb             bbbbb",
            "bbb                 b",
            "bbb                ab",
            "bbb        rb      Db",
            "bbb   O    bbb     bb",
            "bbb  o      #     #bb",
            "bbb              bbbb",
            "bbb              bbbb",
            "bbb               #bb",
            "bbbo    O          bb",
            "bbL                bb",
            "bL           rb    bb",
            "b    O       b##   bb",
            "b             #    bb",
            "bb       rb        bb",
            "bD      rbb        bb",
            "bbbbbbbbbbbbbbbbbbbbb",
        ],
    },
    "Dogde_Tower" : {
        background : "ice",
        doors : {
            'a' : {
                level : "Circlade_Parkour",
                door : 'a',
            },
            'b' : {
                targetDoor : true,
                level : "Dangerous_Slopes",
                door : 'a',
            },
        },
        plan : [
            "         b                  ",
            "         b                  ",
            "rbbbbl   bb                 ",
            "bL  Rb   bD                 ",
            "ba   b   bPPbm       mbPPb  ",
            "bD   bbbbbbL          bPPb  ",
            "bPP  PPPPbL           >PP<  ",
            "b#    >  b            >  <  ",
            "b#    >  b            ^^^^  ",
            "b#    >  b                  ",
            "b#^^^33vvb                  ",
            "b#   33  b        rb        ",
            "bb   <   b     bPPbL        ",
            "b    <   b     bPPb         ",
            "b    <   b     bPPb         ",
            "bvvvbbb  b     bPPb         ",
            "b        b     >  <         ",
            "b     ###b     >  <         ",
            "b     bbbb     ^^^^         ",   
            "b#vvvvvvvb                  ",        
            "b#       b                  ",
            "b#^^^^   b          bPPb    ",
            "b#bbbb   b          bPPb    ",
            "bBBBBb   b          bPPb    ",
            "bBBB3   rb          bPPb    ",
            "bBBb3   3b          >PP<    ",
            "bBb#    #b          >PP<    ",
            "bb3    3bb          >  <    ",
            "bb#    3bb          >  <    ",
            "bBb3   #bbbbPPbl    ^^^^    ",
            "bBBb#   3bbbPPbbl           ",
            "bbbbvvvvvbbbPPbBbl          ",
            "b           PPbBBbl         ",
            "bbbbbbbbbbbbbbBbbbbbbbbbbbbb",
        ],
    },
    "Dangerous_Slopes" : {
        background : "ice",
        doors : {
            'a' : {
                level : "Dogde_Tower",
                door : 'b',
            },
            'b' : {
                targetDoor : true,
                level : "Tricky_Ways",
                door : 'a',
            },
            'c' : {
                level : "Dangerous_Slopes",
                door : 'c',
            },
        },
        signs : {
            'a' : {
                message : "Doors double as a checkpoint!"
            },
        },
        plan : [
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "b                             b",
            "b                             b",
            "bPPbbbbbbbbbl                 b",
            "b    K   M bbl                b",
            "b          bbbl               b",
            "bPP   M    bbbbl              b",
            "b          Rbbbbbl            b",
            "b  M    K    c a Rl          bb",
            "bbb#3#333#bl D S  Rbl        Db",
            "bbbbbbbbbbbbbbbbl   Rbbbbbbbbbb",
            "bbb  a k       Rbl       K  K b",
            "bbbl D    k     Rbbbbl        b",
            "bbbbbbblk        Rbbbbbwwwwwwwb",
            "bL     Rbl         bbbbPPbPPbPb",
            "b       bbwW W W W bbbb       b",
            "b       bww e      bbbb       b",
            "b       bW WKW W W W W sssssssb",
            "b       bWe        K   wW W W b",
            "bl     rbdgwwW#ggwwwwWKw      b",
            "bbbbbbbbbbddggddddddgggddddddbb",
        ],
    },
    "Tricky_Ways" : {
        background : "ice",
        doors : {
            'a' : {
                level : "Dangerous_Slopes",
                door : 'b',
            },
            'b' : {
                targetDoor : true,
                level : "Boss_Room",
                door : 'a',
            },
            'c' : {
                level : "Tricky_Ways",
                door : 'c'
            },
        },
        signs : {
            'a' : {
               message : " trooollled ",
            },
        },
        plan : [
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bw w w wew wew w       >ccccc",
            "D w wew w w w wew      >ccccc",
            "bbbbbbbbbbbbbbbbbPPPPPbbbbbb ",
            "         hccb          %   % ",
            "        mbbbb                ",
            "         3#3333#b3#3  c%   % ",
            "a##3#3##3#awwwwww#3#  D      ",
            "DwwwwwwwwwSwrb e      b      ",
            "bblMMwwMMrbbbbbbbbbbbbbbbbbbb",
        ],
    },
    "Boss_Room" : {
        background : "lava",
        doors : {
            'a' : {
                level : "Tricky_Ways",
                door : 'b',
                locked : true,
            },
            'b' : {
                level : "Rewards!",
                door : 'a',
                locked : true,
            },
        },
        bosses : {
            'a' : {
                boss : "redBeakerBoss",
                defeated : false,
            },
        },
        act : function()
        {
            if(gameObjects.getArray("redBeakerBoss").length >= 1)
            {
                var boss = gameObjects.getArray("redBeakerBoss")[0];
                screenUtils.bossBar.draw(boss.hp, boss.maxHp);
            }
        },
        plan : [
            "          ",
            "          ",
            "h        h",
            "          ",
            "          ",
            "b        b",
            "          ",
            "a   a    b",
            "D   $    D",
            "gggggggggg",
            "dddYdddYdd",
        ],
    },
    "Rewards!" : {
        background : "lava",
        doors : {
            'a' : {
                level : "Boss_Room",
                door : 'b',
            },
            'b' : {
                level : "Volcanic_System",
                door : 'a'
            },
        },
        signs : {
            'a' : {
                message : "Take this the Power of Beakers!"
            },
            'b' : {
                message : "You have gained power!"
            },
        },
        powers : {
            'a' : {
                name : "power",
                amt : 25,
                collected : false, 
            },
        },
        plan : [
            "            a       #    hchc       ",
            "a      a    *   b   #    chch      b",
            "D      S        S   #    hchc      D",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
        ],
    },
    "Volcanic_System" : {
        background : "lava",
        doors : {
            'a' : {
                level : "Rewards!",
                door : 'b'
            },
            'b' : {
                level : "Volcanic_System",
                door : 'b'
            },
            'c' : {
                targetDoor : true,
                level : "Treasure?",
                door : 'a'
            },
        },
        signs : {
            'a' : {
                message : "Welcome to the Volcanic System."
            },
        },
        plan : [
            "ddddddddddddddddddddddddddddddddddddddd",
            "c        dddddddddddddddddddddddddddddd",
            "D        h     k<    hhhhhhh    K      ",
            "^^^^^dk  h      <dddKb b blhh          ",
            "dqddqdddddddddddddd   K  Rblhb         ",
            "  k     d         d     K RblDK     K  ",
            "                  RdddddddddddddddddPPP",
            "b  b                    c    K  c  KPPP",
            "  b  b  PPP                            ",
            "a  a                                   ",
            "D  S  E           E   ####  c   #  c   ",
            "gggggggggggggqqqqgggggggggggggggggggggg",
        ],
    },
    "Treasure?" : {
        background : "lava",
        doors : {
            'a' : {
                level : "Volcanic_System",
                door : 'c'
            },
            'b' : {
                targetDoor : true,
                level : "Underground_Parkour_#1",
                door : 'a'
            },
            'c' : {
                level : "Coins", 
                door : 'a',
            },
        },
        plan : [
            "                                       ",
            "    cc         cc                      ",
            "c                                      ",
            "D                                      ",
            "bbb    bbbbbbb     bbbbb   bbbb        ",
            "                              RbbbU    ",
            "                                  U    ",
            "                                  U    ",
            "                                  U    ",
            "                                       ",
            "                                       ",
            "                                       ",
            "                                       ",
            "                                       ",
            "                                ?PP?   ",
            "       ?Nn?                            ",
            "a                           EE        b",
            "D           E               EE        D",
            "ggggggggggggggggqqqqqqqqqgggggggggggggg",
        ],
    },
    "Coins" : {
        background : "underground",
        doors : {
            'a' : {
                level : "Treasure?",
                door : 'c',
            },
            'b' : {
                targetDoor : true,
                level : "Underground_Parkour_#1",
                door : 'a'
            },
        },
        signs : {
            'a' : {
                message : "Thanks for dropping in!",
                 textColor : color(240, 245, 245)
            },
            'b' : {
                message : "Looks like you dropped out.",
                textColor : color(240, 245, 245)
            }
        },
        plan : [ 
            "b       ab",
            "b       Db",
            "b bbbbbbbb",
            "b bwwwwwwb",
            "b bwwwwwwb",
            "b bwwwwwwb",
            "b bbbbbbbb",
            "b cccccccb",
            "b cccccccb",
            "b cccccccb",
            "b cccccccb",
            "bacccccccb",
            "bSsssssssb",
            "bbbbbbbb b",
            "bbbbbbbb b",
            "bbbbbbbb b",
            "bbbbbbbb b",
            "bbbbbbbb b",
            "b        b",
            "bb     b b",
            "bD     S b",
            "bbbbbbbbbb",
        ],
    },
    "Underground_Parkour_#1" : {
        background : "underground",
        doors : {
            'a' : {
                level : "Treasure?",
                door : 'b',
            },
            'b' : {
                targetDoor : true,
                level : "Underground_Parkour_#2",
                door : 'a',
            },
        },
        plan : [ 
            "U                       ",
            "U                       ",
            "U                       ",
            "U                X     b",
            "U         iii      X   D",
            "U   ii                 b",
            "U                       ",
            "  vvvvvvvvvvvvvvvvvvvvvv",
            "                        ",
            "                        ",
            "fXfXfXfXfXfXfXfXfl      ",
            "vvvvvvvvvvvvvvvvvvbUUbvv",
            "                   UU   ",
            "                   UU   ",
            "            X           ",
            "                        ",
            "                        ",
            "                   ii   ",
            "                        ",
            "XXX     riii            ",
            "                        ",
            "                        ",
            "                        ",
            "iii  vvvvvvvvvvvvvvvvvvv",
            "                        ",
            "                        ",
            "NNNbNNbNNNb             ",
            "NNNbNNbNNNb             ",
            "a         b             ",
            "D         b             ",
            "bbbbbbbbbbbbbbbbbbbbbbbb",
        ],
    },
    "Underground_Parkour_#2" : {
        background : "underground",
        doors : {
            'a' : {
                level : "Underground_Parkour_#1",
                door : 'b',
            },
            'b' : {
                targetDoor : true,
                level : "Underground_Parkour_#3",
                door : 'a',
            },
        },
        plan : [
            "                          b",
            "                          D",
            " U                       bb",
            " U        X                ",
            " U            ii           ",
            " U   iii                   ",
            " U                  ss     ",
            " U vvvvvvvvvvvvvvvvvvvvvvvv",
            "aU                         ",
            "DU                         ",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbb",
        ]
    },
    "Underground_Parkour_#3" : {
        background : "underground",
        doors : {
            'a' : {
               level : "Underground_Parkour_#2",
               door : 'b',
            },
            'b' : {
                targetDoor : true,
                level : "Breaking_Ice",
                door : 'a',
            },
        },
        plan : [
            "          ",
            "          ",
            "   X   X  ",           
            "   X   X b",
            "   b   b D",
            "  bbbbbbbb",
            " bXbbXbbXX",
            "s         ",
            "          ",
            "          ",
            "sbf  f  f ",
            "b XXXXXXX ",
            "bbbbbbbbb ",
            "          ",
            " rffffffff",
            " bXXXXXXXX",
            " bbbXbbXbb",
            "          ",
            "          ",
            "          ",
            "ssXXsXXs  ",
            "bbbbbbbbb ",
            "          ",
            "   bb m  b",
            "   bbXXXXb",
            "          ",
            "          ",
            "bb        ",
            "          ",
            "    Xbb   ",
            "          ",
            "          ",
            "      X   ",
            "a     X   ",
            "D   s    s",
            "bbb      b",
        ],
    },
    "Breaking_Ice" : {
        background : "ice",
        doors : {
            'a' : {
                level : "Underground_Parkour_#3",
                door : 'b'
            },
            'b' : {
                targetDoor : true,
                level : "A_Dangerous_Drop",
                door : 'a'
            },
        },
        signs : {
            'a' : {
                message : "This is the elongated path."  
            },
            'b' : {
                message : "It looks like there's no way to get below the ice."   
            },
            'c' : {
                message : "But there is a way to get up here"  
            },
            'd' : {
                message : "Take this your first tool. \n Press x / k to use it.",   
            },
        },
        powers : {
            'a' : {
                name : "iceBreaker",
                collected : false,
            },
        },
        plan : [
            "                   ",
            "a  d               ",
            "*  S               ",
            "bbbb               ",
            "       bb     c    ",
            "              S    ",
            "              bbbbb",
            "                   ",
            "                   ",
            "                   ",
            "           II      ",
            "                 II",
            "                   ",
            "              b    ",
            "a a           S    ",
            "D S   iiiiiiiiiiiii",
            "ggggggdwwwwwwwwwwwd",
            "ddddddwwwwwwwwwwwww",
            "dbddddwwwwwwwwwwwww",
            "ddddbdwwwwwwwwwwwww",
            "ddddddwwwwwwwwwwbww",
            "ddbdddwwwwwwwwwwDww",
            "ddddddwwwwwwwwwdddw",
        ]
    },
    "A_Dangerous_Drop" : {
        background : "ice",
        doors : {
            'a' : {
                level : "Breaking_Ice",
                door : 'b'
            },
            'b' : {
                targetDoor : true,
                level : "Super_Dash",
                door : 'a',
            },
            'c' : {
                level : "A_Dangerous_Drop",
                door : 'd',
            },
            'd' : {
                level : "A_Dangerous_Drop",
                door : 'c'
            }
        },
        plan : [
            "           ",
            "    d      ",
            "    D      ",
            "           ",
            "           ",
            "           ",
            "           ",
            "    #      ",
            "   #b#     ",
            "   # #     ",
            "           ",
            "           ",
            "      ww   ",
            "      ww   ",
            "ss##       ",
            "ssb        ",
            "#sb       #",
            " hb      ##",
            " hb     ##b",
            " sb     ##b",
            "sbb     ##b",
            "s#b    ###b",
            "ssb   #    ",
            "ssb  #     ",
            "ssb      b ",
            "hsb       b",
            "hsb        ",
            "ssb#       ",
            "wwb##      ",
            "#wb##      ",
            "wss       s",
            "ww       ss",
            "ww      sss",
            "w      #bbb",
            "      #b   ",
            "           ",
            "           ",
            "s          ",
            "bb  b      ",
            "######     ",
            "bbbbbbbwwwb",
            "a    cb   b",
            "D    Db   D",
            "bbbbbbbbbbb",
        ],
    },
    "Super_Dash" : {
        background : "ice",
        doors : {
            'a' : {
                level : "A_Dangerous_Drop",
                door : 'b',
            },
            'b' : {
                level : "Dimension_Bridge",
                door : 'a',
            },
            'c' : {
                level : "Super_Dash",
                door : 'c',
            },
            'e' : {
                level : "Super_Dash",
                door : 'e',
            },        
      },
      signs : {
            'a' : {
                message : "Hello, welcome to the Super Dash\n there will be a series of obstacles.",
            },
            'b' : {
                message : "Press x / k", 
            }
        },
        powers : {
            'a' : {
                name : "iceBreaker",
                collected : false,
            },
        },
        plan : [  
            "            rbbbbbbbbbbl         b                               bPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
            "           rL   c    wWRl        bl                              b                                                           ",
            "          rL    Dr///w  bbbl     bbbbbbbbbbbbbbbbl               b                                                           ",
            "          <#   PPPL Rqqwwqqbl   rbhcche          >           b   b                                                           ",
            "          <#    bL   RbwwwqwqbbbbbhcchD          >           S   b                h                                          ",
            "          b#    b     RbwqqwwqqbbbbbbbbPPP///////L   bb      biiib                                                           ",
            "          Rb||| b      RYbbwwqqqbL        b                  biii                                                          bb",
            "a a a      Rbbb b       Rbb/bbvvL         b                  biii            E               X                             bb",
            "D S * riO       b          RYbl   r//////sb                  biiibbbb      bbbbb     b   bb       X    b dd  b  b          Db",
            "bbbbbbbbYYbb///sb           Rbb///L     RbL                  bbbbL                                                      bbbbL",
            "biiiiiiiiiiiiiibb                                                                                                            ",
        ],  
    },
    "Dimension_Bridge" : {
        background : "underground",
        doors : {
            'a' : {
                level : 'Super_Dash',
                door : 'b',
            },
            'b' : {
                level : "Finish",
                door : 'a',
            }
        },
        signs : {
            'a' : {
                 textColor : color(255, 255, 255),
                 message : "Welcome to the longest bridge - The Dimension Bridge!",
            },
            'b' : {
                 textColor : color(255, 255, 255),
                 message : "It's task was to stretch between Dimensions,\n from one of danger to one of safety. Some people call it a cave,\n I call it the dark because it's the void in between dimensions!",
            },
            'c' : {
                 textColor : color(255, 255, 255),
                 message : "This is the final stretch. Remember that you're leaving\n Planet Search a fallen world. The bridge is still some what\n experimental So take caution and good luck!",
            }
        },
        act : function()
        {  
            if(random(0, 100) <= 2)
            {
                screenUtils.shakeScreen(5, random(3, 5));
            }
        },
        plan : [
            "                                                                                                                                                     ",
            "                                                                                                                                                     ",
            "                                                                                                                                                     ",
            "                                                                                                                                                     ",
            "                                                                                                                                                     ",
            "                                                                                                                                                     ",
            "                                                                                                                                                     ",
            "                                                                                                                                                     ",
            "                                                                                                                                                     ",
            "                                                                                                                                                     ",
            "                                                                                                                                                     ",
            "                                                                                                                                                     ",
            "                                                     rbl        rbl                                    rbl        rbl                                ",
            "                                                                                                                                                     ",
            "                                                                                                                                                   bb",
            "a   a      b     c                                                                                                                                 bd",
            "D   S      S     S                                rbbbzbbbl  rbbbzbbbl                              rbbbzbbbl  rbbbzbbbl                           Dd",
            "gggbbbbbbbbbbbbbbbbbbP^^^^^^^P^^^^^Pbbbl   rbbbfbbbbL   RbbbbbbL   RbbbbbbbbP^^^^^^Pl   rP^^^^PbbbbbbbL   RbbbbbbL   RbbbffbbP^^^^P^^^^^Pbbffbbbbbbbb",
            "ddddL                f             f   RfffL          b          b          f       RfffL     f         b          b         f          f       Rbbbb",
            "dddL                 P             P                                        P                 P                              P          P        Rbbb",
        ],
    },
    "Finish" : {
        background : "underground",
        doors : {
            'a' : {
                level : "Dimension_Bridge",
                door : 'b',
            }
        },
        signs : {
            'a' : {
                textColor : color(255, 255, 255),
                message : "You escaped Planet Search made by Prolight!"
            },
        },
        plan : [
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "          ",
            "a  a      ",
            "D  S      ",
            "bbbbbbbbbb",
        ],
    },
};
levels.getSymbol = function(col, row, levelPlan)
{
    if(col >= 0 && col < levelPlan.length &&
    row >= 0 && row < levelPlan[0].length)
    {
        return levelPlan[col][row];  
    }else{
        return " ";    
    }
};
levels.build = function(plan)
{
    var level = this[plan.level];
    levelInfo.width = plan.unitWidth * level.plan[0].length;
    levelInfo.height = plan.unitHeight * level.plan.length;
    
    backgrounds.background = level.background || backgrounds.background;
    level.act = level.act || function() {};
    
    var addCollect = function(dest, config)
    {
        config.collect = function()
        {
            dest.collected = true;
        };
    };
    var addRemoveForBoss = function(dest, config)
    {
        config.remove = function()
        {
            this.delete = true;
            dest.defeated = true;
            var arr = gameObjects.getArray("door");
            for(var i = 0; i < arr.length; i++)
            {
                arr[i].locked = false;
            }
            for(var i in level.doors)
            {
                level.doors[i].locked = false;
            }
        };
    };
    
    var seperateBeakers = function(symbol)
    {
        return !(((levels.getSymbol(col + 1, row, level.plan) === symbol && 
            levels.getSymbol(col, row + 1, level.plan) === symbol && 
            levels.getSymbol(col + 1, row + 1, level.plan) === symbol)) ||

            ((levels.getSymbol(col - 1, row, level.plan) === symbol && 
            levels.getSymbol(col, row + 1, level.plan) === symbol && 
            levels.getSymbol(col - 1, row + 1, level.plan) === symbol)) ||

            ((levels.getSymbol(col, row - 1, level.plan) === symbol && 
            levels.getSymbol(col - 1, row, level.plan) === symbol && 
            levels.getSymbol(col - 1, row - 1, level.plan) === symbol)) ||

            ((levels.getSymbol(col, row - 1, level.plan) === symbol && 
            levels.getSymbol(col + 1, row, level.plan) === symbol && 
            levels.getSymbol(col + 1, row - 1, level.plan) === symbol)));
    };

    for(var col = 0; col < level.plan.length; col++)
    {
        for(var row = 0; row < level.plan[0].length; row++)
        {
            var xPos = row * plan.unitWidth;
            var yPos = col * plan.unitHeight;
            
            var config = {
                xPos : xPos,
                yPos : yPos,
                width : plan.unitWidth,
                height : plan.unitHeight,
            };
            
            var getSymbol = levels.getSymbol(col + 1, row, level.plan);
            
            if(getSymbol === 'D')
            {
                if(level.plan[col][row] === plan.door)
                {
                    gameObjects.addObject("player", config);
                }
                else if(level.plan[col][row] === ' ')
                {
                    println("Error : Symbol missing above the door \n at "+ 
                    col + "," + row + " in level '" + plan.level + "' !");
                }
                continue;
            }
            else if(getSymbol === 'S' || 
            getSymbol === '*' || 
            getSymbol === '$' || 
            getSymbol === "?")
            {
                continue;
            }
            
            switch(level.plan[col][row])
            {
                case 'I' : 
                        gameObjects.addObject("invisibleBlock", config);
                    break;
                
                case 'b' :
                        gameObjects.addObject("block", config);
                    break;
                
                case 'i' :
                        gameObjects.addObject("ice", config);
                    break;
                    
                case 'N' :
                        config.smashAmt = 4;
                        gameObjects.addObject("brick", config);
                    break; 
                    
                case 'X' :
                        gameObjects.addObject("spikeBlock", config);
                    break; 
                    
                case 'n' :
                        gameObjects.addObject("brick", config);
                    break;
                    
                case 'U' :
                        gameObjects.addObject("ladder", config);
                    break;
                    
                case 'f' :
                        gameObjects.addObject("fallBlock", config);
                    break;
                    
                case 'g' :
                        gameObjects.addObject("ground", config);
                    break;
                    
                case 'd' :
                        gameObjects.addObject("dirt", config);
                    break;
                    
                case 'B' :
                        gameObjects.addObject("blankBlock", config);
                    break;
                    
                case '%' :
                        config.width *= 4;
                        config.height *= 4;
                        gameObjects.addObject("backBlock", config);
                    break;
                    
                case 'P' :
                        gameObjects.addObject("platform", config);
                    break;
                    
                case 'm' :
                        config.xSpeed = 2;
                        gameObjects.addObject("movingPlatform", config);
                    break;
                    
                case 'M' :
                        config.ySpeed = 2;
                        gameObjects.addObject("movingPlatform", config);
                    break;
                    
                case '<' : 
                        config.sides = {
                            left : true,    
                        };
                        gameObjects.addObject("oneway", config);   
                    break;    
                    
                case '>' : 
                        config.sides = {
                            right : true,    
                        };
                        gameObjects.addObject("oneway", config);   
                    break;
                    
                case '^' : 
                        config.sides = {
                            top : true,    
                        };
                        gameObjects.addObject("oneway", config);   
                    break;    
                    
                case 'v' : 
                        config.sides = {
                            bottom : true,    
                        };
                        gameObjects.addObject("oneway", config);   
                    break;
                
                case 'o' :
                        config.diameter = plan.unitHeight;
                        config.xPos += config.diameter/2;
                        config.yPos += config.diameter/2;
                        gameObjects.addObject("circle", config);
                    break;
                    
                case 'O' :
                        config.diameter = plan.unitWidth * 2;
                        config.xPos += config.diameter/2;
                        config.yPos += config.diameter/2;
                        gameObjects.addObject("circle", config);
                    break;
                
                case 'l' : 
                        config.direction = "leftup";
                        gameObjects.addObject("slope", config);
                    break;
                    
                case 'r' : 
                        config.direction = "rightup";
                        gameObjects.addObject("slope", config);
                    break;
                    
                case 'L' : 
                        config.direction = "leftdown";
                        gameObjects.addObject("slope", config);
                    break;
                    
                case 'R' : 
                        config.direction = "rightdown";
                        gameObjects.addObject("slope", config);
                    break;
                    
                case 's' :
                        gameObjects.addObject("spring", config); 
                   break;
                    
                case '#' :
                        gameObjects.addObject("lava", config); 
                   break;
                   
                case '3' :
                        config.imagesAmount = 2;
                        gameObjects.addObject("lava", config); 
                   break;
                 
                case 'k' :
                        config.xSpeed = 3;
                        gameObjects.addObject("movingLava", config); 
                   break; 
                   
                case 'K' :
                        config.ySpeed = 3;
                        gameObjects.addObject("movingLava", config); 
                   break;
                   
                case 'w' :
                        gameObjects.addObject("water", config); 
                   break;
                   
                case 'W' :
                        config.width *= 2;
                        config.height *= 2;
                        gameObjects.addObject("water", config); 
                   break;
                 
                case "q" : 
                        gameObjects.addObject("quickSand", config);
                    break;
                 
                case 'c' :
                        config.diameter = plan.unitHeight/2;
                        config.xPos += config.diameter/2;
                        config.yPos += config.diameter/2;
                        gameObjects.addObject("coin", config);
                    break;
                    
                case 'h' :
                        config.diameter = plan.unitHeight/2;
                        config.xPos += config.diameter/2;
                        config.yPos += config.diameter/2;
                        gameObjects.addObject("hp", config);
                    break;
                    
                case '*' :
                        var symbol = levels.getSymbol(col - 1, row, level.plan);
                        var dest = level.powers[symbol];
                        if(!dest.collected)
                        {
                            config.amt = dest.amt;
                            config.diameter = plan.unitHeight;
                            config.xPos += plan.unitHeight/2;
                            config.yPos += plan.unitWidth/2;
                            addCollect(dest, config);
                            gameObjects.addObject(dest.name, config);
                        }
                    break;
                
                case 'e' : 
                        config.xSpeed = 1;
                        config.hp = 10;
                        if(levels.getSymbol(col, row + 1, level.plan) === 'e' && 
                        levels.getSymbol(col + 1, row, level.plan) === 'e' && 
                        levels.getSymbol(col + 1, row + 1, level.plan) === 'e')
                        {
                            gameObjects.addObject("beaker", config);
                            config.xSpeed *= 2;
                            config.hp *= 4;
                            config.width *= 2;
                            config.height *= 2; 
                            gameObjects.addObject("beaker", config);
                        }
                        else if(seperateBeakers('e'))
                        {
                            gameObjects.addObject("beaker", config);  
                        }
                    break; 
                 
                case 'E' : 
                        config.xSpeed = 1;
                        config.hp = 20;
                        if(levels.getSymbol(col, row + 1, level.plan) === 'E' && 
                        levels.getSymbol(col + 1, row, level.plan) === 'E' && 
                        levels.getSymbol(col + 1, row + 1, level.plan) === 'E')
                        {
                            gameObjects.addObject("beaker2", config);
                            config.xSpeed *= 2;
                            config.hp *= 4;
                            config.width *= 2;
                            config.height *= 2;  
                            gameObjects.addObject("beaker2", config);
                        }
                        else if(seperateBeakers('E'))
                        {
                           gameObjects.addObject("beaker2", config);
                        }
        
                    break; 
                 
                case '$' : 
                        var symbol = levels.getSymbol(col - 1, row, level.plan);
                        var dest = level.bosses[symbol];
                        if(!dest.defeated)
                        {
                            addRemoveForBoss(dest, config);
                            gameObjects.addObject(dest.boss, config);
                        }
                    break;
                 
                case '?' : 
                        var sym = levels.getSymbol(col - 1, row, level.plan);
                        if(level.questionMarkBlocks !== undefined &&
                        level.questionMarkBlocks[sym] !== undefined)
                        {
                            config.contains = level.questionMarkBlocks[sym].contains;
                        }
                        gameObjects.addObject("questionMarkBlock", config);
                    break;
                    
                case 'p' : 
                        config.controls = controls.playercontrols;
                        gameObjects.addObject("player", config);   
                    break;
                
                case 'S' : 
                        var sym = levels.getSymbol(col - 1, row, level.plan);
                        var dele = level.signs[sym];
                        config.message = dele.message;
                        config.textColor = dele.textColor;
                        gameObjects.addObject("sign", config);
                    break;
                    
                case 'D' : 
                        var symbol = levels.getSymbol(col - 1, row, level.plan);
                        var dest = level.doors[symbol];
                        config.locked = dest.locked;
                        config.symbol = symbol;
                        config.level = dest.level;
                        config.targetDoor = dest.targetDoor;
                        config.door = dest.door;
                        config.yPos -= config.height;
                        config.height *= 2;
                        gameObjects.addObject("door", config);  
                    break;

                case 'Y' :
                      gameObjects.addObject("lavaPillar", config);
                  break;
                
                case 'z' : 
                      gameObjects.addObject("voidSupport", config);
                  break;
                  
                case '/' :
                      config.dir = 1;
                      gameObjects.addObject("tread", config);
                  break;
                  
               case '|' : 
                      config.dir = -1;
                      gameObjects.addObject("tread", config);
                  break;
            }
        }
    }
};

var hpBar = new Bar(0, 0, 75, 18, color(32, 104, 168, 100));
infoBar.draw = function()
{
    noStroke();
    fill(0, 0, 0, 50);
    rect(0, 0, width, 20);
    textSize(12.5);
    var player = gameObjects.getArray("player")[0];
    hpBar.draw(player.hp, player.maxHp);
    fill(0, 0, 0, 100);
    textAlign(LEFT, NORMAL);
    text(player.hp.toFixed(0) + "/" + floor(player.maxHp), 5, 14);
    text("Coins : " + (this.coins + player.coins), 85, 14);
    text("Score : " + (this.score + player.score), 160, 14);
    text("Level : " + levelInfo.level, 245, 14);
    textAlign(NORMAL, NORMAL);
    screenUtils.levelProgressBar.draw(player.xPos + player.width / 2, levelInfo.width - player.width / 2);
};

var fade = function()
{
    noStroke();
    fill(0, 0, 0, fader.amt * 255 / fader.max);
    rect(0, 0, width, height);
    if(fader.amt >= fader.max)
    {
        fader.vel = -fader.Vel; 
    }
    fader.amt += fader.vel;
};
var debugTools = function()
{
    if(!game.debugMode)
    {
        return;
    }
    var player = gameObjects.getArray("player")[0];
    if(mouseIsPressed && mouseButton === RIGHT)
    {
        player.xPos = mouseX * levelInfo.width / width;
        player.yPos = mouseY * levelInfo.height / height;
    }
    textAlign(NORMAL, NORMAL);
    textSize(12);
    text("player.xVel :"  + player.xVel.toFixed(1), 5, 35);
    text("player.yVel :"  + player.yVel.toFixed(1), 5, 50);
};

loader.startLevelLoading = function(config)
{
    fader.amt = 0;
    fader.vel = fader.Vel;
    game.gameState = "load";
    infoBar.hp = gameObjects.getArray("player")[0].hp;
    infoBar.maxHp = gameObjects.getArray("player")[0].maxHp;
    this.config = config;
    this.loaded = false;
    game.img = get(0, 0, width, height);
};
loader.loadLevel = function(config)
{
    gameObjects.removeObjects();
    levels.build({  
        level : config.level,
        door : config.door,
        unitWidth : levelInfo.unitWidth,
        unitHeight : levelInfo.unitHeight,
    });
    gameObjects.getArray("door").setTargetDoor();
    screenUtils.stopped = false;
    gameObjects.putInventoryIntoObjects();
    levelInfo.level = config.level;
    levelInfo.door = config.door;
    this.loaded = true;
};
loader.loadGame = function()
{
    backgrounds.load();
    game.img = get(0, 0, width, height);
    game.menu.setup();
    this.loadLevel({
        level : levelInfo.level,
        door : levelInfo.door,
    });
};

var mainLoop = function()
{
    backgrounds.draw();
    pushMatrix();
        levels[levelInfo.level].act();
        cam.view(gameObjects.getArray("player")[0]);
        gameObjects.apply();
        //gameObjects.drawBoundingBoxes();
    popMatrix();
    debugTools();
    infoBar.draw();
    particles.draw();
    particles.update();
};

game.options = function()
{
    if(this.gameState === "play" && controls.restartLevel())
    {
        loader.startLevelLoading(levelInfo); 
    }
    if(controls.pause() || game.mouseOut)
    {
        if(this.gameState === "pause")
        {
            this.gameState = "play";
        }
        else if(game.gameState === "play")
        {
            this.gameState = "pause";
            this.img = get(0, 0, width, height);
            this.pause.setup();
        }
    }
};
game.pause = function()
{
    image(this.img, 0, 0);
    fill(0, 0, 0, 50);
    rect(50, 0, width - 100, height);
    textSize(40);
    fill(11, 68, 153, 100);
    textAlign(CENTER, CENTER);
    text("Paused", 200, 100);
    buttons.draw();
    if(mouseIsPressed)
    {
        if(buttons.getButton("continue").IsMouseInside())
        {
            this.gameState = "play";
        }
        else if(buttons.getButton("restart").IsMouseInside())
        {
            this.gameState = "play";
            loader.startLevelLoading(levelInfo); 
        }
        else if(buttons.getButton("menu").IsMouseInside())
        {
            this.gameState = "menu";
            this.menu.setup();
        }
        mouseIsPressed = false;
    }
};  
game.pause.setup = function()
{
    buttons.clear();
    buttons.add({
        xPos : 150,
        yPos : 175,
        width : 110,
        height : 30,
        message : "Continue",
        name : "continue",
        color : color(11, 68, 153, 100)//color(10, 10, 10, 50)
    });
    buttons.add({
        xPos : 150,
        yPos : 215,
        width : 110,
        height : 30,
        message : "Restart",
        name : "restart",
        color : color(11, 68, 153, 100)
    });
    buttons.add({
        xPos : 150,
        yPos : 255,
        width : 110,
        height : 30,
        message : "Menu",
        name : "menu",
        color : color(11, 68, 153, 100)
    });  
};
game.menu = function()
{
    backgrounds.draw();
    fill(0, 0, 0, 50);
    rect(50, 0, width - 100, height);
    textSize(45);
    fill(11, 68, 153, 100);
    textAlign(CENTER, CENTER);
    text("Planet\nSearch", 200, 90);
    buttons.draw();
    if(mouseIsPressed)
    {
        switch(true)
        {     
            case buttons.getButton("newGame").IsMouseInside() : 
                    levelInfo.level = levelInfo.firstLevel;
                    levelInfo.door = levelInfo.firstDoor;
                    loader.startLevelLoading(levelInfo); 
                  break;
            case buttons.getButton("play").IsMouseInside() : 
                    this.gameState = "play";
                break;
            case buttons.getButton("howTo").IsMouseInside() :
                    this.gameState = "howTo";
                    this.howTo.setup();
                break;
            
            /*case buttons.getButton("levelMaker").IsMouseInside() :
                    this.gameState = "levelMaker";
                    this.levelMaker.setup();
                break;*/
        }
    }
};
game.menu.setup = function()
{
    buttons.clear();
    buttons.add({
        xPos : 150,
        yPos : 180,
        width : 110,
        height : 30,
        message : "Play",
        name : "play",
        color : color(11, 68, 153, 100),
    });
    buttons.add({
        xPos : 150,
        yPos : 220,
        width : 110,
        height : 30,
        message : "New Game",
        name : "newGame",
        color : color(11, 68, 153, 100),
    });
    buttons.add({
        xPos : 150,
        yPos : 260,
        width : 110,
        height : 30,
        message : "How To",
        name : "howTo",
        color : color(11, 68, 153, 100),
    });
    /*buttons.add({
        xPos : 150,
        yPos : 270,
        width : 110,
        height : 30,
        message : "Level Maker",
        name : "levelMaker",
        color : color(11, 68, 153, 100),
    });*/
};
game.howTo = function()
{
    backgrounds.draw();
    fill(0, 0, 0, 50);
    rect(50, 0, width - 100, height);
    textSize(15);
    fill(0, 0, 0, 100);
    textAlign(CENTER, CENTER);
    text("Use the arrow keys or \n wasd to move. " + 
    "Press down or \n the spacebar to enter doors that \n lead to other levels. Press 'p' to \n pause and 'r' to restart.", 200, 180);
    fill(0, 0, 0, 50);
    ellipse(200, 180, 250, 120);
    buttons.draw();
    if(mouseIsPressed)
    {
        if(buttons.getButton("back").IsMouseInside())
        {
            this.gameState = "menu";
            this.menu.setup();
        }
    }   
};
game.howTo.setup = function()
{
    buttons.clear();   
    buttons.add({
        xPos : 0,
        yPos : 350,
        width : 50,
        height : 50,
        message : "Back",
        name : "back",
        color : color(10, 10, 10, 50)
    });
};
game.load = function()
{
    keys[keyCode] = false;
    if(fader.amt === fader.max)
    {
        loader.loadLevel(loader.config);
        this.play();
        this.img = get(0, 0, width, height);
    }
    if(fader.amt === 1 && loader.loaded)
    {
        this.gameState = "play";
    }
    image(this.img, 0, 0);
    fade();
};
game.levelMaker = function()
{
    backgrounds.draw();
    buttons.draw();
    if(mouseIsPressed)
    {
        if(buttons.getButton("menu").IsMouseInside())
        {
            this.gameState = "menu";
            this.menu.setup();
        }   
    }
};
game.levelMaker.setup = function()
{
    buttons.clear();
    buttons.add({
        xPos : 0,
        yPos : 370,
        width : 50,
        height : 30,
        message : "Menu",
        name : "menu",
        color : color(10, 10, 10, 50)
    });
};
game.play = mainLoop;

var setup = function()
{
    frameRate(30);
    loader.loadGame(); 
    frameRate(60);
    smooth();
    loader.gameLoaded = true;
};
draw = function() 
{
    background(147, 221, 250);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("A fatal error occured", 200, 300);
    
    frameRate(game.fps);
    
    if(!loader.gameLoaded)
    {
        setup();
    }    
    
    game[game.gameState]();
};

var lastKeyPressed = keyPressed;
keyPressed = function()
{
    lastKeyPressed();
    game.options();
    if(game.gameState === "play" && game.debugMode && controls.nextLevel())
    {
        loader.startLevelLoading(gameObjects.getArray("door").targetDoor);
    }
};
  }
    if (typeof draw !== 'undefined') processing.draw = draw;
});