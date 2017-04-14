/*
    Authors: Nikolas Whiteside, Juri Kiin
    Date: 4/13/2017
*/

class Button{

    constructor(options){
        options = options || {};

        //Reference to canvas
        this.ctx = options.ctx;

        //Variables
        this.xPos = options.xPos;
        this.yPos = options.yPos;
        this.width = 100;
        this.height = 100;
        this.imageHighlight = options.imageHighlight;
        this.imageFaded = options.imageFaded;
        this.active = options.active;
    }

    /* Getters and Setters */
    get Active(){
        return this.active;
    }

    set Active(value){
        this.active = value;
    }

    /* Functions */

    //Draws the button to the canvas
    function Draw(){
        if(this.Active){
            this.ctx.drawImage(this.imageHighlight,this.x,this.y,this.width,this.height);
        }else{
            this.ctx.drawImage(this.imageFaded,this.x,this.y,this.width,this.height);
        }
    }
}