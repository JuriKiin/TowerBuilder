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
    var touched = false;

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
    var powerImage;
    var p
    var clouds;
    var bird;

    //Emitter
    var confetti;

    //Buttons
    var powerButton;
    var pauseButton;

    //Shift-variable for background
    var backgroundShift;
    var cloudPosition;
    var backgroundStart = 800;
    var p1Start = 500;
    var p2Start = 550;

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

    //Bird Animation variables
    var birdClipX;
    var birdClipY;
    var birdClipWidth;
    var birdClipHeight;
    var birdXPos = 0;
    var birdYPos;
    var birdWidth;
    var birdHeight;
    var birdSpeed = .25;
    var currentFrame = 0;
    var animSpeed = 10;
    var animID;

    //DeltaTime vars
    var deltaTime;
    var lastFrame = 0;
    var thisFrame;
    var cloudSpeed = .05;

    //Powerups
    var powerupCount = 0;
    var powerUp = false;
    var powerImages = [];

    function PlaceSegment(e){

        if(gameState == GAME_STATE.GAMEOVER){
            //Save the highscore
            SetHighScore();
            highestScore = GetCookie("highscore=");
            oldSegments = [];
            score = 0;
            moveSpeed = 5;
            gameState = GAME_STATE.MENU;
        }

        else if(gameState == GAME_STATE.MENU){
            gameState = GAME_STATE.GAME;
            backgroundShift = 0;
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
        else if(gameState == GAME_STATE.GAME){
            //1) Stop the current segment and check to see if it stopped in a valid place.

            if(powerupCount > 2){
                //Engage powerup.
                powerUp = true;
                powerupCount = -1;
                //Make the width of the next segment full again.
            }


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

                if(!powerUp){
                    var tempSegment = currentSegment;

                    currentSegment = new Segment({
                    prevSegment: tempSegment,
                    ctx: ctx,
                    image: segmentImage1,
                    speed: moveSpeed,
                    spawnDirection: tempDir
                    });
                }
                else{
                    currentSegment = new Segment({
                        prevSegment: null,
                        ctx: ctx,
                        image: segmentImage1,
                        speed: moveSpeed,
                        spawnDirection: tempDir,
                    });
                    currentSegment.speed = moveSpeed;
                    powerUp = false;
                }


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
                        powerupCount++;
                    }else{
                        notifText = "PERFECT";
                        powerupCount++;
                    }
                    FadeIn();
                }else{
                    powerupCount = 0;
                    FadeOut();
                }
                touched = true;
            }
            else{
                //Change this with a different sound
                loseAudio.play();
                gameState = GAME_STATE.GAMEOVER;
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

        //Initialize the particle system
        confetti = new Emitter({
            red: 150,
            green: 0,
            blue: 0
        });
        confetti.CreateParticles({x:50,y:50});
        confetti.CreateParticles({x:50,y:50});

        //Set audio variables
        placementAudio = document.querySelector('#effectAudio');
        audioSources.push(placementAudio);
        bgAudio = document.querySelector('#bgAudio');
        audioSources.push(bgAudio);
        loseAudio = document.querySelector('#loseAudio');
        audioSources.push(loseAudio);
        highscoreAudio = document.querySelector('#highscoreAudio');
        audioSources.push(highscoreAudio);
        bgAudio.play();

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
            bgAudio.play();
            animID = requestAnimationFrame(Update.bind(this));
        }

        //Load high score
        highestScore = GetCookie("highscore=");

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
            animID = requestAnimationFrame(Update.bind(this));
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
        bird = new Image();
        bird.src = "media/bird.png";

        powerImage = new Image();
        powerImage.src = "media/powerEmpty.png";

        //Initialize the backgroundShift value
        backgroundShift = 0;
        cloudPosition = 0;
    }

    //Runs the main game loop
    function Update(){

        switch(powerupCount)
        {
            case 0: powerImage.src = "media/powerEmpty.png";
            break;
            case 1: powerImage.src = "media/power1.png";
            break;
            case 2: powerImage.src = "media/power2.png";
            break;
            case 3: powerImage.src = "media/powerFull.png";
            break;
        }


        animID = requestAnimationFrame(Update.bind(this));

        //Handle deltaTime calculations here.
        thisFrame = Date.now();
        deltaTime = thisFrame - lastFrame;
        lastFrame = thisFrame;
        //console.log(deltaTime);   //log deltaTime.

        cloudPosition -= deltaTime * cloudSpeed;

        if(cloudPosition < (-clouds.clientWidth - 500))
        {
            cloudPosition = canvas.clientWidth + clouds.clientWidth + 50;
        }

        switch(gameState){
            case GAME_STATE.MENU:
                DrawMenu();
                break;
            case GAME_STATE.GAME:
                //Update the current segment
                animSpeed++;
                if(animSpeed % 7 == 0)
                {
                    currentFrame++;
                    if(currentFrame > 13)
                    {
                        currentFrame = 0;
                    }
                }
                birdXPos += (deltaTime * birdSpeed);
                if(birdXPos > canvas.clientWidth*2)
                {
                    birdXPos = 0-200;
                }
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
                cancelAnimationFrame(animID);
                DrawPause();
                break;
        }
    }
    
    /* Drawing functions */

    //Draws the items for the splash screen
    function DrawMenu(){
        ctx.drawImage(background, 0, -backgroundStart + backgroundShift, 450, 1600);
        ctx.drawImage(clouds, cloudPosition, 150,450, 300);
        ctx.drawImage(parallaxBack, 0, p1Start, 450, 300);
        ctx.drawImage(parallaxFront, 0, p2Start,450, 300);
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
        //Background images
        ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
        ctx.drawImage(background, 0, -backgroundStart, 450, 1600);
        ctx.drawImage(clouds, cloudPosition, 150,450, 300);
        ctx.drawImage(parallaxBack, 0, 500, 450, 300);
        ctx.drawImage(parallaxFront, 0, 500,450, 300);
        //GAMEOVER
        if(score > highestScore){
            //Confetti Effect
            confetti.UpdateAndDraw(ctx,{x:100,y:-50});
            confetti.UpdateAndDraw(ctx,{x:200,y:-50});
            confetti.UpdateAndDraw(ctx,{x:300,y:-50});
            //Change confetti colors
            if(confetti.red < 255){
                confetti.red += 10;
            }else{
                confetti.red = 0;
            }
            if(confetti.green < 255){
                confetti.green += 10;
            }else{
                confetti.green = 0;
            }
            if(confetti.blue < 255){
                confetti.blue += 10;
            }else{
                confetti.blue = 0;
            }
            ctx.fillStyle = '#581D99';
            ctx.font = "45pt Josefin Sans";
            ctx.fillText("Good job!",95,100);
        }else{
            ctx.fillStyle = '#581D99';
            ctx.font = "45pt Josefin Sans";
            ctx.fillText("Game Over",80,100);
        }
        //Score
        ctx.font = '40pt Josefin Sans';
        ctx.fillStyle = '#FA4B55';
        ctx.fillText("Score: " + score,135,300);
        ctx.fillText("High Score: " + highestScore,75 - 5 * highestScore%10,350);
        ctx.font = "40px Dosis";
        ctx.fillStyle = '#581D99';
        ctx.fillText("Tap to Return to the Menu",30,500);
    }

    //Draw the background and HUD of the main screen
    function DrawHUD(){
        ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
        ctx.drawImage(background, 0, -800 + backgroundShift, 450, 1600);
        ctx.drawImage(parallaxBack, 0, p1Start + backgroundShift*1.1, 450, 300);
        ctx.drawImage(parallaxFront, 0, p2Start + backgroundShift*1.2,450, 300);
        ctx.drawImage(clouds, cloudPosition, 150,450, 300);
        ctx.drawImage(powerImage,10,10,100,100);
        ctx.drawImage(bird, 360*currentFrame, 0, 350,350, birdXPos, 150, 75,75);
        
        //Draw score
        ctx.font = '50pt Josefin Sans';
        ctx.fillStyle = '#581D99';
        ctx.fillText(score,205,100);
        //Draw perfect move notification
        ctx.font = "40pt Dosis";
        ctx.fillStyle = fadeFill;
        ctx.fillText(notifText,135,300);
        if(!touched){
            ctx.font = "20pt Dosis";
            ctx.fillText("Tap Anywhere to Stack the Block",60,300);
        }
    }

    //Fades in text
    function FadeIn(){
        if(fadeAlpha < 1){
            fadeAlpha += 0.1;
        }
        //fadeFill = "rgba(256,256,256," + fadeAlpha + ")";
        fadeFill = 'rgba(250,75,85,'+fadeAlpha+')';

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
        fadeFill = 'rgba(250,75,85,'+fadeAlpha+')';

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
            loseAudio.play();
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