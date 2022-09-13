"use strict";

var vertices = new Float32Array([
    -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
]);

var positions = [];

/**
 * Number of points (vertices).
 * @type {Number}
 */
var numPoints = vertices.length / 2;

// A few global variables...

/**
 * Canvas width.
 * @type {Number}
 */
var w;

/**
 * Canvas height.
 * @type {Number}
 */

var h;
var sentido = true; // ACHO QUE POSSO TIRAR ISSO AQUI
var anguloTotal = 0;

var incremento = 0.03;
var angulo = 0.034;
var center;

/**
 * Maps a point in world coordinates to viewport coordinates.<br>
 * - [-n,n] x [-n,n] -> [-w,w] x [h,-h]
 * <p>Note that the Y axix points downwards.</p>
 * @param {Number} x point x coordinate.
 * @param {Number} y point y coordinate.
 * @param {Number} n window size.
 * @returns {Array<Number>} transformed point.
 */
function mapToViewport(x, y, n = 5) {
    return [((x + n / 2) * w) / n, ((-y + n / 2) * h) / n];
}

function getPosition(k) {
    let i = (k % numPoints) * 2;
    return [positions[i], positions[i + 1]];
}

function setPosition(x, y, k) {
    let i = (k % numPoints) * 2;
    positions[i] = x;
    positions[i + 1] = y;
}

/**
 * Returns the coordinates of the vertex at index i.
 * @param {Number} i vertex index.
 * @returns {Array<Number>} vertex coordinates.
 */
function getVertex(i) {
    let j = (i % numPoints) * 2;
    return [vertices[j], vertices[j + 1]];
}

function turn(x, y, ang, centro) {
    let x_novo;
    let y_novo;
    x -= centro[0]
    y -= centro[1]
    x_novo = Math.cos(ang) * x - Math.sin(ang) * y;
    y_novo = Math.sin(ang) * x + Math.cos(ang) * y;
    x_novo += centro[0];
    y_novo += centro[1];
    return [x_novo, y_novo];
}

/**
 * Code to actually render our geometry.
 * @param {CanvasRenderingContext2D} ctx canvas context.
 * @param {Number} scale scale factor.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 */

document.addEventListener('keydown', (event) => {
    var place = event.key;
    switch (place) {
        case ("a"):
            angulo = -angulo;
            break;
        case ("r"):
            center = getPosition(5);
            break;
        case ("g"):
            center = getPosition(0);
            break;
        case ("b"):
            center = getPosition(1);
            break;
        case ("w"):
            center = getPosition(2);
            break;
    }
}, false);

function draw(ctx, ang, centro) {
    ctx.fillStyle = "rgba(0, 204, 204, 1)";
    ctx.rect(0, 0, w, h);
    let colores = ["green", "blue", "white", "red", "red", "red"];
    ctx.fill();
    anguloTotal += angulo;
    ctx.beginPath();
    for (let k = 0; k < numPoints; k++) {
        if (k == 4 || k == 3) {
            continue;
        }
        let [x, y] = getPosition(k)
        let x_novo = turn(x, y, ang, center)[0];
        let y_novo = turn(x, y, ang, center)[1];
        
        // if(x_novo < 0 || x_novo > 400 || y_novo < 0 || y_novo > 400){
        //     angulo = -angulo;
        // }

        setPosition(x_novo, y_novo, k);

        if (k == 0) {
            ctx.moveTo(x_novo, y_novo);
        }
        else ctx.lineTo(x_novo, y_novo);
        
    }
    ctx.closePath();

    // the fill color
    ctx.fillStyle = "orange";
    ctx.fill();

    for (let itera = 0; itera < numPoints; itera++) {
        ctx.beginPath();
        if (itera == 3 || itera == 4) {
            continue;
        }
        let [x_novo, y_novo] = getPosition(itera);
        let x;
        let y;
        ctx.moveTo(x_novo, y_novo);
        let cent = [x_novo,y_novo];
        switch(itera){
            case(0):
                [x,y] = turn(x_novo + 10, y_novo, anguloTotal, cent);
                ctx.lineTo(x, y);
                [x,y] = turn(x_novo + 10, y_novo - 10, anguloTotal, cent);
                ctx.lineTo(x, y);
                [x,y] = turn(x_novo, y_novo - 10, anguloTotal, cent);
                ctx.lineTo(x, y);
                
                break;
            case(1):
                [x,y]=turn(x_novo-10,y_novo,anguloTotal,cent);
                ctx.lineTo(x,y);
                [x,y]=turn(x_novo-10,y_novo-10,anguloTotal,cent);
                ctx.lineTo(x,y);
                [x,y]=turn(x_novo,y_novo-10,anguloTotal,cent);
                ctx.lineTo(x,y);

                break;
            case(2):
                [x,y]=turn(x_novo-10,y_novo,anguloTotal,cent);
                ctx.lineTo(x,y);
                [x,y]=turn(x_novo-10,y_novo+10,anguloTotal,cent);
                ctx.lineTo(x,y);
                [x,y]=turn(x_novo,y_novo+10,anguloTotal,cent);
                ctx.lineTo(x,y);

                break;
            case(5):
                [x,y]=turn(x_novo+10,y_novo,anguloTotal,cent);
                ctx.lineTo(x,y);
                [x,y]=turn(x_novo+10,y_novo+10,anguloTotal,cent);
                ctx.lineTo(x,y);
                [x,y]=turn(x_novo,y_novo+10,anguloTotal,cent);
                ctx.lineTo(x,y);

                break;
        }
        ctx.fillStyle = colores[itera];
        ctx.fill();
        ctx.closePath();
    }
    ctx.closePath();
}

/**
 * <p>Entry point when page is loaded.</p>
 *
 * Basically this function does setup that "should" only have to be done once,<br>
 * while draw() does things that have to be repeated each time the canvas is
 * redrawn.
 */
function mainEntrance() {
    // retrieve <canvas> element
    var canvasElement = document.querySelector("#theCanvas");
    var ctx = canvasElement.getContext("2d");

    w = canvasElement.width;
    h = canvasElement.height;

    center = mapToViewport(...getVertex(5));

    for (let k = 0; k < numPoints; k++) {
        let [x, y] = mapToViewport(...getVertex(k));
        setPosition(x, y, k);
    }
    /**
  * A closure to set up an animation loop in which the
  * scale grows by "increment" each frame.
  * @global
  * @function
  */
    var runanimation = (() => {

        return () => {
            draw(ctx, angulo, center);
            // request that the browser calls runanimation() again "as soon as it can"
            requestAnimationFrame(runanimation);
        };
    })();

    // draw!
    runanimation();
}