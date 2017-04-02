
function Being() {
    this.type = "Generic";
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.x = 0;
    this.y = 0;
    
    this.children = [];
    this.topTravelSpeed = 2;
    this.destX = null;
    this.destY = null;
    this.selected = false;
}

Being.prototype.draw = function(ctx) {
    alert("woops! Being.draw() has been called");
};

Being.prototype.numberOfChildren = function() {
    return this.children.length;
};

Being.prototype.setDestination = function(destX, destY) {
    this.destX = destX;
    this.destY = destY;
    this.vx = Math.sign(destX - this.x) * this.topTravelSpeed;
    this.vy = Math.sign(destY - this.y) * this.topTravelSpeed;
};


// selected: boolean telling Being if it has been selected to be moved 
Being.prototype.select = function(selected) {
    this.selected = selected;
};

Being.prototype.isSelected = function() {
    return this.selected;
};

Being.prototype.containsPoint = function(x, y) {
    return (Math.abs(this.x - x) < this.size && Math.abs(this.y - y) < this.size);
};

Being.prototype.getColorFromType = function() {
    if (this.colorType == "orange") {
        
    } else if (this.colorType == "black") {
        
    }
};





// Inherits Being
function CircleBeing(parent) {
    Being.call(this);
    this.parent = parent;
    this.type = "Circle";
    this.colorType = "orange";
    this.color = "rgb(255,60,0)";
    this.fillColor = "rgba(0,0,0,0)";
    this.radius = 50;

    this.vy = 0;
    this.vx = 0;
    this.cx = 0;
    this.cy = 0;

    this.orbitalRadius = 50;
    this.orbitalAngle = 0;
    this.orbitalVelocity = 0.01;
    this.parentOrbitalOffsetX = Math.round((Math.random()-0.5) * 30);
    this.parentOrbitalOffsetY = Math.round((Math.random()-0.5) * 30);
}

CircleBeing.prototype = Object.create(Being.prototype);
CircleBeing.prototype.constructor = CircleBeing;

CircleBeing.prototype.draw = function(ctx, UIctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 4;
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = this.fillColor;
    ctx.fill();
        
    ctx.restore();
    
    for (var i=0; i < this.children.length; i++) {
        this.children[i].draw(ctx);
    }
    
    // If this is currently selected, draw a dashed border around it
    if (this.isSelected()) {
        UIctx.save();
        UIctx.translate(this.x, this.y);
        
        UIctx.setLineDash([5, 15]);
        UIctx.beginPath();
        UIctx.moveTo(this.radius + 10, 0);
        
        UIctx.lineWidth = 2;
        UIctx.strokeStyle = "rgb(170, 235, 255)";
        UIctx.arc(0, 0, this.radius + 10, 0, Math.PI * 2);
        UIctx.stroke();
        UIctx.restore();
    }
};

CircleBeing.prototype.update = function() {
    // Parent-less Beings orbit around their own cx/cy; child Beings orbit around parent's location
    var cx, cy;
    if (this.parent == null) {
        // Have we reached our destination (if any)?
        this.checkDestination();
    } else {
        this.cx = this.parent.x + this.parentOrbitalOffsetX;
        this.cy = this.parent.y + this.parentOrbitalOffsetY;
    }
    
    this.cx += this.vx;
    this.cy += this.vy;
        
    this.orbitalAngle += this.orbitalVelocity;
    this.x = this.cx + Math.cos(this.orbitalAngle) * this.orbitalRadius;
    this.y = this.cy + Math.sin(this.orbitalAngle) * this.orbitalRadius;
    
    for (var i=0; i < this.children.length; i++) {
        this.children[i].update();
    }
};

CircleBeing.prototype.checkDestination = function() {
    if (this.destX != null) {
        if (Math.abs(this.x - this.destX) < 10) {
            this.vx = 0;
            this.destX = null;
        }
    }
    if (this.destY != null) {
        if (Math.abs(this.y - this.destY) < 10) {
            this.vy = 0;
            this.destY = null;
        }
    }
};

// add children CircleBeings with randomized sizes, speeds, and radii
CircleBeing.prototype.addChildren = function(numChildren) {
    for (var i=0; i < numChildren; i++) {
        var b = new CircleBeing(this);
        b.radius = this.radius / (2 + Math.random());
        
        b.orbitalRadius = this.radius * (0.3 + Math.random()*2);
        b.orbitalAngle = Math.random() * Math.PI * 2;
        
        // increase speed and give a 50/50 chance of clockwise vs counter-clockwise
        b.orbitalVelocity = Math.max(0.005, this.orbitalVelocity) * (1 + Math.random());
        b.orbitalVelocity *= Math.random() < 0.5 ? -1 : +1;
        
        b.colorType = this.colorType;
        if (this.colorType == "orange") {
            b.color = "rgba(" + Math.round(200+Math.random()*55) + "," + Math.round(50+Math.random()*100) + ",0,0.6)";
        }
        
        this.children.push(b);
    }
};

CircleBeing.prototype.containsPoint = function(x, y) {
    // Pythagorean theorem
    var d = Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
    return (d < this.radius);
};





// Inherits Being
function SquareBeing(parent) {
    Being.call(this);
    this.parent = parent;
    this.type = "Square";
    this.colorType = "blue";
    this.color = "rgb(0,80,255)";
    this.fillColor = "rgba(0,0,0,0)";
    this.width = 50;
    
    this.vy = 0;
    this.vx = 0;
    this.cx = 0;
    this.cy = 0;
    
    this.orbitalSide = 1; // 1: top/bottom; 2: left/right
    this.orbitalWidth = 100;
    this.orbitalX = 0.01;
    this.orbitalY = 0.01;
    this.orbitalVelocity = 0.5;
    this.parentOrbitalOffsetX = Math.round((Math.random()-0.5) * 30);
    this.parentOrbitalOffsetY = Math.round((Math.random()-0.5) * 30);
}

SquareBeing.prototype = Object.create(Being.prototype);
SquareBeing.prototype.constructor = SquareBeing;

SquareBeing.prototype.draw = function(ctx, UIctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    ctx.strokeStyle = this.color;  
    ctx.lineWidth = 4;
    ctx.fillStyle = this.fillColor;
    
    var cornerOffset = -this.width / 2;
    ctx.fillRect(cornerOffset, cornerOffset, this.width, this.width);
    ctx.strokeRect(cornerOffset, cornerOffset, this.width, this.width);
    
    ctx.restore(); 
    
    for (var i=0; i < this.children.length; i++) {
        this.children[i].draw(ctx);
    }
    
    // If this is currently selected, draw a dashed border around it
    if (this.isSelected()) {
        UIctx.save();
        UIctx.translate(this.x, this.y);
        
        UIctx.lineWidth = 2;
        UIctx.setLineDash([5, 15]);
        UIctx.strokeStyle = "rgb(175, 235, 255)";
        UIctx.strokeRect(cornerOffset-10, cornerOffset-10, this.width+20, this.width+20);
        
        UIctx.restore();
    }
};

SquareBeing.prototype.update = function() {
    // Parent-less Beings orbit around their own cx/cy; child Beings orbit around parent's location
    var cx, cy;
    if (this.parent == null) {
        // Have we reached our destination (if any)?
        this.checkDestination();
    } else {
        this.cx = this.parent.x + this.parentOrbitalOffsetX;
        this.cy = this.parent.y + this.parentOrbitalOffsetY;
    }
    
    // Check what side of square orbit is on
    if (this.orbitalSide == 1) { // Top or bottom
        this.orbitalX += this.orbitalVelocity;
        // Move to right/left side if X exceeded
        if (Math.abs(this.orbitalX) >= this.orbitalWidth/2) {
            this.orbitalSide = 2;
            this.orbitalVelocity *= -1;
        }
    } else { // Left or right (this.orbitalSide == 2)
        this.orbitalY += this.orbitalVelocity;
        // Move to top/bottom of orbit if Y exceeded
        if (Math.abs(this.orbitalY) >= this.orbitalWidth/2)
            this.orbitalSide = 1;
    }
    
    this.cx += this.vx;
    this.cy += this.vy;
    
    this.x = this.cx + this.orbitalX;
    this.y = this.cy + this.orbitalY;
    
    for (var i=0; i < this.children.length; i++) {
        this.children[i].update();
    }
};

SquareBeing.prototype.checkDestination = function() {
    if (this.destX != null) {
        if (Math.abs(this.x - this.destX) < 10) {
            this.vx = 0;
            this.destX = null;
        }
    }
    if (this.destY != null) {
        if (Math.abs(this.y - this.destY) < 10) {
            this.vy = 0;
            this.destY = null;
        }
    }
};

SquareBeing.prototype.addChildren = function(numChildren) {
    for (var i=0; i < numChildren; i++) {
        var b = new SquareBeing(this);
        
        b.width = this.width / (2 + Math.random());
        b.orbitalWidth = this.width * (Math.random()+0.75);
        
        // increase speed and give a 50/50 chance of clockwise vs counter-clockwise
        b.orbitalVelocity = Math.max(0.05, this.orbitalVelocity) * (1 + Math.random());
        b.orbitalVelocity *= Math.random() < 0.5 ? -1 : +1;
        
        // 50-50 chance of beginning on top or side of orbit
        b.orbitalSide = Math.random() < 0.5 ? 1 : 2;
        
        b.colorType = this.colorType;
        if (this.colorType == "blue") {
            b.color = "rgba(0," + Math.round(50+Math.random()*150) + "," + Math.round(190+Math.random()*65) + ",0.6)";
        }

        this.children.push(b);
    }
};


SquareBeing.prototype.containsPoint = function(x, y) {
    return (Math.abs(this.x - x) < this.width/2 && Math.abs(this.y - y) < this.width/2);
};
