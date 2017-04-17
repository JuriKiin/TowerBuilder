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

        //Set the width of the segment
        if(options.prevSegment == null){
            this.width = 100;
            this.ClipX = 0;
            this.ClipWidth = 600;
            this.speed = 0;
        }
        else{
             this.width = this.prevSegment.width;
             this.ClipX = this.prevSegment.ClipX - this.prevSegment.difference/2;
             this.ClipWidth = this.prevSegment.ClipWidth - this.prevSegment.difference/2;
             this.speed = options.speed;
        }
        //Sprite image
        this.Image = options.image;
        this.height = 50;
        this.clipHeight = 200;
        this.moving = true;
        this.difference = 0;

        //Spawn left/right/center
        if(options.spawnDirection == 0){
            this.XPos = 0;
        }else if(options.spawnDirection == 1)  {
            this.XPos = this.ctx.canvas.clientWidth - this.width - 1;
        }else{
            this.XPos = this.ctx.canvas.clientWidth/2 - this.width/2;
        }
        this.YPos = 400;
        this.ClipY = 0;
    }

    /* Getters and Setters */

    get ClipX(){
        return this.clipX;    
    }

    get Width(){
        return this.width;
    }

    get Height(){
        return this.height;
    }

    get Image(){
        return this.src;
    }

    set Image(value){
        this.src = value;
    }

    set ClipX(value){
        this.clipX = value;
    }

    get ClipWidth(){
        return this.clipWidth;
    }

    set ClipWidth(value){
        this.clipWidth = value;
    }

    get XPos(){
        return this.xPos;
    }

    set XPos(value){
        this.xPos = value;
    }

    get YPos(){
        return this.yPos;
    }
    
    set YPos(value){
        this.yPos = value;
    }

    /* Methods */

    //Checks the edges of this Segment
    //with the previous segment
    CheckEdges(){
        if(this.prevSegment != null){
            //Return false if this segment and the previous segment do not line up
            if(this.xPos > this.prevSegment.xPos + this.prevSegment.width){
                return 0;
            }
            if(this.prevSegment.xPos > this.xPos + this.width){
                return 0;
            }

            //Clip the edges if there is any hangoff
            if(this.xPos < this.prevSegment.xPos){
                this.difference = this.prevSegment.xPos - this.xPos;
                this.clipX += this.difference * 6;
                this.xPos += this.difference;
                this.clipWidth -= this.difference * 6;
                this.width -= this.difference;
                if(this.difference < 10){
                    return 2;
                }else{
                    return 1;
                }
            }

            if(this.xPos + this.width > this.prevSegment.xPos + this.prevSegment.width){
                this.difference = ((this.xPos + this.width) - (this.prevSegment.xPos + this.prevSegment.width));
                this.clipWidth -= this.difference * 6;
                this.width -= this.difference;
                if(this.difference < 10){
                    return 2;
                }else{
                    return 1;
                }
            }
            //Otherwise, return true if they made a perfect move
            return 2;
        }else{
            return 1;
        }
    }

    //Moves the segment back
    //and forth
    MoveSegment(){
        //Move at the given speed
        this.XPos += this.speed;

        //Bounce off the two sides
        if(this.xPos <= 0){
            this.XPos = 0;
            this.speed *= -1;
        }
        if(this.xPos + this.width >= this.ctx.canvas.width){
            this.speed *= -1;
        }

        //Update the clip position
        this.ClipX = 0;
    }

    //Shifts the segment down a level
    //according to its height
    ShiftDown(){
        this.YPos += this.Height;

        //console.log("clipX: " + this.ClipX);
        //console.log("X: " + this.XPos);
        //console.log("clipY: " + this.ClipY);
        //console.log("Y: " + this.YPos);
        //console.log("Clip Width: " + this.clipWidth);
        //console.log("Width: " + this.Width);
        //console.log("Clip Height: " + this.clipHeight);
        //console.log("Height: " + this.Height);
    }

    //Stops the segment
    StopSegment(){
        this.speed = 0;
        this.moving = false;
    }

    //Moves the block and
    //checks for user input
    //to add it to the top
    Update(){
        if(this.moving){
            this.MoveSegment();
        }else{
            if(this.prevSegment != null){
                this.CheckEdges();
            }
        }
    }

    //Draws the segment on the canvas
    Draw(){
        this.ctx.drawImage(this.Image, this.ClipX, this.ClipY, this.ClipWidth, this.clipHeight, this.XPos, this.YPos, this.Width, this.Height);
    }

}