/*
    Authors: Juri Kiin, Nikolas Whiteside
    Date: 4/4/2017
*/

class Segment{

    constructor(options){   
        options = options || {};

        console.log("new segment!");

        //Reference to canvas
        this.ctx = options.ctx;

        //Segment at the top of the building
        this.prevSegment = options.prevSegment;

        //Set the width of the segment
        if(options.prevSegment == null){
            this.width = 100;
            this.ClipWidth = 100;
        }
        else{
             this.width = this.prevSegment.clipWidth;
             this.ClipWidth = this.prevSegment.clipWidth;
        }
        //Sprite image
        this.Image = options.image;
        this.speed = options.speed;
        this.height = 50;
        this.clipHeight = this.height;
        this.moving = true;

        //Spawn left/right/center
        if(options.spawnDirection == 0){
            this.XPos = 0;
        }else if(options.spawnDirection == 2)  {
            this.XPos = this.ctx.canvas.clientWidth - this.width;
        }else{
            this.XPos = this.ctx.canvas.clientWidth/2 - this.width/2;
        }
        this.YPos = 400;
        this.ClipX = this.xPos;
        this.ClipY = this.yPos;
        //console.log(this.xPos);
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
            if(this.xPos > this.prevSegment.clipX + this.prevSegment.clipWidth){
                return false;
            }
            if(this.prevSegment.clipX > this.xPos + this.width){
                return false;
            }

            //Clip the edges if there is any hangoff
            if(this.xPos < this.prevSegment.clipX){
                var difference = this.prevSegment.clipX - this.xPos;
                this.clipX += difference;
                this.clipWidth -= difference;
            }

            if(this.xPos + this.width > this.prevSegment.clipX + this.prevSegment.clipWidth){
                var difference = (this.prevSegment.clipX + this.prevSegment.clipWidth - (this.xPos + this.width));
                this.clipWidth -= difference;
            }
            //Otherwise, return true
            return true;
        }else{
            return true;
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
            this.Speed *= -1;
        }
        if(this.xPos + this.width >= this.ctx.canvas.clientWidth){
            this.XPos = 0;
            this.Speed *= -1;
        }

        //Update the clip position
        this.ClipX = this.XPos;
    }

    //Shifts the segment down a level
    //according to its height
    ShiftDown(){
        this.YPos += this.Height;
        this.ClipY = this.YPos;
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
        //this.ctx.drawImage(this.Image, this.ClipX, this.ClipY, this.ClipWidth, this.ClipHeight, this.XPos, this.YPos, this.Width, this.Height);
        this.ctx.drawImage(this.Image, this.XPos, this.YPos, this.Width, this.Height);
    }

}