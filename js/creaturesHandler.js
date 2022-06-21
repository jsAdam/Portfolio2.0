class CreaturesHandler {
    constructor(numberOfCreatures) {
        this.populateCreatures(numberOfCreatures);
        
        this.creaturesSeekPoint = createVector(random(0, width), random(0, height));
        this.creaturesSeekPointChangeTime = {
            start: millis(),
            duration: random(2000, 4000)
        };
    }

    populateCreatures(numberOfCreatures) {
        this.creatures = [];

        for(let i = 0; i < numberOfCreatures; i++) {
            this.creatures.push(new Creature(random(0, width), random(0, height)));
        }
    }

    runSeekPoint() {
        if(millis() > this.creaturesSeekPointChangeTime.start + this.creaturesSeekPointChangeTime.duration) {
            this.creaturesSeekPoint = createVector(random(0, width), random(0, height));
            this.creaturesSeekPointChangeTime.start = millis();
            this.creaturesSeekPointChangeTime.duration = random(1000, 2000);
        }
    }

    runCreatures() {
        let mouse = createVector(mouseX, mouseY);
        let mouseOutOfCanvas = false;

        mouseOutOfCanvas = true;
        
        for(let creature of this.creatures) {
            if(!mouseOutOfCanvas) {
                creature.seek(mouse);
            } else {
                creature.seek(this.creaturesSeekPoint);
            }

            creature.spreadAndDrawLines(this.creatures);
            creature.update();
        }
    }
}