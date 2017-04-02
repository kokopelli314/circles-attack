

function GameBoard() {
    this.backgroundNeedsDraw = true;
    this.gameBoardNeedsDraw = true;
    this.backgroundImage = null;
    this.width = 0;
    this.height = 0;
    
    this.mapDimensions = { width: 8, height: 8 };
    this.map = [];
    this.launchPadSize = 3;
}

GameBoard.prototype.init = function(width, height, type, bgCtx, boardCtx) {
    this.bgCtx = bgCtx;
    this.boardCtx = boardCtx;
    
    // draw initial background
    this.bgCtx.fillStyle = '#ddddff';
    this.bgCtx.fillRect(0, 0, width, height);
    
    // set up background type: either an image or morphing lines
    this.bgType = type || "image";
    
    if (this.bgType == "image") {
        this.backgroundImage = document.getElementById("img-galaxy");
    } else if (this.bgType == "morphing curve") {
        this.morph = new MorphingApp();
        console.log(this.morph);
        this.morph.init();
    }
    
    // build 2D map of Point objects
    this.createMap();
};


GameBoard.prototype.draw = function(w, h) {    
    // draw background
    if (this.backgroundNeedsDraw) {
        console.log("drawing background...");
        
        if (this.bgType == "image") {
            bgctx.drawImage(this.backgroundImage, 0, 0);
            this.backgroundNeedsDraw = false;
        } else if (this.bgType == "morphing curve") {
            this.morph.draw();
        }
    }

    // draw map / game board
    if (this.gameBoardNeedsDraw) {
        var pointWidth  = w / this.mapDimensions.width;
        var pointHeight = h / this.mapDimensions.height;

        for (var i=0; i < this.mapDimensions.height; i++) {
            for (var j=0; j < this.mapDimensions.width; j++) {
                this.map[i][j].draw(j * pointWidth, i * pointHeight,
                                   pointWidth, pointHeight, this.boardCtx);
    //                console.log(this.map[i][j].type);
            }
        }
    }

};


// Add Points to this.map, laying out the board's terrain in a 2-dimensional plane.
GameBoard.prototype.createMap = function() {
    var s = this.launchPadSize - 1;
    
    for (var i=0; i < this.mapDimensions.height; i++) {
        var mapRow = [];
        for (var j=0; j < this.mapDimensions.width; j++) {
            var point = new Point();
            point.mapCoords.x = i;
            point.mapCoords.y = j;
            
            // create color gradient                    
            if (i < s && j < s) {
                point.type = "launch pad";
                var g = this.bgCtx.createLinearGradient(0, 0, 200, 0);
                g.addColorStop(0, '#061372');
                g.addColorStop(1, 'white');
                point.fillStyle = g;
            } else if (i + s >= this.mapDimensions.height &&
                       j + s >= this.mapDimensions.width) {
                point.type = "launch pad";
                var g = this.bgCtx.createLinearGradient(400, 0, 800, 0);
                g.addColorStop(0, "#061372");
                g.addColorStop(1, "white");
                point.fillStyle = g;
            }
//            console.log("Point at " + j + ", " + i + " of type " + point.type);
            
            mapRow.push(point);
        }
        this.map.push(mapRow);
    }
};


GameBoard.prototype.resize = function(width, height) {
    this.backgroundNeedsDraw = true;
    this.gameBoardNeedsDraw = true;

};









