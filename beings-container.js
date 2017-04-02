
function BeingContainer() {
    this.beings = [];
    
}


BeingContainer.prototype.init = function(ctx) {
    
    
//    b = new SquareBeing();
//    b.width = 100;
//    b.fillColor = "rgba(20,200,255,0.5)";
//    b.cx = 100;
//    b.cy = 100;
//    b.addChildren(5);
//    for (var i=0; i < b.numberOfChildren(); i++) {
//        b.children[i].addChildren(Math.round(Math.random()*3));
//    }
//    b.canvasWidth = ctx.width;
//    b.canvasWidth = ctx.height;
//    this.beings.push(b);
//    
//    b = new CircleBeing();
//    b.radius = 50;
//    b.fillColor = "rgba(255,160,0,0.5)";
//    b.cx = 250;
//    b.cy = 300;
//    b.addChildren(5);
//    b.orbitalVelocity = 0;//0.01;
//    for (var i=0; i < b.numberOfChildren(); i++) {
//        b.children[i].addChildren(Math.round(Math.random()*2));
//    }
//    b.canvasWidth = ctx.width;
//    b.canvasWidth = ctx.height;
//    this.beings.push(b);
};

BeingContainer.prototype.createBeing = function(numberOfBeings, ctx) {
    for (var i=0; i < numberOfBeings; i++) {
        var b; // Being
        if (Math.random() < 0.5) {
            b = new CircleBeing();
            var r = logNormalDistribution(Math.log(70), 0.2);
            b.radius = r;
            b.fillColor = "rgba(255,160,0,0.2)";
            b.orbitalVelocity = (Math.random() - 0.5) / 10;
        } else {
            b = new SquareBeing();
            b.width = logNormalDistribution(Math.log(100), 0.25);
            b.fillColor = "rgba(20,200,255,0.5)";
            b.orbitalVelocity = (Math.random() - 0.5)*5;
        }
        
        b.cx = logNormalDistribution(Math.log(300), 0.2);
        b.cy = logNormalDistribution(Math.log(200), 0.2);
        
        b.addChildren(5);
        b.orbitalAngle = Math.PI * Math.random();
        for (var childNum=0; childNum < b.numberOfChildren(); childNum++) {
            b.children[childNum].addChildren(Math.round(Math.random()*2));
        }
        b.canvasWidth = ctx.width;
        b.canvasWidth = ctx.height;
//        console.log("Adding being " + (i+1) + ", type " + b.type + " at " + Math.round(b.cx) + ", " +  Math.round(b.cy)); 
        this.beings.push(b);
    }
};


BeingContainer.prototype.draw = function(ctx, UIctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    UIctx.clearRect(0, 0, w, h);
    
    for (var i=0; i < this.beings.length; i++) {
        var b = this.beings[i];
        b.update();
        b.draw(ctx, UIctx);
    }
};

BeingContainer.prototype.click = function(x, y) {
    var beingClicked = false;
    
    // If clicking inside one of the "Beings"...
    // toggle selection and unselect all others
    for (var i=0; i < this.beings.length; i++) {
        var b = this.beings[i];
        
        if (b.containsPoint(x, y)) {            
            // Toggle the one that was clicked on
            b.select(!b.isSelected());
            beingClicked = true;
        }
        // only allow one Being to be selected, to avoid "stacks"
        if (beingClicked) break;
    }
        
    // If clicking outside being... if one was selected, move it to click spot
    if (!beingClicked) {
        this.beings.forEach(function(b) {
            if (b.isSelected()) {
                b.setDestination(x, y);
                b.select(false);
            }
        });
    }
};