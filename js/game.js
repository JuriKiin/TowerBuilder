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

    var playButton = document.getElementById('PlayButton');

    //Segment variables
    var segmentImage1;
    var segmentImage2;
    var segmentImage3;

    var currentSegment;
    var oldSegments = [];


    window.addEventListener('keydown',function(e){

        if(gameState == GAME_STATE.GAME){
            if(e.keyCode == 32){     //Space was pressed
                
                //Two things need to happen.

                //1) Stop the current segment and check to see if it stopped in a valid place.
                currentSegment.speed = 0;

                if(currentSegment.CheckEdges){
                    
                    score++;                  //Incrememnt the score.
                    moveSpeed += .5;          //Increase the speed each segment travels
                    currentSegment.Clip;      //Set the width and clipping of the segment

                    oldSegments.push(currentSegment);   //Add the segment to the list of old.
                    currentSegment = new Segment({prevSegment: currentSegment,url: 'url',ctx:ctx,speed:moveSpeed}); //Create the new segment
                    currentSegment.Draw();  //Draw the new segment.

                }
                else{
                    gameState = GAME_STATE.GAMEOVER;
                }
            }
        }
    });


    //Initialize function
    window.onload = function()
    {
        //Draw base.

        gameState = GAME_STATE.GAME;    //Set default game state to menu.
        Update();
    }

    //Runs the main game loop
    function Update(){

        requestAnimationFrame(Update);

        switch(gameState){
            case GAME_STATE.MENU:
                //DrawMenu(ctx);
                break;
            case GAME_STATE.GAME:
               // DrawHUD(ctx,score);

               if(firstSpawn == true){  //If this is our first spawned segment.
                   //Create the first segment
                   console.log("Looping?");
                   currentSegment = new Segment({prevSegment: null, url: 'url', ctx:ctx, speed:moveSpeed}); //Create segment
                   firstSpawn = false;  //Set this to false so it doesn't run again. (BROKEN??)
               }

               currentSegment.Update();

                break;
            case GAME_STATE.GAMEOVER:
                //DrawGameOver(ctx,score);
                break;
        }
    }
    









}());