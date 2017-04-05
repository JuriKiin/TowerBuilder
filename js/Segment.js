/*
    Authors: Juri Kiin, Nikolas Whiteside
    Date: 4/4/2017
*/

class Segment{

    constructor(options){   
        options = options || {};

        //Reference to canvas
        this.ctx = options.ctx;

        //Segment at the top of the building
        this.prevSegment = options.prevSegment;

        //Default values if prevSegment = null (first segment of the game)
        if(options.prevSegment == null){
            this.width = 100;   //Default value?
        }
        else{
             this.width = this.prevSegment.clipWidth;
        }
        //Sprite image
        this.src = options.url;
        this.speed = options.speed;
        this.height = 50;
        this.clipWidth = this.width;
        this.clipHeight = this.height;
        this.moving = true;

        if(spawnDirction == 0)  //Spawn left side
        {
            this.xPos = 0;
        }
        else    //Spawn right side
        {
            this.xPos = this.ctx.canvas.clientWidth - this.width;
        }
        this.yPos = this.ctx.canvas.clientHeight/2;
        this.clipX = this.xPos;
        this.clipY = this.yPos;
    }

    /* Getters and Setters */

    get clipX(){
        return clipX;    
    }

    set clipX(value){
        this.clipX = value;
    }

    get clipWidth(){
        return clipWidth;
    }

    set clipWidth(value){
        this.clipWidth = value;
    }

    get xPos(){
        return xPos;
    }

    set xPos(value){
        this.xPos = value;
    }

    get yPos(){
        return yPos;
    }
    
    set yPos(value){
        this.yPos = value;
    }

    /* Methods */

    //Checks the edges of this Segment
    //with the previous segment
    CheckEdges(){
        //Return false if this segment and the previous segment do not line up
        if(this.xPos > prevSegment.clipX() + prevSegment.clipWidth()){
            return false;
        }
        if(prevSegment.clipX() > this.xPos + this.width){
            return false;
        }

        //Clip the edges if there is any hangoff
        if(this.xPos < prevSegment.clipX()){
            var difference = prevSegment.clipX() - this.xPos;
            this.clipX += difference;
            this.clipWidth -= difference;
        }

        if(this.xPos + this.width > prevSegment.clipX() + prevSegment.clipWidth()){
            var difference = (prevSegment.clipX() + prevSegment.clipWidth()) - (this.xPos + this.width);
            this.clipWidth -= difference;
        }

        //Otherwise, return true
        return true;
    }

    //Moves the segment back
    //and forth
    MoveSegment(){
        //Move at the given speed
        this.xPos += this.speed;

        //Bounce off the two sides
        if(this.xPos <= 0){
            this.xPos = 0;
            this.speed *= -1;
        }
        if(this.xPos + this.width >= ctx.canvas.clientWidth){
            this.xPos = this.ctx.canvas.clientWidth - this.xPos;
            this.speed *= -1;
        }

        //Update the clip position
        this.clipX = this.xPos;
    }

    //Shifts the segment down a level
    //according to its height
    ShiftDown(){
        this.yPos -= this.height;
        this.clipY = this.yPos;
    }

    //Moves the block and
    //checks for user input
    //to add it to the top
    Update(){
        if(this.moving){
            MoveSegment();
        }else{
            CheckEdges();
        }
    }

    //Draws the segment
    //on the canvas
    Draw(){
        ctx.drawImage(src, this.clipX, this.clipY, this.clipWidth, this.Height, this.xPos, this.yPos, this.width, this.height);
    }

}