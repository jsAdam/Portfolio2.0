let creatures = [];
let creatureGroupTargets = [];
let creatureGroupTargetChangeTimes = [];

function setup() {
    let myCanvas = createCanvas(1400, 750);
    myCanvas.id("myCanvas");
    myCanvas.parent("welcome");
    
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 20; j++) {
            creatures.push(new Creature(random(0, width), random(0, height), i));
        }
        
        creatureGroupTargets.push(createVector(random(0, width), random(0, height)));
        creatureGroupTargetChangeTimes.push({ 
            start: millis(), 
            duration: random(1500, 3500)
        });
    }
    
    for(let i = 0; i < 100; i++) {
        creatures.push(new Creature(random(0, width), random(0, height)));
    }
}

function draw() {
    background(50);
    
    let mouse = createVector(mouseX, mouseY);
    
    for(let i = 0; i < creatureGroupTargetChangeTimes.length; i++) {
        let creatureGroupTime = creatureGroupTargetChangeTimes[i];
        
        if(millis() > creatureGroupTime.start + creatureGroupTime.duration) {
            creatureGroupTargets[i] = createVector(random(0, width), random(0, height));
            creatureGroupTime.start = millis();
            creatureGroupTime.duration = random(1500, 3500);
        }
    }
    
    for(let creature of creatures) {
        if(creature.group != null) {
            creature.seek(creatureGroupTargets[creature.group]);
        } else {
            creature.seek(mouse);
        }
        //creature.connect(creatures);
        creature.spread(creatures);
        creature.update();
        //creature.show();
    }
}

class Creature {
    constructor(x, y, group) {
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        
        this.group = group || null;
        
        this.maxSpeed = 5;
        this.maxForce = 0.1;
        
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
        
        // Draw lines for closest creatures
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