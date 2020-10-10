let creatures = [];
let creaturesSeekPoint;
let creaturesSeekPointChangeTime = [];

function setup() {
    let myCanvas = createCanvas($(window).width(), $(window).height());
    myCanvas.id("myCanvas");
    myCanvas.parent("welcome");
    
    for(let i = 0; i < 150; i++) {
        creatures.push(new Creature(random(0, width), random(0, height)));
    }
    
    creaturesSeekPoint = createVector(random(0, width), random(0, height));
    creaturesSeekPointChangeTime = {
        start: millis(),
        duration: random(2000, 4000)
    };
}


function windowResized() {
  resizeCanvas($(window).width(), $(window).height());
}

function draw() {
    background(50);
    
    let mouse = createVector(mouseX, mouseY);
    let mouseOutOfCanvas = false;
    
//    if(!(mouse.x > 0 && mouse.x < width && mouse.y > 0 && mouse.y < height)) {
//        if(millis() > creaturesSeekPointChangeTime.start + creaturesSeekPointChangeTime.duration) {
//            creaturesSeekPoint = createVector(random(0, width), random(0, height));
//            creaturesSeekPointChangeTime.start = millis();
//            creaturesSeekPointChangeTime.duration = random(1000, 2000);
//        }
//        mouseOutOfCanvas = true;
//    }
    if(millis() > creaturesSeekPointChangeTime.start + creaturesSeekPointChangeTime.duration) {
            creaturesSeekPoint = createVector(random(0, width), random(0, height));
            creaturesSeekPointChangeTime.start = millis();
            creaturesSeekPointChangeTime.duration = random(1000, 2000);
        }
        mouseOutOfCanvas = true;
    
    for(let creature of creatures) {
        if(!mouseOutOfCanvas) {
            creature.seek(mouse);
        } else {
            creature.seek(creaturesSeekPoint);
        }
        creature.connect(creatures);
        creature.spread(creatures);
        creature.update();
        //creature.show();
    }
}

class Creature {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        
        this.maxSpeed = random(5, 6);
        this.maxForce = random(0.09, 0.11);
        
        this.spreadForce = 0.1;
        this.spreadDist = 40;
    }
    
    applyForce(f) {
        this.acc.add(f);
    }
    
    seek(target) {
        let desired = p5.Vector.sub(target, this.pos);
        let dist = desired.mag();
        desired.normalize();
        
        if(dist < 50) {
            let m = map(dist, 0, 50, 0, this.maxSpeed);
            desired.mult(m);
        } else {
            desired.mult(this.maxSpeed);
        }
        
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        
        this.applyForce(steer);
    }
    
    connect(creatures) {
        let min = 10000;
        let closest = -1;
        let secondClosest = -1;
        
        for(let i = 0; i < creatures.length; i++) {
            let creature = creatures[i];
            
            if(creature != this) {
                let dist = p5.Vector.sub(creature.pos, this.pos).mag();

                if(dist < 60 && dist < min) {
                    min = dist;
                    secondClosest = closest;
                    closest = i;
                }
            }
        }
        
        let mouse = createVector(mouseX, mouseY);
        let dist = p5.Vector.sub(this.pos, mouse).mag();
        let col = mag(dist, 0, 200, 0, 255);
        
        stroke(col);
        if(closest != -1) {
            line(this.pos.x, this.pos.y, creatures[closest].pos.x, creatures[closest].pos.y);
        }
        if(secondClosest != -1) {
            line(this.pos.x, this.pos.y, creatures[secondClosest].pos.x, creatures[secondClosest].pos.y);
        }
    }
    
    spread(creatures) {
        let force = createVector(0, 0);
        
        let min = 10000;
        let closest = -1;
        let secondClosest = -1;
        
        for(let i = 0; i < creatures.length; i++) {
            let creature = creatures[i];
            
            if(creature != this) {
                let dir = p5.Vector.sub(this.pos, creature.pos);
                let dist = p5.Vector.sub(creature.pos, this.pos).mag();
                // Add to spread force
                if(dir.mag() < this.spreadDist) {
                    dir.normalize();
                    dir.mult(this.spreadForce);
                    force.add(dir);
                }
                
                // Get closest and second closest
                if(dist < 60 && dist < min) {
                    min = dist;
                    secondClosest = closest;
                    closest = i;
                }
            }
        }
        // Apply spread force
        this.applyForce(force);
        
        // Draw lines for closest 
        let mouse = createVector(mouseX, mouseY);
        let dist = p5.Vector.sub(this.pos, mouse).mag();
        let col = mag(dist, 0, 200, 0, 255);
        
        stroke(col);
        if(closest != -1) {
            line(this.pos.x, this.pos.y, creatures[closest].pos.x, creatures[closest].pos.y);
        }
        if(secondClosest != -1) {
            line(this.pos.x, this.pos.y, creatures[secondClosest].pos.x, creatures[secondClosest].pos.y);
        }
    }
    
    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
    
    show() {
        fill(255);
        stroke(0);
        ellipse(this.pos.x, this.pos.y, 7);
    }
}