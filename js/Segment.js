class Segment
{
    constructor(options)
    {   
        options = options || {};

        this.src = 'url';
        this.speed = 1.0;
        //this.xPos = 0;
        this.yPos = 0;
        this.width = 100;
        this.height = 50;
        this.clipX = 0;
        this.clipY = 0;
        this.clipWidth = 0;
        this.clipHeight = 0;

        if(spawnDirction == 0)  //Spawn left side
        {
            this.xPos = 0;
        }
        else    //Spawn right side
        {
            this.xPos = window.innerWidth;
        }
    }

    /*
    clip position and width
    */

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





}