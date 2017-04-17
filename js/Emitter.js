/* 
    Authors: Nikolas Whiteside, Juri Kiin
    Date: 4/17/2017
*/

class Emitter{

    constructor(options){
        //this.xPos = options.xPos;
        //this.yPos = options.yPos;
		this.numParticles = 50;
		this.xRange = 3;
		this.yRange = 4;
		this.minXspeed = -3;
		this.maxXspeed = 3;
		this.minYspeed = 1;
		this.maxYspeed = 4;
		this.startRadius = 2;
		this.expansionRate = 0.05;
		this.decayRate = 2;
		this.lifetime = 550;
        this.red = options.red;
        this.green = options.green;
        this.blue = options.blue;
    }

    CreateParticles(emitterPoint){
        // initialize particle array
		this.particles = [];
				
		// create exhaust particles
		for(var i=0; i< this.numParticles; i++){
			// create a particle object and add to array
			var p = {};
			this.particles.push(this.InitParticle(this, p, emitterPoint));
		}
    }

    InitParticle(object, p, emitterPoint){
        // give it a random age when first created
		p.age = getRandom(0,object.lifetime);
				
		p.x = emitterPoint.x + getRandom(-object.xRange, object.xRange);
		p.y = emitterPoint.y + getRandom(0, object.yRange);
		p.r = getRandom(object.startRadius/2, object.startRadius); // radius
        p.red = this.red;
        p.green = this.green;
        p.blue = this.blue;
		p.xSpeed = getRandom(object.minXspeed, object.maxXspeed);
		p.ySpeed = getRandom(object.minYspeed, object.maxYspeed);
		return p;
    }

    UpdateAndDraw(ctx, emitterPoint){
        /* move and draw particles */
        // each frame, loop through particles array
        // move each particle down screen, and slightly left or right
        // make it bigger, and fade it out
        // increase its age so we know when to recycle it
        
        for(var i=0;i<this.particles.length;i++){
            var p = this.particles[i];

            p.age += this.decayRate;
            p.r += this.expansionRate;
            p.x += p.xSpeed
            p.y += p.ySpeed
            var alpha = 1 - p.age/this.lifetime;
            var color = "rgba(" + p.red + "," + p.green + "," + 			
            p.blue + "," + 1 + ")"; 
            ctx.fillStyle = color;
            ctx.fillRect(p.x, p.y, p.r, p.r);
                        
            // if the particle is too old, recycle it
            if(p.age >= this.lifetime){
                this.InitParticle(this, p, emitterPoint);
            }		
        }
    }

}