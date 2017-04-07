/*
    Authors: Juri Kiin, Nikolas Whiteside
    Date: 4/4/2017
*/

"use-strict";

(function(){

    //Canvas variables
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");

    //Game States
    GAME_STATE = Object.freeze({
        MENU:0,
        GAME:1,
        GAMEOVER:2
    });
    var gameState;
    var score = 0;
    var moveSpeed = 5;
    var firstSpawn = true;

    //Images
    var parallaxFront;
    var parallaxBack;
    var background;

    //Shift-variable for background
    var backgroundShift;

    //Segment variables
    var segmentImage1;
    var segmentImage2;
    var segmentImage3;

    var currentSegment;
    var oldSegments = [];


    window.addEventListener('mousedown',function(e){

        if(gameState == GAME_STATE.MENU){
            gameState = GAME_STATE.GAME;
            oldSegments.push(currentSegment);   //Add the segment to the list of old.

            var tempSegment = currentSegment;
            currentSegment = new Segment({
                prevSegment: tempSegment,
                ctx: ctx,
                image: segmentImage1,
                speed: moveSpeed,
                spawnDirection:  0//Math.random()
            });
            //Shift the old segments down
            for(var i = 0; i < oldSegments.length; i++){
                oldSegments[i].ShiftDown();
            }
            currentSegment.Draw();
        }
        else if(gameState == GAME_STATE.GAME){
            //1) Stop the current segment and check to see if it stopped in a valid place.


            currentSegment.StopSegment();
            if(currentSegment.CheckEdges()){
                
                score++;                  //Increment the score.
                moveSpeed += .2;          //Increase the speed each segment travels

                //Move the background with the tower
                if(backgroundShift < 800){
                    backgroundShift += 10;
                }

                oldSegments.push(currentSegment);   //Add the segment to the list of old.

                if(Math.random() < 0.5){
                    var tempDir = 0;
                }else{
                    tempDir = 1;
                }

                var tempSegment = currentSegment;
                currentSegment = new Segment({
                    prevSegment: tempSegment,
                    ctx: ctx,
                    image: segmentImage1,
                    speed: moveSpeed,
                    spawnDirection: tempDir
                });

                //Shift the old segments down
                for(var i = 0; i < oldSegments.length; i++){
                    oldSegments[i].ShiftDown();
                    console.log(oldSegments[i].YPos);
                }
            }
            else{
                gameState = GAME_STATE.GAMEOVER;
            }
        }
    });


    //Initialize function
    window.onload = function()
    {
        //Load in the image files
        LoadImages();

        gameState = GAME_STATE.MENU;    //Set default game state to menu.

        //Create the first segment
        currentSegment = new Segment({
            prevSegment: null,
            ctx: ctx,
            image: segmentImage1,
            speed: 0,
            spawnDirection: 2,
            moving: true
        });

        //Begin the main game loop
        Update();
    }

    //Loads images from the media folder
    function LoadImages(){
        //Load all image files
        background = new Image();
        background.src = "media/background.png";
        parallaxBack = new Image();
        parallaxBack.src = "media/skyline2.png";
        parallaxFront = new Image();
        parallaxFront.src = "media/skyline1.png";
        segmentImage1 = new Image();
        segmentImage1.src = "media/segment1.png";

        //Initialize the backgroundShift value
        backgroundShift = 0;
    }

    //Runs the main game loop
    function Update(){

        requestAnimationFrame(Update);

        switch(gameState){
            case GAME_STATE.MENU:
                DrawMenu();
                break;
            case GAME_STATE.GAME:
                //Update the current segment
                DrawHUD();
            //Draw the segments
                if(oldSegments.length != 0){
                    for(var i = 0; i < oldSegments.length; i++){
                        oldSegments[i].Draw();
                    }
                }
                currentSegment.Update();    //Update the currentSegment
                currentSegment.Draw();      //Draw the currentSegment
                break;
            case GAME_STATE.GAMEOVER:
                DrawGameOver();
                break;
        }
    }
    
    /* Drawing functions */

    function DrawMenu(){  //Draw the items that will be displayed as the menu.
       // console.log("draw");
        ctx.drawImage(parallaxBack, 0, 500, 450, 300);
        ctx.drawImage(parallaxFront, 0, 550,450, 300);
        ctx.fillStyle = 'red';
        ctx.font = "45pt Arial";
        ctx.fillText("Tower Builder",35,100);
    }

    function DrawGameOver(){  //Draw the items we want to display when the game is over.
        ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
        ctx.font = "45pt Arial";
        ctx.fillText("Game Over!",35,100);
    }

    function DrawHUD(){
        ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
        ctx.drawImage(background, 0, -800 + backgroundShift, 450, 1600);
        ctx.drawImage(parallaxBack, 0, 200 + backgroundShift*1.1, 450, 300);
        ctx.drawImage(parallaxFront, 0, 250 + backgroundShift*1.2,450, 300);
        ctx.font = '50pt Arial';
        ctx.fillText("Score: " + score,0,100);
    }





}());