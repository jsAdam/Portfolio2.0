class Creature {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        
        this.maxSpeed = random(5, 6);
        this.maxForce = random(0.09, 0.11);
        
        this.spreadForceSpeed = 0.1;
        this.spreadDist = 40;
    }
    
    applyForce(f) {
        this.acc.add(f);
    }
    
    seek(target) {
        let desiredDirection = p5.Vector.sub(target, this.pos);
        let distanceToTarget = desiredDirection.mag();
        desiredDirection.normalize();
        
        if(distanceToTarget < 50) {
            let mappedSpeed = map(distanceToTarget, 0, 50, 0, this.maxSpeed);
            desiredDirection.mult(mappedSpeed);
        } else {
            desiredDirection.mult(this.maxSpeed);
        }
        
        let steeringForce = p5.Vector.sub(desiredDirection, this.vel);
        steeringForce.limit(this.maxForce);
        
        this.applyForce(steeringForce);
    }
    
    spreadAndDrawLines(creatures) {
        let spreadForce = createVector(0, 0);
        
        let currentClosestDistance = 10000;
        let closestCreature = -1;
        let secondClosestCreature = -1;
        
        for(let i = 0; i < creatures.length; i++) {
            let creature = creatures[i];
            
            if(creature != this) {
                let forceTowardsCreature = p5.Vector.sub(this.pos, creature.pos);
                let distanceToCreature = forceTowardsCreature.mag();

                // Add to spread force
                if(distanceToCreature < this.spreadDist) {
                    forceTowardsCreature.normalize();
                    forceTowardsCreature.mult(this.spreadForceSpeed);
                    spreadForce.add(forceTowardsCreature);
                }
                
                // Get closest and second closest
                if(distanceToCreature < 60 && distanceToCreature < currentClosestDistance) {
                    currentClosestDistance = distanceToCreature;
                    secondClosestCreature = closestCreature;
                    closestCreature = i;
                }
            }
        }
        // Apply spread force
        this.applyForce(spreadForce);
        
        // Draw lines for closest 
        this.drawLinesToCloseCreatures(creatures, closestCreature, secondClosestCreature);

    }

    drawLinesToCloseCreatures(creatures, closestCreature, secondClosestCreature) {
        let mouse = createVector(mouseX, mouseY);
        let distanceToMouse = p5.Vector.sub(this.pos, mouse).mag();
        let lineColorMappedToMouseDistance = mag(distanceToMouse, 0, 200, 0, 255);
        
        stroke(lineColorMappedToMouseDistance);
        if(closestCreature != -1) {
            line(this.pos.x, this.pos.y, creatures[closestCreature].pos.x, creatures[closestCreature].pos.y);
        }
        if(secondClosestCreature != -1) {
            line(this.pos.x, this.pos.y, creatures[secondClosestCreature].pos.x, creatures[secondClosestCreature].pos.y);
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