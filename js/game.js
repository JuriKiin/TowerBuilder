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
        MENU,
        GAME,
        GAMEOVER
    });
    var gameState;

    var playButton = document.getElementById('PlayButton');

    //Segment variables
    var segmentImage1;
    var segmentImage2;
    var segmentImage3;

    var oldSegments = [];

    //Initialize function
    window.onload = function()
    {
        gameState = GAME_STATE.MENU;
    }

    //Runs the main game loop
    function Update(){
        switch(gameState){
            case MENU:
                break;
            case GAME:
                break;
            case GAMEOVER:
                break;
        }
    }
    









}());