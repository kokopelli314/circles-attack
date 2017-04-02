// Class to congregate input functions into
function InputTracker(game) {
    this.lastMouseDownX = 0;
    this.lastMouseDownY = 0;
    this.mouseCurrentlyDown = false;
    this.multiSelect = false;
    this.minimumScroll = 10;
    this.game = game;
} 

// Initialize event listeners
InputTracker.prototype.init = function() {
    var canvas = document.getElementById("ui-canvas");
    canvas.addEventListener("mousedown", this.mouseClicked.bind(this));
    canvas.addEventListener("mouseup", this.mouseUp.bind(this));
    canvas.addEventListener("mousemove", this.mouseMoved.bind(this));
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));
}

// Select Beings, or direct any already selected Beings
InputTracker.prototype.mouseClicked = function(event) {
    mouseCurrentlyDown = true;
    
    var canvas = this.game.gameCanvas;
    
    var x = (event.pageX - canvas.offsetLeft) / this.game.currentScale;
    var y = (event.pageY - canvas.offsetTop) / this.game.currentScale; 
    
    console.log(event.type + " event: (" + (event.pageX - canvas.offsetLeft) +
                ", " + (event.pageY - canvas.offsetTop) + "); scaled to: (" +
                x + ", " + y + ")");
    
    this.lastMouseDownX = x;
    this.lastMouseDownY = y;
    
    this.game.beingBox.click(x, y);
}

InputTracker.prototype.mouseMoved = function(event) {
    if (this.mouseCurrentlyDown) {
//        var x = event.clientX;
//        var y = event.clientY;
//        
//        var dx = x - this.lastMouseDownX;
//        var dy = y - this.lastMouseDownY;
//        
//        if (Math.abs(dx) < this.minimumScroll &&console.log(b.type + i + " at (" + Math.round(b.x) + ", " +
//                Math.round(b.y) + "): selected set to " + b.isSelected());
//            Math.abs(dy) < this.minimumScroll) {
//            console.log("dx only" + dx);
//            return;
//        }         
//
////        this.game.ctx.translate(dx, dy);
//        this.game.origin.x += dx;
//        this.game.origin.y += dy;
//        
//        console.log("Origin: " + this.game.origin.x + ", " + this.game.origin.y);
//        
//        this.lastMouseDownX = x;
//        this.lastMouseDownY = y;
    }
}

InputTracker.prototype.mouseUp = function(event) {
    this.mouseCurrentlyDown = false;
}


// Keyboard events
InputTracker.prototype.keyDown = function(event) {
    // Pause game on spacebar    
    if (event.keyCode == 32) {
        var gameWasntRunning = (this.game.isRunning == false);
        this.game.isRunning = !this.game.isRunning;
        
        if (gameWasntRunning) this.game.draw();
    }
    
    // Holding Control selects multiple Beings
    if (event.keyCode == 17) {
        this.multiSelect = true;
    }
}

InputTracker.prototype.keyUp = function(event) {
    // Holding Control selects multiple Beings; let go to select one at a time
    if (event.keyCode == 17) {
        this.multiSelect = false;
    }
}