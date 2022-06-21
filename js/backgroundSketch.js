let creaturesHandler;

function setup() {
    let myCanvas = createCanvas($(window).width(), $(window).height());
    myCanvas.id("myCanvas");
    myCanvas.parent("welcome");

    let creatureCount = 150;
    if(isMovileDevice()) {
        creatureCount = 50;
    }

    creaturesHandler = new CreaturesHandler(creatureCount);
}

function isMovileDevice () {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return true;
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return true;
    }
    return false;
};

function windowResized() {
    resizeCanvas($(window).width(), $(window).height());
}

function draw() {
    background(40);
    
    creaturesHandler.runSeekPoint();
    creaturesHandler.runCreatures();
}