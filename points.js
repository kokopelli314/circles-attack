

function Point() {
    this.type = "space";
    this.mapCoords = { x: 0, y: 0 };
    this.radius = 50;
    
    this.fillColor = "rgb(125, 199, 215)";
}

Point.prototype.draw = function(x, y, w, h, ctx) {
//    console.log("Point drawing " + this.type + " at (" + this.mapCoords.x + ", " + this.mapCoords.y + ") -- " +
//                x + ", " + y + ", " + w + ", " + h);
    
    ctx.strokeStyle = "rgba(200,200,200,0.5)";
    ctx.strokeRect(x, y, x + w, y + h);
    
    if (this.type == "launch pad") {
        var fillStart = { x: x - w / 2,
                          y: y - h / 2 };
        var fillEnd = { x: fillStart.x + w,
                        y: fillStart.y + h };
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(fillStart.x, fillStart.y, w*2, h*2);

        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.strokeRect(fillStart.x, fillStart.y, w*2, h*2);
    }

//    ctx.fillStyle = "red";
//    ctx.font = "20px mono";
//    ctx.fillText(this.mapCoords.x + ", " + this.mapCoords.y, x, y + h/3);
};

