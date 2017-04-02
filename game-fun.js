
var game;

// Start it all up
window.onload = function() {
    game = new Game();
    game.init();
    game.setCanvasSize(window.innerWidth, window.innerHeight);
};

// Adjust for browser resizing
window.onresize = function() {
    console.log("window w, h: " + window.innerWidth + ", " + window.innerHeight);
    game.setCanvasSize(window.innerWidth, window.innerHeight);
};


//////////////////////////////
// Main Game class
// Contains classes for game board, beings, and HTML canvasses
//////////////////////////////
function Game() {
    //////////////////////////////
    /* HTML Canvas and contexts */
    //////////////////////////////
    this.gameCanvas = document.getElementById("game-canvas");
    this.uiCanvas = document.getElementById("ui-canvas");
    this.boardCanvas = document.getElementById("gameboard-canvas");
    this.bgCanvas = document.getElementById("background-canvas");
    
    // game & main graphics context
    this.ctx = this.gameCanvas.getContext("2d");
    
    // UI context
    this.UIctx = this.uiCanvas.getContext("2d"); 
    
    // Game board context
    this.boardCtx = this.boardCanvas.getContext("2d");
    
    // Background context
    this.bgctx = this.bgCanvas.getContext("2d"); 
    
    this.width = this.gameCanvas.width;
    this.height = this.gameCanvas.height;
    
    
    //////////////////////////////
    /* Game logic               */
    //////////////////////////////
    // Game's "zoom"/scale
    this.currentScale = 1;
    
    // Input responses...
    var self = this;
    this.input = new InputTracker(self);
    
    // The Game Board 
    this.gameBoard = new GameBoard();
    
    // The players, a.k.a. Beings
    this.beingBox = new BeingContainer();
    
    // Current origin of player's view (after translation, etc.)
    this.origin = {
        x: 0,
        y: 0
    };
    
    this.isRunning = false;
    this.frameNum = 0;
}


Game.prototype.init = function() {
    this.isRunning = true;
    this.input.init();
    
    this.gameBoard.init(this.width, this.height, "morphing curve", this.bgctx, this.boardCtx);
    this.beingBox.createBeing(3, this.ctx);
    
    this.scaleTo(this.currentScale);
    this.ctx.lineWidth = 3;
    this.draw();
};


Game.prototype.draw = function() {    
    
    // draw background (every few frames)
    if (this.frameNum % 6 == 0) {
        this.gameBoard.draw(this.width, this.height);
    }

    // draw Beings
    this.beingBox.draw(this.ctx, this.UIctx, this.width / this.currentScale,
                       this.height / this.currentScale);

    if (this.isRunning) {
        this.frameNum++;
        window.requestAnimationFrame(this.draw.bind(this));
    }
};


Game.prototype.scaleTo = function(scale) {
    this.ctx.scale(scale, scale);
    this.UIctx.scale(scale, scale);
    this.bgctx.scale(scale, scale);
    this.boardCtx.scale(scale, scale);
    this.currentScale = scale;
    
//    this.width /= scale;
//    this.height /= scale;
};

// adjust for responsiveness to different window sizes
Game.prototype.setCanvasSize = function(windowWidth, windowHeight) {
    // Set canvas size to just under the full window size
    var width = Math.round(0.9 * windowWidth);
    var height = Math.round(0.9 * windowHeight);
    
    this.width = width;
    this.height = height;
    
    this.gameCanvas.width = width;
    this.gameCanvas.height = height;
    this.uiCanvas.width = width;
    this.uiCanvas.height = height;
    this.boardCanvas.width = width;
    this.boardCanvas.height = height;
    this.bgCanvas.width = width;
    this.bgCanvas.height = height;
};