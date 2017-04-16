/*
    Authors: Juri Kiin, Nikolas Whiteside
    Date: 4/4/2017
*/

"use-strict";

(function(){

    //Canvas variables
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");
    
    //Time variables
    var currentTime;
    var TIME_DIFFERENCE = 100;
    var fadeFill = "";
    var fadeAlpha = 0;
    var notifText;

    //Game States
    GAME_STATE = Object.freeze({
        MENU:0,
        GAME:1,
        GAMEOVER:2,
        FINISH:3,
        PAUSE:4
    });
    var gameState;
    var prevState;
    var score = 0;
    var highestScore;
    var newBest = false;
    var moveSpeed = 5;
    var firstSpawn = true;

    //Images
    var parallaxFront;
    var parallaxBack;
    var background;
    var pauseImage1;
    var pauseImage2;
    var powerImage1;
    var powerImage2;
    var clouds;

    //Buttons
    var powerButton;
    var pauseButton;

    //Shift-variable for background
    var backgroundShift;
    var cloudPosition;

    //Segment variables
    var segmentImage1;
    var segmentImage2;
    var segmentImage3;

    var currentSegment;
    var oldSegments = [];

    //Key Input variables
    var keys = {};

    //Audio Input variables
    var audioSources = [];
    var placementAudio;
    var bgAudio;
    var loseAudio;
    var highscoreAudio;

    function PlaceSegment(e){

        if(gameState == GAME_STATE.GAMEOVER){
            gameState == GAME_STATE.MENU;
        }

        else if(gameState == GAME_STATE.MENU){
            gameState = GAME_STATE.GAME;
            oldSegments.push(currentSegment);   //Add the segment to the list of old.
            notifText = '';
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
        else if(gameState == GAME_STATE.FINISH){
            //Save the highscore
            SetHighScore();
            highestScore = GetCookie("highscore=");
            gameState = GAME_STATE.GAMEOVER;
        }
        else if(gameState == GAME_STATE.GAME){
            //1) Stop the current segment and check to see if it stopped in a valid place.
            currentSegment.StopSegment();

            var tempOutput = currentSegment.CheckEdges();
            if(tempOutput > 0){
                
                placementAudio.play();

                score++;                  //Increment the score.
                moveSpeed += .2;          //Increase the speed each segment travels
                currentSegment.Clip;      //Set the width and clipping of the segment

                //Move the background with the tower
                if(backgroundShift < 800){
                    backgroundShift += 50;
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
                }

                //If the user had a perfect move, display it
                if(tempOutput == 2){
                    fadeAlpha = 0;
                    if(!newBest && score > highestScore){
                        notifText = "HIGH SCORE";
                        newBest = true;
                    }else{
                        notifText = "PERFECT";
                    }
                    FadeIn();
                }else{
                    FadeOut();
                }
            }
            else{

                loseAudio.play();
                gameState = GAME_STATE.FINISH;
            }
        }
    }


    //Initialize function
    window.onload = function()
    {
        //Load in the image files
        LoadImages();

        //Set up click/touch events
        window.addEventListener('pointerdown',PlaceSegment);
        window.addEventListener('touchstart',PlaceSegment);
        window.addEventListener('keydown',function(e){checkKey(e)});

        //Set audio variables
        placementAudio = document.querySelector('#effectAudio');
        audioSources.push(placementAudio);
        bgAudio = document.querySelector('#bgAudio');
        audioSources.push(bgAudio);
        loseAudio = document.querySelector('#loseAudio');
        audioSources.push(loseAudio);
        highscoreAudio = document.querySelector('#highscoreAudio');
        audioSources.push(highscoreAudio);
        //bgAudio.play();

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

        //Handle pausing and unpausing
        window.onblur = function(){
            prevState = gameState;
            fadeAlpha = 0;
            FadeIn();
            gameState = GAME_STATE.PAUSE;
            for(i = 0;i<audioSources.length;i++){   //Loop through and pause all of our audio.
                audioSources[i].pause();
            }
        }

        window.onfocus = function(){
            gameState = prevState;
            fadeAlpha = 0;
            fadeFill = "rgba(256,256,256," + fadeAlpha + ")";
            //bgAudio.play();
        }

        //Load high score
        highestScore = GetCookie("highscore=");
        console.log(highestScore);

        //Begin the main game loop
        Update();
    }


    function checkKey(key){
        if(key.keyCode == 32 && gameState != GAME_STATE.PAUSE)
        {
            prevState = gameState;
            gameState = GAME_STATE.PAUSE;
        }
        else
        {
            gameState = prevState;
        }
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
        clouds = new Image();
        clouds.src = "media/clouds.png";

        //Initialize the backgroundShift value
        backgroundShift = 0;
        cloudPosition = 0;
    }

    //Runs the main game loop
    function Update(){

        requestAnimationFrame(Update);

        cloudPosition += .25;

        if(cloudPosition > canvas.clientWidth + clouds.clientWidth)
        {
            cloudPosition = -300;
        }

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
            case GAME_STATE.FINISH:
                //Update the current segment
                DrawHUD();
                //Draw the segments
                if(oldSegments.length != 0){
                    for(var i = 0; i < oldSegments.length; i++){
                        oldSegments[i].Draw();
                    }
                }
                break;
            case GAME_STATE.GAMEOVER:
                DrawGameOver();
                break;
            case GAME_STATE.PAUSE:
                DrawPause();
                break;
        }
    }
    
    /* Drawing functions */

    //Draws the items for the splash screen
    function DrawMenu(){
        ctx.drawImage(background, 0, -800 + backgroundShift, 450, 1600);
        ctx.drawImage(parallaxBack, 0, 500, 450, 300);
        ctx.drawImage(parallaxFront, 0, 550,450, 300);
        //Title text
        ctx.fillStyle = '#581D99';
        ctx.font = "70px Josefin Sans";
        ctx.fillText("Tower Builder",35,100);
        //'tap to continue' text
        ctx.font = "40px Dosis";
        ctx.fillText("Tap to Play",145,500);
    }

    //Draws the interface for the pause menu
    function DrawPause(){
        ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
        ctx.font = "45pt Josefin Sans";
        ctx.fillStyle = fadeFill;
        ctx.fillText("Paused",135,300);
    }

    //Draws the interface for the game over screen
    function DrawGameOver(){  
        ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
        ctx.drawImage(background, 0, -800 + backgroundShift, 450, 1600);
        ctx.drawImage(parallaxBack, 0, 200 + backgroundShift*1.1, 450, 300);
        ctx.drawImage(parallaxFront, 0, 250 + backgroundShift*1.2,450, 300);
        //GAMEOVER
        ctx.fillStyle = '#581D99';
        ctx.font = "45pt Josefin Sans";
        ctx.fillText("Game Over",80,100);
        //Score
        ctx.font = '40pt Josefin Sans';
        ctx.fillStyle = 'white';
        ctx.fillText("Score: " + score,135,300);
        ctx.fillText("High Score: " + highestScore,75 - 5 * highestScore%10,350);
    }

    //Draw the background and HUD of the main screen
    function DrawHUD(){
        ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
        ctx.drawImage(background, 0, -800 + backgroundShift, 450, 1600);
        ctx.drawImage(parallaxBack, 0, 200 + backgroundShift*1.1, 450, 300);
        ctx.drawImage(parallaxFront, 0, 250 + backgroundShift*1.2,450, 300);
        ctx.drawImage(clouds,cloudPosition,backgroundShift * .02,300,225);
        //Draw score
        ctx.font = '50pt Josefin Sans';
        ctx.fillStyle = '#581D99';
        ctx.fillText(score,205,100);
        //Draw perfect move notification
        ctx.font = "40pt Dosis";
        ctx.fillStyle = fadeFill;
        ctx.fillText(notifText,135,300);
    }

    //Fades in text
    function FadeIn(){
        if(fadeAlpha < 1){
            fadeAlpha += 0.1;
        }
        fadeFill = "rgba(256,256,256," + fadeAlpha + ")"

        //Loop while the alpha is not 0 or 1
        if(fadeAlpha <= 1){
            requestAnimationFrame(FadeIn);
        }else{
            setTimeout(FadeOut,1500);
        }
    }

    function FadeOut(){
        if(fadeAlpha > 0){
            fadeAlpha -= 0.1;
        }
        fadeFill = "rgba(256,256,256," + fadeAlpha + ")"

        //Loop while the alpha is not 0 or 1
        if(fadeAlpha >= 0){
            requestAnimationFrame(FadeOut);
        }
    }

    //Set up high scores
    var SetHighScore = function() {
        var highScore = GetCookie("highscore=");
        //Compare the current highscore to your score
        if(highScore == "" || score > parseFloat(highScore)){
            document.cookie = "highscore=" + score + "; path=/";
            highscoreAudio.play();
        }
        else{
            document.cookie = "highscore=" + highScore + "; path=/";
        }
    }

    //Gets the value of specified name in the cookie
    function GetCookie(cookieName){
        //Split the cookie into an array of values
        var cook = document.cookie.split(';');
        //Loop through the new array
        for(i = 0; i < cook.length; i++){
            //Remove spacing
            while(cook[i].charAt(0) == ' '){
                cook[i] = cook[i].substring(1,cook[i].length);
            }
            if(cook[i].indexOf(cookieName) == 0){
                return cook[i].split("=")[1];
            }
        }
        return "";
    }

}());