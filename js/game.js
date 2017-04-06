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
    var moveSpeed = 1;
    var firstSpawn = true;

    //Images
    var parallaxFront;
    var parallaxBack;

    //Irrelevant
    //var playButton = document.getElementById('PlayButton');

    //Segment variables
    var segmentImage1;
    var segmentImage2;
    var segmentImage3;

    var currentSegment;
    var oldSegments = [];


    window.addEventListener('mousedown',function(e){

        if(gameState == GAME_STATE.MENU){
            gameState = GAME_STATE.GAME;
            currentSegment.Draw();
        }
        else if(gameState == GAME_STATE.GAME){
            //1) Stop the current segment and check to see if it stopped in a valid place.
            currentSegment.StopSegment();
            if(currentSegment.CheckEdges()){
                
                score++;                  //Increment the score.
                moveSpeed += .5;          //Increase the speed each segment travels
                currentSegment.Clip;      //Set the width and clipping of the segment

                oldSegments.push(currentSegment);   //Add the segment to the list of old.

                var tempSegment = currentSegment;
                currentSegment = new Segment({
                    prevSegment: tempSegment,
                    ctx: ctx,
                    image: segmentImage1,
                    speed: moveSpeed,
                    spawnDirection: Math.random()
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
        parallaxBack = new Image();
        parallaxBack.src = "media/skyline2.png";
        parallaxFront = new Image();
        parallaxFront.src = "media/skyline1.png";
        segmentImage1 = new Image();
        segmentImage1.src = "media/segment1.png";

        gameState = GAME_STATE.MENU;    //Set default game state to menu.

        //Create the first segment
        currentSegment = new Segment({
            prevSegment: null,
            ctx: ctx,
            image: segmentImage1,
            speed: 10,
            spawnDirection: 0,
            moving: true
        });

        //Begin the main game loop
        Update();
    }

    //Runs the main game loop
    function Update(){

        requestAnimationFrame(Update);

        switch(gameState){
            case GAME_STATE.MENU:
                DrawMenu();
                break;
            case GAME_STATE.GAME:
                //Clear();
                //Update the current segment
                ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
                ctx.drawImage(parallaxBack, 0, -25, 1200, 800);
                ctx.drawImage(parallaxFront, 0, 0,1200, 800);
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

    function DrawMenu()  //Draw the items that will be displayed as the menu.
    {
       // console.log("draw");
        ctx.drawImage(parallaxBack, 0, -25, 1200, 800);
        ctx.drawImage(parallaxFront, 0, 0,1200, 800);
        ctx.fillStyle = 'red';
        ctx.font = "100pt Arial";
        ctx.fillText("Tower Builder",0,100);
    }

    function DrawGameOver()  //Draw the items we want to display when the game is over.
    {
        ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
    }

    function DrawHUD()
    {
        ctx.font = '50pt Arial';
        ctx.fillText("Score: 999",0,100);
    }





}());